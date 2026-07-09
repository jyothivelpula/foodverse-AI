"""Small helper utilities for the frontend."""

from __future__ import annotations

from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent.parent
ASSETS_DIR = ROOT_DIR / "assets"
STYLES_DIR = ROOT_DIR / "styles"


def format_currency(amount: float, currency: str = "₹") -> str:
    return f"{currency}{amount:,.2f}"


def load_css() -> str:
    css_path = STYLES_DIR / "style.css"
    if not css_path.exists():
        return ""
    return css_path.read_text(encoding="utf-8")


def logo_path() -> Path:
    return ASSETS_DIR / "logo.png"


def cart_subtotal(cart_items: list[dict]) -> float:
    return sum(float(item["price"]) * int(item["quantity"]) for item in cart_items)


def cart_item_count(cart_items: list[dict]) -> int:
    return sum(int(item["quantity"]) for item in cart_items)


def find_menu_item(items: list[dict], item_id: int) -> dict | None:
    for item in items:
        if int(item["id"]) == int(item_id):
            return item
    return None
