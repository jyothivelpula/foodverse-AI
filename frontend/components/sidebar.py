"""Fixed 240px sidebar — aligned icon + label columns."""

from __future__ import annotations

import streamlit as st

from utils.session import set_page

NAV_MAIN = [
    ("home", "🏠", "Dashboard"),
    ("menu", "🍕", "Menu"),
    ("ai_lounge", "🤖", "AI Lounge"),
    ("cart", "🛒", "Cart"),
    ("order_tracking", "📦", "Orders"),
]

NAV_ACCOUNT = [
    ("profile", "👤", "Profile"),
    ("settings", "⚙", "Settings"),
]


def _nav_item(key: str, emoji: str, label: str, current: str) -> None:
    is_active = current == key
    active_cls = " is-active" if is_active else ""

    # Fixed grid: icon column + label column (same X for every row)
    st.markdown(f'<div class="fv-nav-row{active_cls}">', unsafe_allow_html=True)
    ico_col, label_col = st.columns([0.9, 3.6], vertical_alignment="center")

    with ico_col:
        st.markdown(
            f'<div class="fv-nav-ico{active_cls}">{emoji}</div>',
            unsafe_allow_html=True,
        )

    with label_col:
        if st.button(
            label,
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
        f'<div class="fv-nav-section-label">{title}</div>',
        unsafe_allow_html=True,
    )
    for key, emoji, label in items:
        _nav_item(key, emoji, label, current)


def render_sidebar() -> None:
    current = st.session_state.get("page", "home")

    with st.sidebar:
        st.markdown(
            """
            <div class="fv-side-brand">
              <div class="fv-side-logo">🍽</div>
              <div class="fv-side-brand-text">
                <div class="fv-side-title">FoodVerse</div>
                <div class="fv-side-sub">AI Food Platform</div>
              </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.markdown('<div class="fv-side-divider"></div>', unsafe_allow_html=True)
        _section("MAIN", NAV_MAIN, current)

        st.markdown('<div class="fv-side-divider"></div>', unsafe_allow_html=True)
        _section("ACCOUNT", NAV_ACCOUNT, current)
