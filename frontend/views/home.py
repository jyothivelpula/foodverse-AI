"""Dashboard / home — hero, featured foods, categories."""

from __future__ import annotations

import streamlit as st

from components.food_card import render_food_card
from components.order_status import render_order_status
from utils.constants import DEMO_CATEGORIES, HERO_SUBTITLE, HERO_TITLE, HOME_PERSONAS
from utils.session import set_page, set_persona


def render() -> None:
    st.markdown(
        f"""
        <div class="fv-hero">
          <div class="fv-hero-badge">🍔 Fresh · Fast · Fun</div>
          <h1>{HERO_TITLE}</h1>
          <p>{HERO_SUBTITLE}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    cta = st.columns([2, 2, 2, 2])
    with cta[1]:
        if st.button("Explore Menu", type="primary", use_container_width=True, key="hero_explore"):
            set_page("menu")
            st.rerun()
    with cta[2]:
        if st.button("Open AI Lounge", use_container_width=True, key="hero_lounge"):
            st.session_state.lounge_view = "gallery"
            set_page("ai_lounge")
            st.rerun()

    st.markdown(
        '<div class="fv-section-title"><h3>⭐ Featured Foods</h3></div>',
        unsafe_allow_html=True,
    )
    featured = [item for item in st.session_state.menu_items if item.get("featured")]
    if not featured:
        featured = st.session_state.menu_items[:3]

    cols = st.columns(3)
    for col, item in zip(cols, featured):
        with col:
            render_food_card(item, compact=True)

    st.markdown(
        '<div class="fv-section-title"><h3>🍽 Categories</h3></div>',
        unsafe_allow_html=True,
    )
    cat_cols = st.columns(len(DEMO_CATEGORIES))
    for col, category in zip(cat_cols, DEMO_CATEGORIES):
        with col:
            if st.button(
                f"{category.get('emoji', '')} {category['name']}",
                key=f"home_cat_{category['id']}",
                use_container_width=True,
            ):
                st.session_state.selected_category_id = category["id"]
                st.session_state.menu_search = ""
                set_page("menu")
                st.rerun()

    st.markdown(
        '<div class="fv-section-title"><h3>🤖 AI Lounge</h3></div>',
        unsafe_allow_html=True,
    )
    st.caption("Your companions while the kitchen works.")
    persona_cols = st.columns(len(HOME_PERSONAS))
    for col, persona in zip(persona_cols, HOME_PERSONAS):
        with col:
            st.markdown(
                f"""
                <div class="fv-persona-mini">
                  <div class="emoji">{persona['emoji']}</div>
                  <div class="name">{persona['display_name']}</div>
                  <div class="tag">{persona['tagline']}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
            if st.button(
                "Chat",
                key=f"home_persona_{persona['key']}",
                use_container_width=True,
            ):
                set_persona(persona["key"])
                st.session_state.lounge_view = "chat"
                set_page("ai_lounge")
                st.rerun()

    st.markdown(
        '<div class="fv-section-title"><h3>📦 Order Status</h3></div>',
        unsafe_allow_html=True,
    )
    order_id = st.session_state.get("active_order_id")
    if order_id:
        render_order_status(int(st.session_state.get("order_stage_index", 0)), order_id=order_id)
        if st.button("Open full tracking", key="home_track_btn"):
            set_page("order_tracking")
            st.rerun()
    else:
        render_order_status(2, order_id=None)
        st.caption("Place an order to track live status here.")


if __name__ == "__main__":
    from utils.session import init_session

    init_session()
    render()
