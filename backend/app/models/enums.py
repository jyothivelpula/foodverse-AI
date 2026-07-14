import enum


class OrderStage(str, enum.Enum):
    PLACED = "placed"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    COOKING = "cooking"
    PACKING = "packing"
    READY_FOR_PICKUP = "ready_for_pickup"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class OrderType(str, enum.Enum):
    DELIVERY = "delivery"
    PICKUP = "pickup"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class ChatRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"


class Language(str, enum.Enum):
    ENGLISH = "en"
    TELUGU = "te"
    HINDI = "hi"


class UserRole(str, enum.Enum):
    CUSTOMER = "customer"
    CHEF = "chef"