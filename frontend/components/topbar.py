"""Top navigation — large search, alerts, cart badge, avatar."""

from __future__ import annotations

import html
import time

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
    initial = html.escape(first[:1].upper())
    online = bool(st.session_state.get("backend_online", False))

    st.markdown('<div class="fv-topnav">', unsafe_allow_html=True)
    search, actions = st.columns([7.2, 2.8], vertical_alignment="center")

    with search:
        st.markdown('<div class="fv-search-wrap">', unsafe_allow_html=True)
        st.text_input(
            "Search",
            placeholder="Search biryani, pizza, desserts...",
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
        bell, cart_col, user = st.columns([0.9, 1.05, 1.35], vertical_alignment="center")

        with bell:
            if st.button("🔔", key="top_bell_btn", use_container_width=True, help="Orders"):
                set_page("order_tracking")
                st.rerun()

        with cart_col:
            badge = f'<span class="fv-cart-badge">{count}</span>' if count else ""
            st.markdown(f'<div class="fv-cart-wrap">{badge}</div>', unsafe_allow_html=True)
            if st.button("🛒", key="top_cart_btn", use_container_width=True, help="Cart"):
                set_page("cart")
                st.rerun()

        with user:
            st.markdown(
                f'<div class="fv-top-avatar" title="{html.escape(name)}">{initial}</div>',
                unsafe_allow_html=True,
            )
            if st.button(first, key="top_user_btn", use_container_width=True, help="Profile"):
                set_page("profile")
                st.rerun()

        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("</div>", unsafe_allow_html=True)

    status = "API Online" if online else "API Offline — click to recheck"
    if st.button(status, key="top_api_btn"):
        from api_client import api_client

        st.session_state.backend_online = api_client.is_online()
        st.session_state.backend_checked_at = time.monotonic()
        st.rerun()
