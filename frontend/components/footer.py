"""Page footer."""

from __future__ import annotations

import streamlit as st

from utils.constants import APP_NAME, APP_TAGLINE


def render_footer() -> None:
    st.markdown(
        f"""
        <div class="fv-footer">
          <strong>{APP_NAME}</strong> · {APP_TAGLINE}<br/>
          Browse · Order · Track · Chat with AI companions while you wait.
        </div>
        """,
        unsafe_allow_html=True,
    )
