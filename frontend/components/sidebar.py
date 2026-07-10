"""Premium sidebar — no emoji nav icons, orange active dot."""

from __future__ import annotations

import streamlit as st

from utils.session import set_page

NAV_MAIN = [
    ("home", "Dashboard"),
    ("menu", "Menu"),
    ("ai_lounge", "AI Lounge"),
    ("cart", "Cart"),
    ("order_tracking", "Orders"),
]

NAV_ACCOUNT = [
    ("profile", "Profile"),
    ("settings", "Settings"),
]


def _nav_item(key: str, label: str, current: str) -> None:
    is_active = current == key
    active_cls = " is-active" if is_active else ""

    st.markdown(f'<div class="fv-nav-row{active_cls}">', unsafe_allow_html=True)
    dot_col, label_col = st.columns([0.7, 4.0], vertical_alignment="center")

    with dot_col:
        st.markdown(
            f'<div class="fv-nav-dot{active_cls}" aria-hidden="true"></div>',
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


def _section(title: str, items: list[tuple[str, str]], current: str) -> None:
    st.markdown(
        f'<div class="fv-nav-section-label">{title}</div>',
        unsafe_allow_html=True,
    )
    for key, label in items:
        _nav_item(key, label, current)


def render_sidebar() -> None:
    current = st.session_state.get("page", "home")
    customer = st.session_state.get("customer") or {}
    name = (customer.get("name") or "").strip() or "Guest"
    first = name.split()[0]

    with st.sidebar:
        st.markdown(
            """
            <div class="fv-side-brand">
              <div class="fv-side-logo">🍽</div>
              <div class="fv-side-brand-text">
                <div class="fv-side-title">FoodVerse AI</div>
                <div class="fv-side-sub">Order • Chat • Enjoy</div>
              </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.markdown('<div class="fv-side-divider"></div>', unsafe_allow_html=True)
        _section("MAIN", NAV_MAIN, current)

        st.markdown('<div class="fv-side-divider"></div>', unsafe_allow_html=True)
        _section("ACCOUNT", NAV_ACCOUNT, current)

        st.markdown('<div class="fv-side-divider"></div>', unsafe_allow_html=True)
        st.markdown(
            f"""
            <div class="fv-side-user">
              <div class="fv-side-user-avatar">👤</div>
              <div>
                <div class="fv-side-user-name">{first}</div>
                <div class="fv-side-user-status">
                  <span class="fv-online-dot"></span> Online
                </div>
              </div>
            </div>
            """,
            unsafe_allow_html=True,
        )
