"""Checkout page."""

from __future__ import annotations

import uuid

import streamlit as st

from utils.helpers import cart_subtotal, format_currency
from utils.session import clear_cart, clear_chat, get_cart, set_page


def render() -> None:
    st.title("Checkout")
    cart = get_cart()

    if not cart:
        st.warning("Add items to your cart before checkout.")
        if st.button("Go to Menu"):
            set_page("menu")
            st.rerun()
        return

    st.subheader("Order summary")
    for item in cart:
        st.write(f"{item['name']} × {item['quantity']} — {format_currency(item['price'] * item['quantity'])}")
    st.markdown(f"**Total: {format_currency(cart_subtotal(cart))}**")

    st.divider()
    st.subheader("Your details")
    customer = st.session_state.customer
    name = st.text_input("Name", value=customer.get("name", ""))
    phone = st.text_input("Phone", value=customer.get("phone", ""))
    email = st.text_input("Email", value=customer.get("email", ""))
    address = st.text_area("Address", value=customer.get("address", ""))
    order_type = st.radio("Order type", ["Delivery", "Pickup"], horizontal=True)

    if st.button("Place Order", type="primary"):
        if not name.strip() or not phone.strip():
            st.error("Name and phone are required.")
            return

        st.session_state.customer = {
            "name": name.strip(),
            "phone": phone.strip(),
            "email": email.strip(),
            "address": address.strip(),
        }
        order_id = f"FV-{uuid.uuid4().hex[:8].upper()}"
        st.session_state.active_order_id = order_id
        st.session_state.order_stage_index = 0
        st.session_state.last_order_type = order_type
        clear_cart()
        clear_chat()
        st.success(f"Order confirmed! ID: {order_id}")
        st.info("Estimated preparation time: 20 minutes. Enjoy the AI Lounge while you wait.")
        set_page("ai_lounge")
        st.rerun()


if __name__ == "__main__":
    from utils.session import init_session

    init_session()
    render()
