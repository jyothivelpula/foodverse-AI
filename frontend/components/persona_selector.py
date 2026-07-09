"""AI persona selector."""

from __future__ import annotations

import streamlit as st

from utils.constants import DEFAULT_PERSONAS
from utils.session import set_persona


def render_persona_selector() -> str:
    st.markdown("### Choose an AI Companion")

    cols = st.columns(5)
    selected = st.session_state.get("selected_persona", DEFAULT_PERSONAS[0]["key"])

    for idx, persona in enumerate(DEFAULT_PERSONAS):
        with cols[idx % 5]:
            is_selected = persona["key"] == selected
            label = f"{persona['emoji']} {persona['display_name']}"
            if st.button(
                label,
                key=f"persona_{persona['key']}",
                use_container_width=True,
                type="primary" if is_selected else "secondary",
                help=persona["tagline"],
            ):
                set_persona(persona["key"])
                selected = persona["key"]
                st.rerun()

    return selected
