from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Persona(Base):
    """One AI companion personality (Master Chef, Business Mentor, etc.)."""

    __tablename__ = "personas"

    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)  # e.g. "master_chef"
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g. "Master Chef"
    emoji: Mapped[str | None] = mapped_column(String(10), nullable=True)
    tagline: Mapped[str | None] = mapped_column(String(200), nullable=True)  # e.g. "Food suggestions and cooking tips"
    system_prompt: Mapped[str] = mapped_column(Text, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    display_order: Mapped[int] = mapped_column(default=0)

    chat_sessions: Mapped[list["ChatSession"]] = relationship(back_populates="persona")