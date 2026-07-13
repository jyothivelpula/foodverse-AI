"""Premium sidebar — dark rail, icons, active accent, cart badge."""

from __future__ import annotations

import html

import streamlit as st

from utils.helpers import cart_item_count
from utils.session import get_cart, set_page

NAV_MAIN = [
    ("home", "🏠", "Dashboard"),
    ("menu", "🍕", "Menu"),
    ("ai_lounge", "✦", "AI Lounge"),
    ("cart", "🛒", "Cart"),
    ("order_tracking", "📦", "Orders"),
]

NAV_ACCOUNT = [
    ("profile", "👤", "Profile"),
    ("settings", "⚙", "Settings"),
]


def _nav_item(key: str, icon: str, label: str, current: str, badge: str = "") -> None:
    is_active = current == key
    active_cls = " is-active" if is_active else ""

    st.markdown(f'<div class="fv-nav-row{active_cls}">', unsafe_allow_html=True)
    icon_col, label_col = st.columns([0.85, 4.0], vertical_alignment="center")

    with icon_col:
        st.markdown(
            f'<div class="fv-nav-icon{active_cls}" aria-hidden="true">{icon}</div>',
            unsafe_allow_html=True,
        )

    with label_col:
        btn_label = f"{label}  {badge}" if badge else label
        if st.button(
            btn_label,
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


def _section(title: str, items: list[tuple[str, str, str]], current: str, cart_n: int = 0) -> None:
    st.markdown(
        f'<div class="fv-nav-section-label">{title}</div>',
        unsafe_allow_html=True,
    )
    for key, icon, label in items:
        badge = str(cart_n) if key == "cart" and cart_n > 0 else ""
        _nav_item(key, icon, label, current, badge=badge)


def render_sidebar() -> None:
    current = st.session_state.get("page", "home")
    customer = st.session_state.get("customer") or {}
    name = (customer.get("name") or "").strip() or "Guest"
    first = html.escape(name.split()[0])
    cart_n = cart_item_count(get_cart())

    with st.sidebar:
        st.markdown(
            """
            <div class="fv-side-brand">
              <div class="fv-side-logo">🍽</div>
              <div class="fv-side-brand-text">
                <div class="fv-side-title">FoodVerse</div>
                <div class="fv-side-sub">AI Kitchen</div>
              </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.markdown('<div class="fv-side-divider"></div>', unsafe_allow_html=True)
        _section("MAIN", NAV_MAIN, current, cart_n=cart_n)

        st.markdown('<div class="fv-side-divider"></div>', unsafe_allow_html=True)
        _section("ACCOUNT", NAV_ACCOUNT, current)

        st.markdown('<div class="fv-side-spacer"></div>', unsafe_allow_html=True)
        api_online = bool(st.session_state.get("backend_online", False))
        status_label = "API Online" if api_online else "API Offline"
        status_cls = "fv-online-dot" if api_online else "fv-offline-dot"
        st.markdown(
            f"""
            <div class="fv-side-user">
              <div class="fv-side-user-avatar">{first[:1].upper()}</div>
              <div class="fv-side-user-meta">
                <div class="fv-side-user-name">{first}</div>
                <div class="fv-side-user-status">
                  <span class="{status_cls}"></span> {status_label}
                </div>
              </div>
            </div>
            """,
            unsafe_allow_html=True,
        )
