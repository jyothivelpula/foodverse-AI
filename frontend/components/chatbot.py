"""AI chatbot UI component powered by the backend Groq chat API."""

from __future__ import annotations

import streamlit as st

from api_client import api_client
from utils.constants import DEFAULT_PERSONAS
from utils.session import append_chat_message, clear_chat, get_chat_messages


def _persona_by_key(key: str) -> dict:
    for persona in DEFAULT_PERSONAS:
        if persona["key"] == key:
            return persona
    return DEFAULT_PERSONAS[0]


def _ask_ai(persona: dict, user_text: str, history: list[dict]) -> str:
    payload = {
        "persona_key": persona["key"],
        "message": user_text,
        "history": history,
    }
    data = api_client.send_chat_message(payload)
    return data["reply"]


def render_chatbot() -> None:
    persona_key = st.session_state.get("selected_persona", DEFAULT_PERSONAS[0]["key"])
    persona = _persona_by_key(persona_key)
    messages = get_chat_messages(persona_key)

    st.markdown(f"#### Chat with {persona['emoji']} {persona['display_name']}")
    st.caption(persona["tagline"])

    for message in messages:
        with st.chat_message(message["role"]):
            st.write(message["content"])

    prompt = st.chat_input(f"Ask {persona['display_name']} anything...")
    if prompt:
        history = list(messages)
        append_chat_message("user", prompt, persona_key)

        with st.chat_message("user"):
            st.write(prompt)

        with st.chat_message("assistant"):
            with st.spinner(f"{persona['display_name']} is thinking..."):
                try:
                    reply = _ask_ai(persona, prompt, history)
                except Exception as exc:  # noqa: BLE001
                    reply = (
                        f"Sorry — I couldn't reach the AI service right now.\n\n"
                        f"Make sure the backend is running (`uvicorn app.main:app --reload`) "
                        f"and `GROQ_API_KEY` is set in `backend/.env`.\n\n"
                        f"Details: {exc}"
                    )
                st.write(reply)

        append_chat_message("assistant", reply, persona_key)
        st.rerun()

    if st.button("Clear chat", key="clear_chat_btn"):
        clear_chat(persona_key)
        st.rerun()
