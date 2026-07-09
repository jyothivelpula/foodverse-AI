"""Top navigation bar."""

from __future__ import annotations

import streamlit as st

from utils.helpers import cart_item_count
from utils.session import get_cart, set_page


def render_navbar() -> None:
    count = cart_item_count(get_cart())

    brand, search, actions = st.columns([2.2, 4.4, 2.4], vertical_alignment="center")

    with brand:
        if st.button("🍽 FoodVerse AI", key="nav_brand_btn", use_container_width=True):
            set_page("home")
            st.rerun()

    with search:
        with st.form("nav_search_form", clear_on_submit=False, border=False):
            q_col, b_col = st.columns([5, 1.2])
            with q_col:
                query = st.text_input(
                    "Search",
                    placeholder="🔍 Search pizza, burgers, desserts...",
                    label_visibility="collapsed",
                    key="nav_search",
                )
            with b_col:
                submitted = st.form_submit_button("Go", use_container_width=True)
            if submitted and query.strip():
                st.session_state.menu_search = query.strip()
                set_page("menu")
                st.rerun()

    with actions:
        c1, c2 = st.columns(2)
        with c1:
            if st.button(f"🛒 {count}", key="nav_cart_btn", use_container_width=True):
                set_page("cart")
                st.rerun()
        with c2:
            if st.button("👤 Profile", key="nav_profile_btn", use_container_width=True):
                set_page("profile")
                st.rerun()

    # Single nav row — no duplicate Home/Menu/Chat entries
    links = [
        ("home", "Home"),
        ("menu", "Menu"),
        ("ai_lounge", "AI Lounge"),
        ("order_tracking", "Track"),
        ("reviews", "Reviews"),
    ]
    cols = st.columns(len(links))
    current = st.session_state.get("page", "home")
    for col, (key, label) in zip(cols, links):
        with col:
            if st.button(
                label,
                key=f"subnav_{key}",
                use_container_width=True,
                type="primary" if current == key else "secondary",
            ):
                set_page(key)
                st.rerun()
