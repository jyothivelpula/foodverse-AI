"""FoodVerse AI FastAPI application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import chat

app = FastAPI(
    title="FoodVerse AI",
    description="Smart restaurant API with AI companions",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)


@app.get("/")
def root():
    return {"message": "FoodVerse AI API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
