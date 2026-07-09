"""Streamlit session-state helpers for cart, profile, and chat."""

from __future__ import annotations

import streamlit as st

from utils.constants import DEMO_MENU_ITEMS, DEFAULT_PERSONAS


def init_session() -> None:
    defaults = {
        "page": "home",
        "cart": [],
        "customer": {
            "name": "",
            "phone": "",
            "email": "",
            "address": "",
        },
        "active_order_id": None,
        "order_stage_index": 0,
        "selected_persona": DEFAULT_PERSONAS[0]["key"],
        "chat_by_persona": {},
        "menu_items": DEMO_MENU_ITEMS.copy(),
        "reviews": [],
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value

    # Migrate older single-list chat history if present
    if "chat_messages" in st.session_state and st.session_state.chat_messages:
        persona = st.session_state.selected_persona
        st.session_state.chat_by_persona.setdefault(persona, list(st.session_state.chat_messages))
        st.session_state.chat_messages = []


def get_cart() -> list[dict]:
    return st.session_state.cart


def add_to_cart(item: dict, quantity: int = 1) -> None:
    cart = get_cart()
    for row in cart:
        if row["id"] == item["id"]:
            row["quantity"] += quantity
            return
    cart.append(
        {
            "id": item["id"],
            "name": item["name"],
            "price": float(item["price"]),
            "quantity": quantity,
        }
    )


def update_cart_quantity(item_id: int, quantity: int) -> None:
    cart = get_cart()
    for row in cart:
        if row["id"] == item_id:
            row["quantity"] = max(0, quantity)
            break
    st.session_state.cart = [row for row in cart if row["quantity"] > 0]


def remove_from_cart(item_id: int) -> None:
    st.session_state.cart = [row for row in get_cart() if row["id"] != item_id]


def clear_cart() -> None:
    st.session_state.cart = []


def set_page(page: str) -> None:
    st.session_state.page = page


def get_chat_messages(persona_key: str | None = None) -> list[dict]:
    key = persona_key or st.session_state.selected_persona
    chats = st.session_state.setdefault("chat_by_persona", {})
    return chats.setdefault(key, [])


def append_chat_message(role: str, content: str, persona_key: str | None = None) -> None:
    get_chat_messages(persona_key).append({"role": role, "content": content})


def clear_chat(persona_key: str | None = None) -> None:
    key = persona_key or st.session_state.selected_persona
    st.session_state.setdefault("chat_by_persona", {})[key] = []


def set_persona(persona_key: str) -> None:
    st.session_state.selected_persona = persona_key
    get_chat_messages(persona_key)
