"""In-memory live order store with WebSocket fan-out."""

from __future__ import annotations

import asyncio
import time
from typing import Any
from uuid import uuid4

from app.services.order_status import (
    STATUS_LABELS,
    STATUS_MESSAGES,
    LiveOrderStatus,
    canonicalize_status,
    next_status,
    progress_percent,
    status_index,
)


class OrderHub:
    def __init__(self) -> None:
        self._orders: dict[str, dict[str, Any]] = {}
        self._order_subs: dict[str, set[asyncio.Queue]] = {}
        self._kitchen_subs: set[asyncio.Queue] = set()
        self._lock = asyncio.Lock()

    def _serialize(self, order: dict[str, Any]) -> dict[str, Any]:
        status = canonicalize_status(order["status"])
        return {
            **order,
            "status": status,
            "status_label": STATUS_LABELS.get(status, status),
            "progress_percent": progress_percent(status),
            "status_index": status_index(status),
            "next_status": next_status(status),
            "next_status_label": STATUS_LABELS.get(next_status(status) or "", None),
        }

    async def create_order(
        self,
        *,
        items: list[dict[str, Any]],
        customer_name: str,
        customer_email: str = "",
        estimated_minutes: int = 30,
        order_id: str | None = None,
    ) -> dict[str, Any]:
        oid = order_id or f"FV-{uuid4().hex[:8].upper()}"
        total = sum(float(i.get("price", 0)) * int(i.get("quantity", 0)) for i in items)
        now = int(time.time() * 1000)
        order = {
            "id": oid,
            "status": LiveOrderStatus.PENDING.value,
            "items": items,
            "total": total,
            "created_at": now,
            "updated_at": now,
            "customer_name": customer_name,
            "customer_email": customer_email,
            "item_count": sum(int(i.get("quantity", 0)) for i in items),
            "estimated_minutes": estimated_minutes,
            "message": "Order placed — waiting for the kitchen.",
        }
        async with self._lock:
            self._orders[oid] = order
        payload = self._serialize(order)
        await self._broadcast_order(oid, {"type": "order_created", "order": payload})
        await self._broadcast_kitchen({"type": "order_created", "order": payload})
        return payload

    async def get_order(self, order_id: str) -> dict[str, Any] | None:
        order = self._orders.get(order_id)
        return self._serialize(order) if order else None

    async def list_orders(self, status: str | None = None) -> list[dict[str, Any]]:
        orders = list(self._orders.values())
        if status == "pending":
            orders = [o for o in orders if o["status"] == LiveOrderStatus.PENDING.value]
        elif status == "active":
            terminal = {
                LiveOrderStatus.PENDING.value,
                LiveOrderStatus.DELIVERED.value,
                LiveOrderStatus.REJECTED.value,
            }
            orders = [o for o in orders if o["status"] not in terminal]
        elif status == "completed":
            orders = [o for o in orders if o["status"] == LiveOrderStatus.DELIVERED.value]
        elif status == "rejected":
            orders = [o for o in orders if o["status"] == LiveOrderStatus.REJECTED.value]
        elif status:
            orders = [o for o in orders if o["status"] == status]
        orders.sort(key=lambda o: o["updated_at"], reverse=True)
        return [self._serialize(o) for o in orders]

    async def set_status(
        self,
        order_id: str,
        status: str,
        *,
        message: str | None = None,
    ) -> dict[str, Any] | None:
        async with self._lock:
            order = self._orders.get(order_id)
            if not order:
                return None
            status = canonicalize_status(status)
            order["status"] = status
            order["updated_at"] = int(time.time() * 1000)
            if message is not None:
                order["message"] = message
            else:
                order["message"] = STATUS_MESSAGES.get(
                    status, f"Status updated: {STATUS_LABELS.get(status, status)}"
                )
            snapshot = dict(order)

        payload = self._serialize(snapshot)
        event = {"type": "status_update", "order": payload}
        await self._broadcast_order(order_id, event)
        await self._broadcast_kitchen(event)
        return payload

    async def accept(self, order_id: str) -> dict[str, Any] | None:
        return await self.set_status(
            order_id,
            LiveOrderStatus.ACCEPTED.value,
            message=STATUS_MESSAGES[LiveOrderStatus.ACCEPTED.value],
        )

    async def reject(self, order_id: str) -> dict[str, Any] | None:
        return await self.set_status(
            order_id,
            LiveOrderStatus.REJECTED.value,
            message=STATUS_MESSAGES[LiveOrderStatus.REJECTED.value],
        )

    async def advance(self, order_id: str) -> dict[str, Any] | None:
        order = self._orders.get(order_id)
        if not order:
            return None
        # Upgrade any leftover multi-step status before advancing
        current = canonicalize_status(order["status"])
        if current != order["status"]:
            order["status"] = current
        nxt = next_status(current)
        if not nxt:
            return self._serialize(order)
        return await self.set_status(order_id, nxt)

    def subscribe_order(self, order_id: str) -> asyncio.Queue:
        q: asyncio.Queue = asyncio.Queue(maxsize=32)
        self._order_subs.setdefault(order_id, set()).add(q)
        return q

    def unsubscribe_order(self, order_id: str, q: asyncio.Queue) -> None:
        subs = self._order_subs.get(order_id)
        if not subs:
            return
        subs.discard(q)
        if not subs:
            self._order_subs.pop(order_id, None)

    def subscribe_kitchen(self) -> asyncio.Queue:
        q: asyncio.Queue = asyncio.Queue(maxsize=64)
        self._kitchen_subs.add(q)
        return q

    def unsubscribe_kitchen(self, q: asyncio.Queue) -> None:
        self._kitchen_subs.discard(q)

    async def _broadcast_order(self, order_id: str, event: dict[str, Any]) -> None:
        for q in list(self._order_subs.get(order_id, set())):
            try:
                q.put_nowait(event)
            except asyncio.QueueFull:
                pass

    async def _broadcast_kitchen(self, event: dict[str, Any]) -> None:
        for q in list(self._kitchen_subs):
            try:
                q.put_nowait(event)
            except asyncio.QueueFull:
                pass


order_hub = OrderHub()
