"""FoodVerse AI FastAPI application."""

from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.routers import auth, chat, orders


def _probe_database(*, init_schema: bool = False) -> dict:
    """Live DB check for /health. Optionally create tables + demo users."""
    from app.config import database_host_hint, get_settings

    settings = get_settings()
    env_set = bool(os.getenv("DATABASE_URL") or os.getenv("database_url"))
    info = {
        "database": "unavailable",
        "tables": False,
        "demo_users": False,
        "database_url_env_set": env_set,
        "database_host": database_host_hint(settings.database_url),
        "on_render": bool(os.getenv("RENDER") or os.getenv("RENDER_SERVICE_ID")),
    }

    try:
        from app.core.security import hash_password
        from app.database import Base, SessionLocal, engine
        from app import models  # noqa: F401
        from app.models.enums import UserRole
        from app.models.user import User

        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            conn.commit()

        info["database"] = "ok"

        if init_schema:
            Base.metadata.create_all(bind=engine)
            info["tables"] = True

            demos = [
                ("Demo Customer", "customer@foodverse.com", "password123", UserRole.CUSTOMER.value),
                ("Demo Chef", "chef@foodverse.com", "password123", UserRole.CHEF.value),
            ]
            db = SessionLocal()
            try:
                created = 0
                for name, email, password, role in demos:
                    if db.query(User).filter(User.email == email).first():
                        continue
                    db.add(
                        User(
                            name=name,
                            email=email,
                            hashed_password=hash_password(password),
                            role=role,
                        )
                    )
                    created += 1
                db.commit()
                info["demo_users"] = True
                info["demo_users_created"] = created
            finally:
                db.close()
        else:
            info["tables"] = True
            info["demo_users"] = True
    except Exception as exc:  # noqa: BLE001
        info["database"] = "error"
        info["error"] = str(exc)[:300]
    return info


@asynccontextmanager
async def lifespan(_app: FastAPI):
    _app.state.db_info = _probe_database(init_schema=True)
    yield


app = FastAPI(
    title="FoodVerse AI",
    description="Smart restaurant API with AI companions",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(orders.router)


@app.get("/")
def root():
    return {"message": "FoodVerse AI API", "docs": "/docs"}


@app.get("/health")
def health():
    from app.config import get_settings

    settings = get_settings()
    key = (settings.groq_api_key or "").strip()
    # Live probe every request so /health reflects current DATABASE_URL
    live = _probe_database(init_schema=False)
    boot = getattr(app.state, "db_info", {}) or {}
    return {
        "status": "ok",
        "groq_configured": bool(key),
        "groq_key_prefix": key[:7] if len(key) >= 7 else None,
        "database": live.get("database"),
        "database_url_env_set": live.get("database_url_env_set"),
        "database_host": live.get("database_host"),
        "on_render": live.get("on_render"),
        "tables": boot.get("tables"),
        "demo_users": boot.get("demo_users"),
        "db_error": live.get("error") or boot.get("error"),
    }
