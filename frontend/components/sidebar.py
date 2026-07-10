"""Left sidebar navigation — slim icon-forward rail."""

from __future__ import annotations

import streamlit as st

from utils.constants import APP_NAME, NAV_ITEMS
from utils.session import set_page


def render_sidebar() -> None:
    current = st.session_state.get("page", "home")

    with st.sidebar:
        st.markdown(
            f"""
            <div class="fv-side-brand">
              <div class="fv-side-logo">🍽</div>
              <div class="fv-side-title">{APP_NAME}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        st.markdown('<div class="fv-side-divider"></div>', unsafe_allow_html=True)

        for key, emoji, label in NAV_ITEMS:
            is_active = current == key
            ico, txt = st.columns([1, 3.2], vertical_alignment="center")
            with ico:
                st.markdown(
                    f'<div class="fv-side-ico{" active" if is_active else ""}">{emoji}</div>',
                    unsafe_allow_html=True,
                )
            with txt:
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
