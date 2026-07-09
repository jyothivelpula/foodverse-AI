"""Dedicated chat page."""

from __future__ import annotations

import streamlit as st

from components.chatbot import render_chatbot
from components.persona_selector import render_persona_selector


def render() -> None:
    st.title("Chat")
    st.caption("Switch companions anytime and keep the conversation going.")
    render_persona_selector()
    st.divider()
    render_chatbot()


if __name__ == "__main__":
    from utils.session import init_session

    init_session()
    render()
