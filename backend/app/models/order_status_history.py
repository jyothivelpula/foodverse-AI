from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.enums import OrderStage


class OrderStatusHistory(Base):
    """Append-only log of every stage an order passes through, powering the
    live order-tracking timeline (Placed -> Confirmed -> ... -> Delivered)."""

    __tablename__ = "order_status_history"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)

    stage: Mapped[OrderStage] = mapped_column(Enum(OrderStage), nullable=False)
    note: Mapped[str | None] = mapped_column(String(300), nullable=True)
    changed_by_admin_id: Mapped[int | None] = mapped_column(ForeignKey("admins.id", ondelete="SET NULL"), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    order: Mapped["Order"] = relationship(back_populates="status_history")