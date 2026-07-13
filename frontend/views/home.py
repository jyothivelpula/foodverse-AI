"""Dashboard — Foodie Palace inspired home (frontend UI only)."""

from __future__ import annotations

import html

import streamlit as st

from components.food_card import render_food_card
from utils.session import set_page, set_persona

HERO_BG = (
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
    "?auto=format&fit=crop&w=1600&q=80"
)

HOME_COMPANIONS = [
    {
        "key": "master_chef",
        "emoji": "👨‍🍳",
        "name": "Chef",
        "role": "Cooking Expert",
        "desc": "Pairings, techniques, and kitchen secrets while you wait.",
    },
    {
        "key": "teacher",
        "emoji": "📖",
        "name": "Story Teller",
        "role": "Food Historian",
        "desc": "Origins and stories behind every dish on the table.",
    },
    {
        "key": "actress",
        "emoji": "🎭",
        "name": "Comedian",
        "role": "Fun Conversations",
        "desc": "Light banter and laughs until your order arrives.",
    },
]


def _featured_items() -> list[dict]:
    items = list(st.session_state.get("menu_items") or [])
    featured = [i for i in items if i.get("featured")]
    return (featured or items)[:3]


def render() -> None:
    st.markdown('<div class="fv-page-main fv-fade">', unsafe_allow_html=True)

    # ── Dark full-width hero ──
    st.markdown(
        f"""
        <div class="fv-hero-dark">
          <img class="fv-hero-dark-bg" src="{html.escape(HERO_BG)}" alt="Restaurant ambience" />
          <div class="fv-hero-dark-shade"></div>
          <div class="fv-hero-dark-inner">
            <div>
              <div class="fv-hero-eyebrow">Smart Restaurant · AI Companion</div>
              <h1 class="fv-hero-title">Order dinner.<br/>Wait with a <em>friend.</em></h1>
              <p class="fv-hero-lead">
                Every order unlocks the AI Lounge — chat with a Chef, a Mentor,
                or a Story Teller while your meal is being prepared.
              </p>
            </div>
            <div class="fv-live-card">
              <div class="fv-live-top">
                <div class="fv-live-kicker">Live · Order #421</div>
                <div class="fv-live-eta">18 min</div>
              </div>
              <div class="fv-live-title">Chef is cooking your ramen.</div>
              <div class="fv-live-steps">
                <div class="fv-live-step is-done"><span class="fv-live-dot"></span>Confirmed</div>
                <div class="fv-live-step is-done"><span class="fv-live-dot"></span>Preparing</div>
                <div class="fv-live-step is-active"><span class="fv-live-dot"></span>Cooking</div>
                <div class="fv-live-step"><span class="fv-live-dot"></span>Out for delivery</div>
              </div>
              <div class="fv-live-chat">
                <div class="fv-live-avatar">👨‍🍳</div>
                <p><strong>Chef is chatting:</strong> “Want the secret to a 63° egg?”</p>
              </div>
            </div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown('<div class="fv-hero-actions">', unsafe_allow_html=True)
    c1, c2, _ = st.columns([1.2, 1.35, 2.2])
    with c1:
        st.markdown('<div class="fv-cta-pri">', unsafe_allow_html=True)
        if st.button("Browse Menu", type="primary", use_container_width=True, key="home_order"):
            set_page("menu")
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)
    with c2:
        st.markdown('<div class="fv-cta-sec">', unsafe_allow_html=True)
        if st.button("Meet AI Lounge", use_container_width=True, key="home_ai"):
            st.session_state.lounge_view = "gallery"
            set_page("ai_lounge")
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

    # ── Stats ──
    st.markdown(
        """
        <div class="fv-stat-strip">
          <div class="fv-stat-pill"><strong>⭐ 4.9</strong><span>Rating</span></div>
          <div class="fv-stat-pill"><strong>🍽 1200+</strong><span>Orders Today</span></div>
          <div class="fv-stat-pill"><strong>🤖 10</strong><span>AI Companions</span></div>
          <div class="fv-stat-pill"><strong>⏱ 20 min</strong><span>Delivery</span></div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # ── Featured dishes ──
    st.markdown(
        """
        <div class="fv-section">
          <div class="fv-section-head">
            <h3>Featured Today</h3>
            <p>Chef picks ready to order.</p>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    featured = _featured_items()
    cols = st.columns(3, gap="large")
    for col, item in zip(cols, featured):
        with col:
            with st.container(border=True):
                render_food_card(item, compact=True, show_favorite=False)

    # ── AI Lounge preview ──
    st.markdown(
        """
        <div class="fv-section">
          <div class="fv-section-head">
            <h3>Meet Your AI Companions</h3>
            <p>Company while your order cooks.</p>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    prow = st.columns(3, gap="large")
    for col, persona in zip(prow, HOME_COMPANIONS):
        with col:
            st.markdown(
                f"""
                <div class="fv-companion">
                  <div class="fv-companion-avatar">{html.escape(persona["emoji"])}<span class="fv-online-pip"></span></div>
                  <div class="fv-companion-name">{html.escape(persona["name"])}</div>
                  <div class="fv-companion-role">{html.escape(persona["role"])}</div>
                  <div class="fv-companion-desc">{html.escape(persona["desc"])}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
            if st.button("Chat", key=f"home_persona_{persona['key']}", use_container_width=True):
                set_persona(persona["key"])
                st.session_state.lounge_view = "chat"
                set_page("ai_lounge")
                st.rerun()

    st.markdown("</div>", unsafe_allow_html=True)
