"""Top navigation bar — 56px height."""

from __future__ import annotations

import streamlit as st

from utils.helpers import cart_item_count
from utils.session import get_cart, set_page


def _apply_search() -> None:
    query = (st.session_state.get("top_search") or "").strip()
    if not query:
        return
    st.session_state.menu_search = query
    if st.session_state.get("page") != "menu":
        set_page("menu")


def render_topbar() -> None:
    count = cart_item_count(get_cart())
    customer = st.session_state.get("customer") or {}
    name = (customer.get("name") or "").strip() or "Guest"
    first = name.split()[0]

    st.markdown('<div class="fv-topnav">', unsafe_allow_html=True)

    search, actions = st.columns([6.8, 3.2], vertical_alignment="center")

    with search:
        st.markdown('<div class="fv-search-wrap">', unsafe_allow_html=True)
        st.text_input(
            "Search",
            placeholder="🔍  Search pizza, burgers, desserts...",
            label_visibility="collapsed",
            key="top_search",
            on_change=_apply_search,
        )
        st.markdown("</div>", unsafe_allow_html=True)
        live = (st.session_state.get("top_search") or "").strip()
        if live and st.session_state.get("page") == "menu":
            st.session_state.menu_search = live

    with actions:
        st.markdown('<div class="fv-top-actions">', unsafe_allow_html=True)
        bell, cart_col, user = st.columns([1, 1.15, 1.55], vertical_alignment="center")
        with bell:
            if st.button("🔔", key="top_bell_btn", use_container_width=True, help="Orders"):
                set_page("order_tracking")
                st.rerun()
        with cart_col:
            if st.button(
                f"🛒 {count}",
                key="top_cart_btn",
                use_container_width=True,
                help="Cart",
            ):
                set_page("cart")
                st.rerun()
        with user:
            if st.button(
                f"👤 {first} ▼",
                key="top_user_btn",
                use_container_width=True,
                help="Profile",
            ):
                set_page("profile")
                st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("</div>", unsafe_allow_html=True)
