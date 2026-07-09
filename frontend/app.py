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
from pages import (
    ai_lounge,
    cart,
    chat,
    checkout,
    home,
    menu,
    order_tracking,
    profile,
    reviews,
)
from utils.helpers import load_css
from utils.session import init_session


PAGE_RENDERERS = {
    "home": home.render,
    "menu": menu.render,
    "cart": cart.render,
    "checkout": checkout.render,
    "order_tracking": order_tracking.render,
    "ai_lounge": ai_lounge.render,
    "chat": chat.render,
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

    # Force Streamlit light theme for all pages
    st.markdown(
        """
        <style>
          [data-testid="stAppViewContainer"] { color-scheme: light; }
        </style>
        """,
        unsafe_allow_html=True,
    )

    css = load_css()
    if css:
        st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)

    render_navbar()

    page = st.session_state.get("page", "home")
    renderer = PAGE_RENDERERS.get(page, home.render)
    renderer()

    render_footer()


if __name__ == "__main__":
    main()
