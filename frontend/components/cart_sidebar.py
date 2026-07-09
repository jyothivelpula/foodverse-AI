"""Cart summary sidebar."""

from __future__ import annotations

import streamlit as st

from utils.helpers import cart_subtotal, format_currency
from utils.session import get_cart, remove_from_cart, set_page, update_cart_quantity


def render_cart_sidebar() -> None:
    st.markdown("### Your Cart")
    cart = get_cart()

    if not cart:
        st.info("Cart is empty. Browse the menu to add items.")
        if st.button("Go to Menu", key="sidebar_menu_btn"):
            set_page("menu")
            st.rerun()
        return

    for item in cart:
        cols = st.columns([3, 1, 1])
        with cols[0]:
            st.write(item["name"])
            st.caption(format_currency(item["price"]))
        with cols[1]:
            new_qty = st.number_input(
                "Qty",
                min_value=0,
                max_value=50,
                value=int(item["quantity"]),
                key=f"sidebar_qty_{item['id']}",
                label_visibility="collapsed",
            )
            if new_qty != item["quantity"]:
                update_cart_quantity(item["id"], int(new_qty))
                st.rerun()
        with cols[2]:
            if st.button("✕", key=f"sidebar_rm_{item['id']}"):
                remove_from_cart(item["id"])
                st.rerun()

    st.divider()
    st.markdown(f"**Subtotal:** {format_currency(cart_subtotal(cart))}")

    if st.button("Checkout", type="primary", use_container_width=True, key="sidebar_checkout"):
        set_page("checkout")
        st.rerun()
