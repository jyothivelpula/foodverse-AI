"""AI Lounge page — companions while waiting for food."""

from __future__ import annotations

import streamlit as st

from components.chatbot import render_chatbot
from components.order_status import render_order_status
from components.persona_selector import render_persona_selector
from utils.session import set_page


def render() -> None:
    st.title("AI Waiting Lounge")
    st.write(
        "Your order is confirmed. Estimated preparation time: **20 minutes**. "
        "Chat with an AI companion while you wait."
    )

    order_id = st.session_state.get("active_order_id")
    if order_id:
        with st.expander("Order status", expanded=True):
            render_order_status(
                int(st.session_state.get("order_stage_index", 0)),
                order_id=order_id,
            )
    else:
        st.warning("No active order. You can still explore companions.")
        if st.button("Place an order"):
            set_page("menu")
            st.rerun()

    st.divider()
    render_persona_selector()
    st.divider()
    render_chatbot()


if __name__ == "__main__":
    from utils.session import init_session

    init_session()
    render()
