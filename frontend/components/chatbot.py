"""AI Lounge chatbot using Streamlit native chat messages."""

from __future__ import annotations

import time

import streamlit as st

from api_client import api_client
from utils.constants import DEFAULT_PERSONAS
from utils.session import append_chat_message, clear_chat, get_chat_messages, set_page


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


def _greeting(character: str) -> str:
    return (
        f"Hello! 😊 I'm {character}.\n\n"
        "It's lovely to meet you.\n\n"
        "How's your day going?"
    )


def render_chatbot(*, show_back: bool = True) -> None:
    persona_key = st.session_state.get("selected_persona", DEFAULT_PERSONAS[0]["key"])
    persona = _persona_by_key(persona_key)
    messages = get_chat_messages(persona_key)
    character = persona.get("character_name", persona["display_name"])
    full_label = f"{character} {persona['display_name']}"

    online = bool(st.session_state.get("backend_online", False))

    left, mid, right = st.columns([1.1, 5.2, 1.7], vertical_alignment="center")
    with left:
        if show_back and st.button("←", key="chat_back_btn", use_container_width=True):
            st.session_state.lounge_view = "gallery"
            set_page("ai_lounge")
            st.rerun()
    with mid:
        st.markdown(f"### {persona['emoji']} {full_label}")
    with right:
        st.caption("🟢 API Online" if online else "🔴 API Offline")

    st.caption(persona["tagline"])
    if not online:
        st.warning(
            "Cannot reach the backend at http://127.0.0.1:8000. "
            "From the `backend` folder run: `python -m uvicorn app.main:app --reload`"
        )

    # Native Streamlit chat messages
    if not messages:
        with st.chat_message("assistant", avatar=persona["emoji"]):
            st.markdown(_greeting(character))
    else:
        for message in messages:
            role = message.get("role", "assistant")
            content = str(message.get("content", ""))
            if role == "user":
                with st.chat_message("user", avatar="🙂"):
                    st.markdown(content)
            else:
                with st.chat_message("assistant", avatar=persona["emoji"]):
                    st.markdown(content)

    prompt = st.chat_input(f"Message {character}...")
    if prompt and prompt.strip():
        history = list(messages)
        append_chat_message("user", prompt.strip(), persona_key)

        with st.chat_message("user", avatar="🙂"):
            st.markdown(prompt.strip())

        with st.chat_message("assistant", avatar=persona["emoji"]):
            with st.spinner(f"{character} is typing..."):
                try:
                    reply = _ask_ai(persona, prompt.strip(), history)
                    st.session_state.backend_online = True
                    st.session_state.backend_checked_at = time.monotonic()
                except Exception as exc:  # noqa: BLE001
                    st.session_state.backend_online = False
                    st.session_state.backend_checked_at = time.monotonic()
                    reply = (
                        "Couldn't reach the AI chat service.\n\n"
                        "1. Open a terminal in the **backend** folder\n"
                        "2. Run: `python -m uvicorn app.main:app --reload`\n"
                        "3. Confirm http://127.0.0.1:8000/health returns ok\n"
                        "4. Ensure `GROQ_API_KEY` is set in `backend/.env`\n\n"
                        f"Details: {exc}"
                    )
            st.markdown(reply)

        append_chat_message("assistant", reply, persona_key)
        st.rerun()

    if st.button("Clear chat", key="clear_chat_btn"):
        clear_chat(persona_key)
        st.rerun()
