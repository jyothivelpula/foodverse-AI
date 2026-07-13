"""Menu page — premium restaurant UI (frontend only)."""

from __future__ import annotations

import streamlit as st

from components.cart_sidebar import render_cart_sidebar
from components.food_card import render_food_card
from utils.constants import DEMO_CATEGORIES
from utils.helpers import cart_item_count
from utils.session import get_cart, set_page


def render() -> None:
    st.markdown('<div class="fv-menu-page">', unsafe_allow_html=True)

    # Top strip: logo + search + cart (page-local; keeps global topbar too)
    cart_n = cart_item_count(get_cart())
    top_l, top_m, top_r = st.columns([1.4, 4.2, 1.0], vertical_alignment="center")
    with top_l:
        st.markdown(
            """
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:40px;height:40px;border-radius:50%;background:#F97316;color:#fff;
                          display:grid;place-items:center;font-size:1.1rem;">🍽</div>
              <div>
                <div style="font-family:Playfair Display,serif;font-weight:700;font-size:1.15rem;color:#1F1F1F;">FoodVerse</div>
                <div style="font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;font-weight:600;">AI Kitchen</div>
              </div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with top_m:
        st.markdown('<div class="fv-menu-search-wrap">', unsafe_allow_html=True)
        # Sync from global top search if present
        if "menu_search" in st.session_state and st.session_state.menu_search:
            st.session_state.menu_page_search = st.session_state.pop("menu_search")
        search = st.text_input(
            "Search dishes",
            placeholder="Search dishes...",
            key="menu_page_search",
            label_visibility="collapsed",
        )
        st.markdown("</div>", unsafe_allow_html=True)
    with top_r:
        if st.button(f"🛒 {cart_n}" if cart_n else "🛒 Cart", key="menu_top_cart", use_container_width=True):
            set_page("cart")
            st.rerun()

    # Feature cards
    st.markdown(
        """
        <div class="fv-menu-feature">
          <div class="fv-menu-feature-card">
            <h4>1. Pick your food</h4>
            <p>Browse our chef-curated menu.</p>
          </div>
          <div class="fv-menu-feature-card">
            <h4>2. Place the order</h4>
            <p>Live preparation timer.</p>
          </div>
          <div class="fv-menu-feature-card">
            <h4>3. Chat with AI</h4>
            <p>Chat with AI companions while waiting.</p>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # Header
    st.markdown(
        """
        <div class="fv-menu-title-wrap">
          <h1>The Menu</h1>
          <p>Freshly imagined, made to order.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    if "selected_category_id" not in st.session_state:
        st.session_state.selected_category_id = None

    # Filters + search row
    filt, right_search = st.columns([3.4, 1.4], vertical_alignment="center")
    with filt:
        st.markdown('<div class="fv-menu-pills">', unsafe_allow_html=True)
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
                if st.button(
                    category["name"],
                    key=f"cat_{category['id']}",
                    use_container_width=True,
                    type="primary" if selected else "secondary",
                ):
                    st.session_state.selected_category_id = category["id"]
                    st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)

    with right_search:
        st.markdown('<div class="fv-menu-search-wrap">', unsafe_allow_html=True)
        side_q = st.text_input(
            "Filter search",
            placeholder="Search dishes...",
            key="menu_side_search",
            label_visibility="collapsed",
        )
        st.markdown("</div>", unsafe_allow_html=True)

    query = (search or "").strip() or (side_q or "").strip()

    items = list(st.session_state.menu_items)
    if st.session_state.selected_category_id is not None:
        items = [i for i in items if i["category_id"] == st.session_state.selected_category_id]
    if query:
        q = query.lower()
        items = [
            i
            for i in items
            if q in i["name"].lower()
            or q in (i.get("description") or "").lower()
            or q in (i.get("cuisine") or "").lower()
        ]

    main, side = st.columns([3, 1.1], gap="large")
    with main:
        st.caption(f"{len(items)} dish{'es' if len(items) != 1 else ''} available")
        if not items:
            st.warning("No dishes match your filters.")
        else:
            st.markdown('<div class="fv-menu-grid">', unsafe_allow_html=True)
            grid = st.columns(3, gap="large")
            for idx, item in enumerate(items):
                with grid[idx % 3]:
                    with st.container(border=True):
                        render_food_card(item, compact=True, show_favorite=False)
            st.markdown("</div>", unsafe_allow_html=True)

    with side:
        st.markdown(
            f'<div style="background:#fff;border:1px solid #EAEAEA;border-radius:20px;'
            f'padding:1.1rem 1rem 0.5rem;box-shadow:0 10px 30px rgba(30,30,30,0.06);">'
            f'<div style="font-family:Playfair Display,serif;font-size:1.2rem;font-weight:600;'
            f'margin-bottom:0.75rem;color:#1F1F1F;">Your Cart</div></div>',
            unsafe_allow_html=True,
        )
        render_cart_sidebar()

    st.markdown("</div>", unsafe_allow_html=True)
