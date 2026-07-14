"""Chat API routes."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import generate_reply

router = APIRouter(prefix="/chat", tags=["chat"])


def _optional_db() -> Session | None:
    """Open a DB session if Postgres is reachable; otherwise return None."""
    db: Session | None = None
    try:
        db = SessionLocal()
        # Force a cheap connectivity check without requiring tables
        db.connection()
        return db
    except Exception:  # noqa: BLE001
        if db is not None:
            try:
                db.close()
            except Exception:  # noqa: BLE001
                pass
        return None


@router.post("", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    db = _optional_db()
    try:
        try:
            reply, persona_name = generate_reply(
                db,
                persona_key=payload.persona_key,
                message=payload.message,
                history=[m.model_dump() for m in payload.history],
            )
        except RuntimeError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except Exception as exc:  # noqa: BLE001
            raise HTTPException(
                status_code=502,
                detail=f"AI provider error: {exc}",
            ) from exc

        return ChatResponse(
            reply=reply,
            persona_key=payload.persona_key,
            persona_name=persona_name,
        )
    finally:
        if db is not None:
            try:
                db.close()
            except Exception:  # noqa: BLE001
                pass
