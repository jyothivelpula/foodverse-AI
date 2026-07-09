"""Cart page."""

from __future__ import annotations

import streamlit as st

from utils.helpers import cart_subtotal, format_currency
from utils.session import clear_cart, get_cart, remove_from_cart, set_page, update_cart_quantity


def render() -> None:
    st.title("Cart")
    cart = get_cart()

    if not cart:
        st.info("Your cart is empty.")
        if st.button("Browse Menu"):
            set_page("menu")
            st.rerun()
        return

    for item in cart:
        cols = st.columns([4, 2, 2, 1])
        with cols[0]:
            st.write(f"**{item['name']}**")
            st.caption(format_currency(item["price"]))
        with cols[1]:
            qty = st.number_input(
                "Quantity",
                min_value=0,
                max_value=50,
                value=int(item["quantity"]),
                key=f"cart_page_qty_{item['id']}",
            )
            if qty != item["quantity"]:
                update_cart_quantity(item["id"], int(qty))
                st.rerun()
        with cols[2]:
            st.write(format_currency(item["price"] * item["quantity"]))
        with cols[3]:
            if st.button("Remove", key=f"cart_page_rm_{item['id']}"):
                remove_from_cart(item["id"])
                st.rerun()

    st.divider()
    st.subheader(f"Total: {format_currency(cart_subtotal(cart))}")

    c1, c2 = st.columns(2)
    with c1:
        if st.button("Clear Cart", use_container_width=True):
            clear_cart()
            st.rerun()
    with c2:
        if st.button("Proceed to Checkout", type="primary", use_container_width=True):
            set_page("checkout")
            st.rerun()


if __name__ == "__main__":
    from utils.session import init_session

    init_session()
    render()
