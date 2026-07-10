"""AI Lounge — companion gallery + chat."""

from __future__ import annotations

import streamlit as st

from components.chatbot import render_chatbot
from components.order_status import render_order_status
from components.persona_selector import render_persona_cards
from utils.session import set_page


def render() -> None:
    view = st.session_state.get("lounge_view", "gallery")

    order_id = st.session_state.get("active_order_id")
    if order_id and view == "gallery":
        with st.expander("📦 Your order status", expanded=False):
            render_order_status(
                int(st.session_state.get("order_stage_index", 0)),
                order_id=order_id,
            )

    if view == "chat":
        render_chatbot(show_back=True)
        return

    render_persona_cards()

    if not order_id:
        st.markdown(
            """
            <div class="fv-empty-card">
              <div class="fv-empty-emoji">🍕</div>
              <div class="fv-empty-title">No active order</div>
              <div class="fv-empty-text">
                Order your favorite meal and chat with AI while you wait.
              </div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        c1, c2, c3 = st.columns([2, 2, 2])
        with c2:
            if st.button("Browse Menu", key="lounge_to_menu", type="primary", use_container_width=True):
                set_page("menu")
                st.rerun()


if __name__ == "__main__":
    from utils.session import init_session

    init_session()
    render()
