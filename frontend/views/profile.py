"""Customer profile page."""

from __future__ import annotations

import streamlit as st

from utils.session import get_cart, set_page


def render() -> None:
    st.title("Profile")

    customer = st.session_state.customer
    with st.form("profile_form"):
        name = st.text_input("Name", value=customer.get("name", ""))
        phone = st.text_input("Phone", value=customer.get("phone", ""))
        email = st.text_input("Email", value=customer.get("email", ""))
        address = st.text_area("Address", value=customer.get("address", ""))
        saved = st.form_submit_button("Save profile", type="primary")

        if saved:
            st.session_state.customer = {
                "name": name.strip(),
                "phone": phone.strip(),
                "email": email.strip(),
                "address": address.strip(),
            }
            st.success("Profile saved.")

    st.divider()
    st.subheader("Quick links")
    c1, c2, c3 = st.columns(3)
    with c1:
        st.metric("Cart items", sum(i["quantity"] for i in get_cart()))
        if st.button("Open cart"):
            set_page("cart")
            st.rerun()
    with c2:
        st.write(f"Active order: `{st.session_state.get('active_order_id') or 'None'}`")
        if st.button("Track order"):
            set_page("order_tracking")
            st.rerun()
    with c3:
        if st.button("AI Lounge"):
            set_page("ai_lounge")
            st.rerun()


if __name__ == "__main__":
    from utils.session import init_session

    init_session()
    render()
