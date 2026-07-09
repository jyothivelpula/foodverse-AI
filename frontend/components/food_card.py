"""Menu item card."""

from __future__ import annotations

import streamlit as st

from utils.helpers import format_currency
from utils.session import add_to_cart


def render_food_card(item: dict, compact: bool = False) -> None:
    emoji = item.get("emoji") or "🍽️"
    rating = item.get("rating")
    available = bool(item.get("is_available", True))

    with st.container(border=True):
        st.markdown(
            f"""
            <div class="fv-card-emoji">{emoji}</div>
            <h4>{item["name"]}</h4>
            <div class="fv-meta">{"⭐ " + str(rating) if rating else (item.get("description") or "")}</div>
            <div class="fv-price">{format_currency(float(item["price"]))}</div>
            """,
            unsafe_allow_html=True,
        )

        if not compact and item.get("description") and rating:
            st.caption(item["description"])

        if st.button(
            "+ Cart" if available else "Unavailable",
            key=f"add_{item['id']}_{'c' if compact else 'f'}",
            disabled=not available,
            use_container_width=True,
            type="primary",
        ):
            add_to_cart(item, 1)
            st.toast(f"Added {item['name']} to cart")
