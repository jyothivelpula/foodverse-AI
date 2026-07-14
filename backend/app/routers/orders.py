"""REST + WebSocket live order tracking (in-memory hub)."""

from __future__ import annotations

import asyncio
import json

from fastapi import APIRouter, HTTPException, Query, WebSocket, WebSocketDisconnect

from app.schemas.orders import CreateOrderRequest, StatusUpdateRequest
from app.services.order_hub import order_hub
from app.services.order_status import STATUS_LABELS, LiveOrderStatus, next_status

router = APIRouter(tags=["orders"])


@router.get("/orders/meta/flow")
async def order_flow_meta():
    return {
        "flow": [
            s.value
            for s in [
                LiveOrderStatus.PENDING,
                LiveOrderStatus.ACCEPTED,
                LiveOrderStatus.COOKING,
                LiveOrderStatus.DELIVERED,
            ]
        ],
        "labels": STATUS_LABELS,
        "notifications": {
            LiveOrderStatus.ACCEPTED.value: "Chef accepted your order.",
            LiveOrderStatus.COOKING.value: "Cooking Started",
            LiveOrderStatus.DELIVERED.value: "Done",
        },
        "advance_hint": {
            s.value: next_status(s.value)
            for s in LiveOrderStatus
            if next_status(s.value)
        },
    }


@router.post("/orders")
async def create_order(payload: CreateOrderRequest):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Order must include items")
    order = await order_hub.create_order(
        items=[i.model_dump() for i in payload.items],
        customer_name=payload.customer_name.strip(),
        customer_email=(payload.customer_email or "").strip(),
        estimated_minutes=payload.estimated_minutes,
        order_id=payload.order_id,
    )
    return order


@router.get("/orders")
async def list_orders(status: str | None = Query(default=None)):
    return await order_hub.list_orders(status=status)


@router.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await order_hub.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/orders/{order_id}/accept")
async def accept_order(order_id: str):
    order = await order_hub.accept(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/orders/{order_id}/reject")
async def reject_order(order_id: str):
    order = await order_hub.reject(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/orders/{order_id}/advance")
async def advance_order(order_id: str):
    order = await order_hub.advance(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.patch("/orders/{order_id}/status")
async def patch_status(order_id: str, payload: StatusUpdateRequest):
    if payload.status not in STATUS_LABELS:
        raise HTTPException(status_code=400, detail="Invalid status")
    order = await order_hub.set_status(
        order_id, payload.status, message=payload.message
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


async def _ws_pump(websocket: WebSocket, queue: asyncio.Queue) -> None:
    while True:
        event = await queue.get()
        await websocket.send_text(json.dumps(event))


@router.websocket("/ws/orders/{order_id}")
async def ws_order(websocket: WebSocket, order_id: str):
    await websocket.accept()
    queue = order_hub.subscribe_order(order_id)
    try:
        current = await order_hub.get_order(order_id)
        if current:
            await websocket.send_text(
                json.dumps({"type": "snapshot", "order": current})
            )
        pump = asyncio.create_task(_ws_pump(websocket, queue))
        try:
            while True:
                raw = await websocket.receive_text()
                if raw == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
        finally:
            pump.cancel()
    except WebSocketDisconnect:
        pass
    finally:
        order_hub.unsubscribe_order(order_id, queue)


@router.websocket("/ws/kitchen")
async def ws_kitchen(websocket: WebSocket):
    await websocket.accept()
    queue = order_hub.subscribe_kitchen()
    try:
        pending = await order_hub.list_orders()
        await websocket.send_text(
            json.dumps({"type": "snapshot", "orders": pending})
        )
        pump = asyncio.create_task(_ws_pump(websocket, queue))
        try:
            while True:
                raw = await websocket.receive_text()
                if raw == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
        finally:
            pump.cancel()
    except WebSocketDisconnect:
        pass
    finally:
        order_hub.unsubscribe_kitchen(queue)
