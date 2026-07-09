"""Chat request/response schemas."""

from pydantic import BaseModel, Field


class ChatMessageIn(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str


class ChatRequest(BaseModel):
    persona_key: str
    message: str = Field(..., min_length=1, max_length=4000)
    history: list[ChatMessageIn] = Field(default_factory=list)


class ChatResponse(BaseModel):
    reply: str
    persona_key: str
    persona_name: str
