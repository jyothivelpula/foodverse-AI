"""FoodVerse AI frontend entrypoint (Streamlit)."""

from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st

# Ensure `frontend/` is on sys.path when launched via `streamlit run app.py`
ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from components.footer import render_footer
from components.navbar import render_navbar
from config import APP_TITLE
from utils.helpers import load_css
from utils.session import init_session
from views import ai_lounge, cart, checkout, home, menu, order_tracking, profile, reviews


PAGE_RENDERERS = {
    "home": home.render,
    "menu": menu.render,
    "cart": cart.render,
    "checkout": checkout.render,
    "order_tracking": order_tracking.render,
    "ai_lounge": ai_lounge.render,
    "chat": ai_lounge.render,  # legacy alias → AI Lounge
    "reviews": reviews.render,
    "profile": profile.render,
}


def main() -> None:
    st.set_page_config(
        page_title=APP_TITLE,
        page_icon="🍽️",
        layout="wide",
        initial_sidebar_state="collapsed",
    )
    init_session()

    st.markdown(
        """
        <style>
          [data-testid="stAppViewContainer"] { color-scheme: light; }
          [data-testid="stSidebar"],
          [data-testid="stSidebarNav"],
          section[data-testid="stSidebar"] { display: none !important; }
          [data-testid="collapsedControl"] { display: none !important; }
        </style>
        """,
        unsafe_allow_html=True,
    )

    css = load_css()
    if css:
        st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)

    # Normalize old "chat" page to AI Lounge
    if st.session_state.get("page") == "chat":
        st.session_state.page = "ai_lounge"

    render_navbar()

    page = st.session_state.get("page", "home")
    renderer = PAGE_RENDERERS.get(page, home.render)
    renderer()

    render_footer()


if __name__ == "__main__":
    main()
