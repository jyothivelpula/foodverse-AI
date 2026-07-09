"""Order tracking page."""

from __future__ import annotations

import streamlit as st

from components.order_status import render_order_status
from utils.constants import ORDER_STAGES
from utils.session import set_page


def render() -> None:
    st.title("Order Tracking")

    order_id = st.session_state.get("active_order_id")
    if not order_id:
        st.info("No active order yet. Place an order from checkout to track it here.")
        if st.button("Go to Menu"):
            set_page("menu")
            st.rerun()
        return

    stage_index = int(st.session_state.get("order_stage_index", 0))
    render_order_status(stage_index, order_id=order_id)

    st.divider()
    c1, c2, c3 = st.columns(3)
    with c1:
        if st.button("Simulate next stage", use_container_width=True):
            st.session_state.order_stage_index = min(stage_index + 1, len(ORDER_STAGES) - 1)
            st.rerun()
    with c2:
        if st.button("Open AI Lounge", use_container_width=True):
            set_page("ai_lounge")
            st.rerun()
    with c3:
        if st.button("Chat", use_container_width=True):
            set_page("chat")
            st.rerun()


if __name__ == "__main__":
    from utils.session import init_session

    init_session()
    render()
