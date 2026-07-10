"""AI Lounge persona gallery grouped by category."""

from __future__ import annotations

import html

import streamlit as st

from utils.constants import DEFAULT_PERSONAS, PERSONA_CATEGORIES
from utils.session import set_persona


def _persona_map() -> dict[str, dict]:
    return {p["key"]: p for p in DEFAULT_PERSONAS}


def _short_tag(tagline: str) -> str:
    short = tagline.split("&")[0].split(",")[0].strip()
    return short[:28] + ("…" if len(short) > 28 else "")


def _render_persona_card(persona: dict) -> None:
    accent = persona.get("accent", "#e11d48")
    character = persona.get("character_name", persona["display_name"])
    vibe = persona.get("vibe") or _short_tag(persona.get("tagline", "Friendly chat"))

    st.markdown(
        f"""
        <div class="fv-persona-card" style="--persona-accent:{accent}">
          <div class="fv-persona-glow"></div>
          <div class="fv-persona-top">
            <div class="fv-persona-emoji">{persona['emoji']}</div>
            <div class="fv-persona-who">
              <div class="fv-persona-char">{html.escape(character)}</div>
              <div class="fv-persona-name">{html.escape(persona['display_name'])}</div>
            </div>
          </div>
          <div class="fv-persona-tag">
            <span class="fv-ai-badge">AI</span>
            {html.escape(vibe)}
          </div>
          <div class="fv-persona-online"><span class="fv-online-dot"></span> Online</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    spacer_l, btn, spacer_r = st.columns([0.8, 2.4, 0.8])
    with btn:
        st.markdown('<div class="fv-chat-cta">', unsafe_allow_html=True)
        if st.button(
            "🟣 Start Chat →",
            key=f"persona_card_{persona['key']}",
            use_container_width=True,
        ):
            set_persona(persona["key"])
            st.session_state.lounge_view = "chat"
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)

def render_persona_cards() -> None:
    st.markdown(
        """
        <div class="fv-lounge-hero-card">
          <div class="fv-lounge-hero-icon">🤖</div>
          <div class="fv-lounge-hero-copy">
            <h2>AI Lounge</h2>
            <p>Chat with your favorite AI companion while your food is being prepared.</p>
            <span class="fv-lounge-hero-hint">Choose a companion below.</span>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    selected = st.session_state.get("lounge_category", "all")

    st.markdown('<div class="fv-pill-row">', unsafe_allow_html=True)
    row1 = PERSONA_CATEGORIES[:4]
    row2 = PERSONA_CATEGORIES[4:]

    for row in (row1, row2):
        cols = st.columns(len(row))
        for col, category in zip(cols, row):
            with col:
                is_active = selected == category["key"]
                label = f"{category['emoji']}  {category['label']}"
                if st.button(
                    label,
                    key=f"lounge_cat_{category['key']}",
                    use_container_width=True,
                    type="primary" if is_active else "secondary",
                ):
                    st.session_state.lounge_category = (
                        "all" if is_active else category["key"]
                    )
                    st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)

    if selected != "all":
        if st.button("Show all categories", key="lounge_show_all"):
            st.session_state.lounge_category = "all"
            st.rerun()

    personas = _persona_map()
    categories = PERSONA_CATEGORIES
    if selected != "all":
        categories = [c for c in PERSONA_CATEGORIES if c["key"] == selected]

    for category in categories:
        members = [personas[k] for k in category["persona_keys"] if k in personas]
        if not members:
            continue

        optional = " · optional" if category.get("optional") else ""
        st.markdown(
            f"""
            <div class="fv-cat-block">
              <div class="fv-cat-head">
                <span class="fv-cat-emoji">{category['emoji']}</span>
                <span class="fv-cat-title">{html.escape(category['label'])} Companions</span>
                <span class="fv-cat-count">{len(members)}{optional}</span>
              </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        n = min(3, max(1, len(members)))
        cols = st.columns(n)
        for idx, persona in enumerate(members):
            with cols[idx % n]:
                _render_persona_card(persona)
