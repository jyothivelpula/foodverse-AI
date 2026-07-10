"""Fixed 240px sidebar — MAIN / SHOPPING / ACCOUNT groups."""

from __future__ import annotations

import streamlit as st

from utils.constants import APP_NAME, APP_TAGLINE
from utils.session import set_page

NAV_MAIN = [
    ("home", "🏠", "Dashboard"),
    ("menu", "🍕", "Menu"),
    ("ai_lounge", "🤖", "AI Lounge"),
]

NAV_SHOPPING = [
    ("cart", "🛒", "Cart"),
    ("order_tracking", "📦", "Orders"),
]

NAV_ACCOUNT = [
    ("profile", "👤", "Profile"),
    ("settings", "⚙", "Settings"),
]


def _nav_item(key: str, emoji: str, label: str, current: str) -> None:
    is_active = current == key
    st.markdown(
        f'<div class="fv-nav-slot{" is-active" if is_active else ""}">',
        unsafe_allow_html=True,
    )
    if st.button(
        f"{emoji}   {label}",
        key=f"side_nav_{key}",
        use_container_width=True,
        type="primary" if is_active else "secondary",
    ):
        if key == "ai_lounge":
            st.session_state.lounge_view = "gallery"
            st.session_state.lounge_category = "all"
        set_page(key)
        st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)


def _section(title: str, items: list[tuple[str, str, str]], current: str) -> None:
    st.markdown(
        f'<div class="fv-nav-section"><div class="fv-nav-section-label">{title}</div></div>',
        unsafe_allow_html=True,
    )
    for key, emoji, label in items:
        _nav_item(key, emoji, label, current)


def render_sidebar() -> None:
    current = st.session_state.get("page", "home")
    customer = st.session_state.get("customer") or {}
    name = (customer.get("name") or "").strip() or "Guest"
    first = name.split()[0]

    with st.sidebar:
        st.markdown('<div class="fv-sidebar-shell">', unsafe_allow_html=True)

        st.markdown(
            f"""
            <div class="fv-side-brand">
              <div class="fv-side-logo">🍽</div>
              <div class="fv-side-brand-text">
                <div class="fv-side-title">{APP_NAME}</div>
                <div class="fv-side-sub">{APP_TAGLINE}</div>
              </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.markdown('<div class="fv-side-divider"></div>', unsafe_allow_html=True)
        _section("MAIN", NAV_MAIN, current)

        st.markdown('<div class="fv-side-divider"></div>', unsafe_allow_html=True)
        _section("SHOPPING", NAV_SHOPPING, current)

        st.markdown('<div class="fv-side-divider"></div>', unsafe_allow_html=True)
        _section("ACCOUNT", NAV_ACCOUNT, current)

        st.markdown(
            f"""
            <div class="fv-side-user">
              <div class="fv-side-user-avatar">👤</div>
              <div>
                <div class="fv-side-user-name">{first}</div>
                <div class="fv-side-user-status"><span class="fv-online-dot"></span> Online</div>
              </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.markdown("</div>", unsafe_allow_html=True)
