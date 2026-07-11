"""Dashboard — clean modern home focused on Order + AI paths."""

from __future__ import annotations

import html

import streamlit as st

from components.food_card import render_food_card
from utils.constants import DEMO_CATEGORIES, HOME_PERSONAS
from utils.session import set_page, set_persona


def render() -> None:
    # ── Hero: wide primary banner ──
    st.markdown(
        """
        <div class="fv-home-hero-wrap">
          <div class="fv-home-hero">
            <div class="fv-home-hero-bg" aria-hidden="true"></div>
            <div class="fv-home-hero-veil" aria-hidden="true"></div>
            <div class="fv-home-hero-inner">
              <div class="fv-home-brand">FoodVerse AI</div>
              <h1 class="fv-home-headline">
                Delicious Food Meets<br/>Intelligent AI
              </h1>
              <p class="fv-home-lead">
                Craving something delicious? Order in a few taps, then chat with
                an AI companion while your meal is on the way.
              </p>
              <div class="fv-home-stats">
                <span class="fv-home-stat">⭐ 4.9</span>
                <span class="fv-home-stat">⚡ 15 min</span>
                <span class="fv-home-stat">🤖 10 AI Companions</span>
              </div>
            </div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown('<div class="fv-home-hero-cta">', unsafe_allow_html=True)
    c1, c2, _ = st.columns([1, 1, 6], gap="small")
    with c1:
        st.markdown('<div class="fv-home-cta-btn fv-home-cta-primary">', unsafe_allow_html=True)
        if st.button("🍕 Explore Menu →", key="home_order"):
            set_page("menu")
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)
    with c2:
        st.markdown('<div class="fv-home-cta-btn fv-home-cta-secondary">', unsafe_allow_html=True)
        if st.button("🤖 AI Lounge →", key="home_ai"):
            st.session_state.lounge_view = "gallery"
            set_page("ai_lounge")
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

    # ── Featured ──
    st.markdown(
        """
        <div class="fv-home-section">
          <div class="fv-home-section-row">
            <div>
              <h3>Featured today</h3>
              <p>Popular picks ready to order.</p>
            </div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    featured = [item for item in st.session_state.menu_items if item.get("featured")]
    if not featured:
        featured = st.session_state.menu_items[:3]

    cols = st.columns(3, gap="large")
    for col, item in zip(cols, featured):
        with col:
            with st.container(border=True):
                render_food_card(item, compact=True)

    st.markdown('<div class="fv-home-more">', unsafe_allow_html=True)
    if st.button("View full menu", key="home_view_menu"):
        set_page("menu")
        st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)

    # ── Categories — button is the tile ──
    st.markdown(
        """
        <div class="fv-home-section">
          <div class="fv-home-section-row">
            <div>
              <h3>Categories</h3>
              <p>Jump to what you’re craving.</p>
            </div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    cat_cols = st.columns(len(DEMO_CATEGORIES), gap="small")
    for col, category in zip(cat_cols, DEMO_CATEGORIES):
        with col:
            st.markdown('<div class="fv-home-cat">', unsafe_allow_html=True)
            label = f"{category.get('emoji', '')}  {category['name']}"
            if st.button(label, key=f"home_cat_{category['id']}", use_container_width=True):
                st.session_state.selected_category_id = category["id"]
                st.session_state.menu_search = ""
                set_page("menu")
                st.rerun()
            st.markdown("</div>", unsafe_allow_html=True)

    # ── AI companions — compact, one CTA ──
    faces = "".join(
        f'<span class="fv-home-face" title="{html.escape(p["display_name"])}">{html.escape(p["emoji"])}</span>'
        for p in HOME_PERSONAS[:5]
    )
    st.markdown(
        f"""
        <div class="fv-home-section">
          <div class="fv-home-ai-banner">
            <div class="fv-home-ai-copy">
              <div class="fv-home-ai-label">AI Lounge</div>
              <h3>Company while you wait</h3>
              <p>Actress, Chef, CEO, and more — pick a vibe and start chatting.</p>
              <div class="fv-home-faces">{faces}</div>
            </div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.markdown('<div class="fv-home-ai-cta">', unsafe_allow_html=True)
    ai_cols = st.columns([1.2, 1.2, 1.2, 1.2, 2])
    for col, persona in zip(ai_cols, HOME_PERSONAS[:4]):
        with col:
            if st.button(
                f"{persona['emoji']} {persona['display_name']}",
                key=f"home_persona_{persona['key']}",
                use_container_width=True,
            ):
                set_persona(persona["key"])
                st.session_state.lounge_view = "chat"
                set_page("ai_lounge")
                st.rerun()
    with ai_cols[4]:
        st.markdown('<div class="fv-home-ai-all">', unsafe_allow_html=True)
        if st.button("All companions →", use_container_width=True, key="home_all_ai"):
            st.session_state.lounge_view = "gallery"
            set_page("ai_lounge")
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)


if __name__ == "__main__":
    from utils.session import init_session

    init_session()
    render()
