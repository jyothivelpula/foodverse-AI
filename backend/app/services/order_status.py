"""Shared order status vocabulary for real-time tracking.

Pipeline (customer notifications match these milestones):
  pending → accepted → cooking → delivered
"""

from __future__ import annotations

from enum import Enum


class LiveOrderStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    COOKING = "cooking"
    DELIVERED = "delivered"
    REJECTED = "rejected"


# Map leftover multi-step statuses from the old pipeline onto the new one.
LEGACY_STATUS_MAP: dict[str, str] = {
    "preparing_ingredients": LiveOrderStatus.COOKING.value,
    "quality_check": LiveOrderStatus.COOKING.value,
    "packing": LiveOrderStatus.COOKING.value,
    "ready": LiveOrderStatus.DELIVERED.value,
    "out_for_delivery": LiveOrderStatus.DELIVERED.value,
}


def canonicalize_status(status: str) -> str:
    return LEGACY_STATUS_MAP.get(status, status)


# Customer-facing timeline (excludes rejected)
TRACKING_FLOW: list[LiveOrderStatus] = [
    LiveOrderStatus.PENDING,
    LiveOrderStatus.ACCEPTED,
    LiveOrderStatus.COOKING,
    LiveOrderStatus.DELIVERED,
]

STATUS_LABELS: dict[str, str] = {
    LiveOrderStatus.PENDING.value: "Pending",
    LiveOrderStatus.ACCEPTED.value: "Accepted",
    LiveOrderStatus.COOKING.value: "Cooking",
    LiveOrderStatus.DELIVERED.value: "Done",
    LiveOrderStatus.REJECTED.value: "Rejected",
}

# Chef one-click advance path after accept
ADVANCE_FLOW: list[LiveOrderStatus] = [
    LiveOrderStatus.ACCEPTED,
    LiveOrderStatus.COOKING,
    LiveOrderStatus.DELIVERED,
]

STATUS_MESSAGES: dict[str, str] = {
    LiveOrderStatus.PENDING.value: "Order placed — waiting for the kitchen.",
    LiveOrderStatus.ACCEPTED.value: "Chef accepted your order.",
    LiveOrderStatus.COOKING.value: "Your food is now Cooking",
    LiveOrderStatus.DELIVERED.value: "Done",
    LiveOrderStatus.REJECTED.value: "Your order has been rejected.",
}


def next_status(current: str) -> str | None:
    current = canonicalize_status(current)
    try:
        idx = [s.value for s in ADVANCE_FLOW].index(current)
    except ValueError:
        return None
    if idx >= len(ADVANCE_FLOW) - 1:
        return None
    return ADVANCE_FLOW[idx + 1].value


def progress_percent(status: str) -> int:
    status = canonicalize_status(status)
    if status == LiveOrderStatus.REJECTED.value:
        return 0
    try:
        idx = [s.value for s in TRACKING_FLOW].index(status)
    except ValueError:
        return 0
    if len(TRACKING_FLOW) <= 1:
        return 100
    return int(round((idx / (len(TRACKING_FLOW) - 1)) * 100))


def status_index(status: str) -> int:
    status = canonicalize_status(status)
    try:
        return [s.value for s in TRACKING_FLOW].index(status)
    except ValueError:
        return 0
