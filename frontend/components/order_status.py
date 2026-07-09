"""Order status timeline component."""

from __future__ import annotations

import streamlit as st

from utils.constants import ORDER_STAGES


def render_order_status(stage_index: int, order_id: str | None = None) -> None:
    stage_index = max(0, min(stage_index, len(ORDER_STAGES) - 1))

    if order_id:
        st.markdown(f"**Order ID:** `{order_id}`")

    parts: list[str] = []
    for idx, stage in enumerate(ORDER_STAGES):
        if idx < stage_index:
            cls = "done"
            mark = "✔"
        elif idx == stage_index:
            cls = "current"
            mark = "●"
        else:
            cls = ""
            mark = "○"
        parts.append(f'<span class="fv-step {cls}">{mark} {stage}</span>')
        if idx < len(ORDER_STAGES) - 1:
            parts.append('<span class="fv-arrow">→</span>')

    st.markdown(
        f'<div class="fv-timeline">{"".join(parts)}</div>',
        unsafe_allow_html=True,
    )
    st.progress((stage_index + 1) / len(ORDER_STAGES))
