"""Reviews page."""

from __future__ import annotations

from datetime import datetime

import streamlit as st


def render() -> None:
    st.title("Reviews")
    st.write("Share feedback about your meal or AI companion experience.")

    with st.form("review_form", clear_on_submit=True):
        name = st.text_input("Your name", value=st.session_state.customer.get("name", ""))
        rating = st.slider("Rating", min_value=1, max_value=5, value=5)
        comment = st.text_area("Comment", placeholder="What did you enjoy?")
        submitted = st.form_submit_button("Submit review", type="primary")

        if submitted:
            if not comment.strip():
                st.error("Please add a short comment.")
            else:
                st.session_state.reviews.insert(
                    0,
                    {
                        "name": name.strip() or "Guest",
                        "rating": rating,
                        "comment": comment.strip(),
                        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
                    },
                )
                st.success("Thanks for your review!")

    st.divider()
    reviews = st.session_state.get("reviews", [])
    if not reviews:
        st.info("No reviews yet. Be the first!")
        return

    for review in reviews:
        with st.container(border=True):
            st.markdown(f"**{review['name']}** · {'⭐' * int(review['rating'])}")
            st.write(review["comment"])
            st.caption(review["created_at"])


if __name__ == "__main__":
    from utils.session import init_session

    init_session()
    render()
