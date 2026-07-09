"""Category filter card."""

from __future__ import annotations

import streamlit as st


def render_category_card(category: dict, selected: bool = False) -> bool:
    label = category["name"]
    if selected:
        label = f"✓ {label}"
    clicked = st.button(
        label,
        key=f"cat_{category['id']}",
        use_container_width=True,
        type="primary" if selected else "secondary",
        help=category.get("description") or "",
    )
    return clicked
