"""Menu page."""

from __future__ import annotations

import streamlit as st

from components.cart_sidebar import render_cart_sidebar
from components.food_card import render_food_card
from utils.constants import DEMO_CATEGORIES


def render() -> None:
    st.markdown("## Menu")
    st.caption("Search dishes, filter by category, and add favorites to your cart.")

    if "selected_category_id" not in st.session_state:
        st.session_state.selected_category_id = None

    if "menu_search" in st.session_state and st.session_state.menu_search:
        st.session_state.menu_page_search = st.session_state.pop("menu_search")

    search = st.text_input(
        "Search dishes",
        placeholder="e.g. pizza, burger, cake",
        key="menu_page_search",
    )

    cat_cols = st.columns(len(DEMO_CATEGORIES) + 1)
    with cat_cols[0]:
        if st.button(
            "All",
            use_container_width=True,
            type="primary" if st.session_state.selected_category_id is None else "secondary",
            key="cat_all",
        ):
            st.session_state.selected_category_id = None
            st.rerun()

    for idx, category in enumerate(DEMO_CATEGORIES):
        with cat_cols[idx + 1]:
            selected = st.session_state.selected_category_id == category["id"]
            label = f"{category.get('emoji', '')} {category['name']}"
            if st.button(
                label,
                key=f"cat_{category['id']}",
                use_container_width=True,
                type="primary" if selected else "secondary",
            ):
                st.session_state.selected_category_id = category["id"]
                st.rerun()

    items = list(st.session_state.menu_items)
    if st.session_state.selected_category_id is not None:
        items = [i for i in items if i["category_id"] == st.session_state.selected_category_id]
    if search.strip():
        q = search.strip().lower()
        items = [
            i
            for i in items
            if q in i["name"].lower() or q in (i.get("description") or "").lower()
        ]

    main, side = st.columns([3, 1.15], gap="large")
    with main:
        if not items:
            st.warning("No dishes match your filters.")
        else:
            grid = st.columns(3)
            for idx, item in enumerate(items):
                with grid[idx % 3]:
                    render_food_card(item, compact=True)

    with side:
        render_cart_sidebar()


if __name__ == "__main__":
    from utils.session import init_session

    init_session()
    render()
