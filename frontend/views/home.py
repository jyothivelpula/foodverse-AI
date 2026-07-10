"""Dashboard / home — clear visual hierarchy with 64px section rhythm."""

from __future__ import annotations

import streamlit as st

from components.food_card import render_food_card
from utils.constants import DEMO_CATEGORIES, HERO_TITLE, HOME_PERSONAS
from utils.session import set_page, set_persona


def render() -> None:
    # 1) BIG HERO
    st.markdown(
        f"""
        <div class="fv-hero">
          <div class="fv-hero-kicker">🍔 FoodVerse AI</div>
          <h1>{HERO_TITLE}</h1>
          <p class="fv-hero-lead">
            Order delicious meals.<br/>
            Chat with AI companions while you wait.
          </p>
          <div class="fv-hero-stats">
            <div class="fv-hero-stat"><span>⭐</span> 4.9 Rating</div>
            <div class="fv-hero-stat"><span>🚀</span> Fast Delivery</div>
            <div class="fv-hero-stat"><span>🤖</span> 10 AI Companions</div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    cta = st.columns([2, 2, 2, 3])
    with cta[0]:
        if st.button("Explore Menu", type="primary", use_container_width=True, key="hero_explore"):
            set_page("menu")
            st.rerun()
    with cta[1]:
        if st.button("AI Lounge", use_container_width=True, key="hero_lounge"):
            st.session_state.lounge_view = "gallery"
            set_page("ai_lounge")
            st.rerun()

    # 2) Featured Foods
    st.markdown('<div class="fv-section">', unsafe_allow_html=True)
    st.markdown(
        '<div class="fv-section-title"><h3>Featured Foods</h3></div>',
        unsafe_allow_html=True,
    )
    featured = [item for item in st.session_state.menu_items if item.get("featured")]
    if not featured:
        featured = st.session_state.menu_items[:3]

    st.markdown('<div class="fv-menu-grid">', unsafe_allow_html=True)
    cols = st.columns(3, gap="medium")
    for col, item in zip(cols, featured):
        with col:
            with st.container(border=True):
                render_food_card(item, compact=True)
    st.markdown("</div></div>", unsafe_allow_html=True)

    # 3) Categories
    st.markdown('<div class="fv-section">', unsafe_allow_html=True)
    st.markdown(
        '<div class="fv-section-title"><h3>Categories</h3></div>',
        unsafe_allow_html=True,
    )
    cat_cols = st.columns(len(DEMO_CATEGORIES), gap="medium")
    for col, category in zip(cat_cols, DEMO_CATEGORIES):
        with col:
            if st.button(
                f"{category.get('emoji', '')}  {category['name']}",
                key=f"home_cat_{category['id']}",
                use_container_width=True,
            ):
                st.session_state.selected_category_id = category["id"]
                st.session_state.menu_search = ""
                set_page("menu")
                st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)

    # 4) AI Lounge
    st.markdown('<div class="fv-section">', unsafe_allow_html=True)
    st.markdown(
        '<div class="fv-section-title"><h3>AI Lounge</h3></div>',
        unsafe_allow_html=True,
    )
    st.caption("Chat with a companion while your food is being prepared.")
    persona_cols = st.columns(len(HOME_PERSONAS), gap="medium")
    for col, persona in zip(persona_cols, HOME_PERSONAS):
        with col:
            st.markdown(
                f"""
                <div class="fv-persona-mini">
                  <div class="emoji">{persona['emoji']}</div>
                  <div class="name">{persona['display_name']}</div>
                  <div class="tag"><span class="fv-ai-badge">AI</span> {persona['tagline']}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
            st.markdown('<div class="fv-chat-cta">', unsafe_allow_html=True)
            if st.button(
                "🟣 Start Chat →",
                key=f"home_persona_{persona['key']}",
                use_container_width=True,
            ):
                set_persona(persona["key"])
                st.session_state.lounge_view = "chat"
                set_page("ai_lounge")
                st.rerun()
            st.markdown("</div>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)


if __name__ == "__main__":
    from utils.session import init_session

    init_session()
    render()
