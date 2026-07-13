"""FoodVerse AI frontend entrypoint (Streamlit)."""

from __future__ import annotations

import sys
import time
from pathlib import Path

import streamlit as st

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from components.footer import render_footer
from components.sidebar import render_sidebar
from components.topbar import render_topbar
from config import APP_TITLE
from api_client import api_client
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

# Re-check /health periodically so status recovers when uvicorn starts mid-session
_BACKEND_HEALTH_TTL_SEC = 12.0


def _refresh_backend_status(*, force: bool = False) -> bool:
    now = time.monotonic()
    last = float(st.session_state.get("backend_checked_at") or 0.0)
    if force or "backend_online" not in st.session_state or (now - last) >= _BACKEND_HEALTH_TTL_SEC:
        st.session_state.backend_online = api_client.is_online()
        st.session_state.backend_checked_at = now
    return bool(st.session_state.backend_online)


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
    _refresh_backend_status()

    css = load_css()
    if css:
        st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)

    # Fixed 248px dark sidebar + wide cream main stage (website layout)
    st.markdown(
        """
        <style>
          section[data-testid="stSidebar"],
          section[data-testid="stSidebar"] > div:first-child {
            width: 248px !important;
            min-width: 248px !important;
            max-width: 248px !important;
          }
          [data-testid="stSidebar"][aria-expanded="true"] {
            min-width: 248px !important;
            max-width: 248px !important;
            width: 248px !important;
          }
          /* Keep dashboard content in the wide main pane — never sidebar width */
          section.main, [data-testid="stMain"], .main {
            width: calc(100% - 248px) !important;
            flex-grow: 1 !important;
            min-width: 0 !important;
            background: #FAF7F2 !important;
          }
          .block-container, .stMainBlockContainer {
            max-width: 100% !important;
            width: 100% !important;
          }
          @media (min-width: 1100px) {
            .block-container, .stMainBlockContainer {
              max-width: min(1400px, calc(100vw - 280px)) !important;
              margin-left: auto !important;
              margin-right: auto !important;
              padding-left: 2.5rem !important;
              padding-right: 2.5rem !important;
            }
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
