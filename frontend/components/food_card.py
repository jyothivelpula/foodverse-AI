"""Menu item card."""

from __future__ import annotations

import streamlit as st

from utils.helpers import format_currency
from utils.session import add_to_cart


def render_food_card(item: dict, compact: bool = False) -> None:
    emoji = item.get("emoji") or "🍽️"
    rating = item.get("rating")
    available = bool(item.get("is_available", True))
    favorites = st.session_state.setdefault("favorites", [])
    is_fav = item["id"] in favorites
    suffix = "c" if compact else "f"

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

        b1, b2 = st.columns(2)
        with b1:
            if st.button(
                "+ Cart" if available else "Unavailable",
                key=f"add_{item['id']}_{suffix}",
                disabled=not available,
                use_container_width=True,
                type="primary",
            ):
                add_to_cart(item, 1)
                st.toast(f"Added {item['name']} to cart")
        with b2:
            if st.button(
                "❤️" if is_fav else "🤍",
                key=f"fav_{item['id']}_{suffix}",
                use_container_width=True,
            ):
                if is_fav:
                    st.session_state.favorites = [fid for fid in favorites if fid != item["id"]]
                else:
                    st.session_state.favorites = [*favorites, item["id"]]
                st.rerun()
