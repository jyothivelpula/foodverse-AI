"""FoodVerse AI FastAPI application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, chat, orders

app = FastAPI(
    title="FoodVerse AI",
    description="Smart restaurant API with AI companions",
    version="0.1.0",
)

# Bearer JWT in Authorization header — no cookies — so wildcard CORS is safe.
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
    return {
        "status": "ok",
        "groq_configured": bool(key),
        "groq_key_prefix": key[:7] if len(key) >= 7 else None,
    }
