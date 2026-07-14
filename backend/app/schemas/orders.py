from pydantic import BaseModel, Field


class OrderItemIn(BaseModel):
    id: int | str
    name: str
    price: float
    quantity: int = Field(ge=1)
    image: str | None = None


class CreateOrderRequest(BaseModel):
    customer_name: str = Field(min_length=1, max_length=120)
    customer_email: str = ""
    items: list[OrderItemIn]
    estimated_minutes: int = Field(default=30, ge=1, le=180)
    order_id: str | None = None


class StatusUpdateRequest(BaseModel):
    status: str
    message: str | None = None
