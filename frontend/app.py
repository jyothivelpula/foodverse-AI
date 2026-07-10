"""FoodVerse AI frontend entrypoint (Streamlit)."""

from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from components.footer import render_footer
from components.sidebar import render_sidebar
from components.topbar import render_topbar
from config import APP_TITLE
from utils.helpers import load_css
from utils.session import init_session
from views import (
    ai_lounge,
    cart,
    checkout,
    favorites,
    home,
    menu,
    order_tracking,
    profile,
    reviews,
    settings,
)


PAGE_RENDERERS = {
    "home": home.render,
    "menu": menu.render,
    "cart": cart.render,
    "checkout": checkout.render,
    "order_tracking": order_tracking.render,
    "ai_lounge": ai_lounge.render,
    "chat": ai_lounge.render,
    "reviews": reviews.render,
    "profile": profile.render,
    "favorites": favorites.render,
    "settings": settings.render,
}


def main() -> None:
    st.set_page_config(
        page_title=APP_TITLE,
        page_icon="🍽️",
        layout="wide",
        initial_sidebar_state="expanded",
    )
    init_session()

    css = load_css()
    if css:
        st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)

    # Fixed 240px sidebar
    st.markdown(
        """
        <style>
          section[data-testid="stSidebar"],
          section[data-testid="stSidebar"] > div:first-child {
            width: 240px !important;
            min-width: 240px !important;
            max-width: 240px !important;
          }
          [data-testid="stSidebar"][aria-expanded="true"] {
            min-width: 240px !important;
            max-width: 240px !important;
            width: 240px !important;
          }
        </style>
        """,
        unsafe_allow_html=True,
    )

    if st.session_state.get("page") == "chat":
        st.session_state.page = "ai_lounge"
        st.session_state.lounge_view = "chat"

    render_sidebar()
    render_topbar()

    page = st.session_state.get("page", "home")
    renderer = PAGE_RENDERERS.get(page, home.render)
    renderer()

    render_footer()


if __name__ == "__main__":
    main()
