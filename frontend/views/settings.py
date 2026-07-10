"""Settings page."""

from __future__ import annotations

import streamlit as st


def render() -> None:
    st.markdown(
        """
        <div class="fv-page-head">
          <h2>⚙️ Settings</h2>
          <p>Tune your FoodVerse experience.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    settings = st.session_state.setdefault(
        "settings",
        {
            "notifications": True,
            "order_updates": True,
            "ai_suggestions": True,
            "default_lounge": "gallery",
        },
    )

    with st.form("settings_form"):
        notifications = st.toggle("Push-style alerts in app", value=settings.get("notifications", True))
        order_updates = st.toggle("Order status updates", value=settings.get("order_updates", True))
        ai_suggestions = st.toggle("AI food suggestions", value=settings.get("ai_suggestions", True))
        saved = st.form_submit_button("Save settings", type="primary")
        if saved:
            st.session_state.settings = {
                "notifications": notifications,
                "order_updates": order_updates,
                "ai_suggestions": ai_suggestions,
                "default_lounge": "gallery",
            }
            st.success("Settings saved.")
