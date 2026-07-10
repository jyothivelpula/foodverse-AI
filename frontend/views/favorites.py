"""Favorites page."""

from __future__ import annotations

import streamlit as st

from components.food_card import render_food_card
from utils.session import set_page


def render() -> None:
    st.markdown(
        """
        <div class="fv-page-head">
          <h2>❤️ Favorites</h2>
          <p>Dishes you saved for later.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    fav_ids = set(st.session_state.get("favorites", []))
    items = [item for item in st.session_state.menu_items if item["id"] in fav_ids]

    if not items:
        st.info("No favorites yet. Heart items from the menu to see them here.")
        if st.button("Browse menu", key="fav_to_menu"):
            set_page("menu")
            st.rerun()
        return

    st.markdown('<div class="fv-menu-grid">', unsafe_allow_html=True)
    cols = st.columns(3)
    for idx, item in enumerate(items):
        with cols[idx % 3]:
            with st.container(border=True):
                render_food_card(item, compact=True)
    st.markdown("</div>", unsafe_allow_html=True)
