"""Menu item card — premium restaurant layout (frontend UI only)."""

from __future__ import annotations

import html

import streamlit as st

from utils.helpers import format_currency
from utils.session import add_to_cart

FOOD_IMAGES = {
    1: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80",
    2: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80",
    3: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
    4: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",
    5: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    6: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80",
    7: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
    8: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    9: "https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=900&q=80",
}

# Name fallback so stale session items still get the right photo
NAME_IMAGES = {
    "margherita pizza": FOOD_IMAGES[2],
    "spicy chicken wings": FOOD_IMAGES[9],
    "hyderabadi chicken biryani": FOOD_IMAGES[1],
    "chocolate lava cake": FOOD_IMAGES[3],
    "spicy ramen bowl": FOOD_IMAGES[4],
    "garden fresh salad": FOOD_IMAGES[5],
    "mango smoothie": FOOD_IMAGES[6],
    "butter chicken": FOOD_IMAGES[7],
    "classic cheese burger": FOOD_IMAGES[8],
}

FALLBACK_IMAGE = (
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
    "?auto=format&fit=crop&w=900&q=80"
)


def _image_for(item: dict) -> str:
    url = (item.get("image_url") or "").strip()
    if url:
        return url
    name_key = str(item.get("name") or "").strip().lower()
    if name_key in NAME_IMAGES:
        return NAME_IMAGES[name_key]
    try:
        return FOOD_IMAGES.get(int(item["id"]), FALLBACK_IMAGE)
    except (TypeError, ValueError):
        return FALLBACK_IMAGE


def render_food_card(
    item: dict,
    compact: bool = False,
    *,
    show_favorite: bool = True,
) -> None:
    rating = item.get("rating")
    available = bool(item.get("is_available", True))
    favorites = st.session_state.setdefault("favorites", [])
    is_fav = item["id"] in favorites
    suffix = "c" if compact else "f"
    name = html.escape(str(item["name"]))
    desc = html.escape(str(item.get("description") or "Chef’s special"))
    price = format_currency(float(item["price"]))
    image = html.escape(_image_for(item))
    rating_txt = f"⭐ {rating}" if rating else "Chef pick"
    badge = html.escape(str(item.get("badge") or ""))
    prep = int(item.get("prep_min") or 20)

    badge_html = f'<span class="fv-lux-badge">{badge}</span>' if badge else ""
    st.markdown(
        f"""
        <div class="fv-food-card fv-lux-card">
          <div class="fv-lux-img-wrap">
            <img class="fv-lux-img" src="{image}" alt="{name}" loading="lazy" />
            {badge_html}
            <span class="fv-lux-rating-chip">{rating_txt}</span>
          </div>
          <div class="fv-lux-body">
            <h4 class="fv-lux-title">{name}</h4>
            <p class="fv-lux-desc">{desc}</p>
            <div class="fv-lux-meta">
              <span class="fv-lux-price">{price}</span>
              <span class="fv-lux-prep">⏱ {prep} min</span>
            </div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    if show_favorite:
        b1, b2 = st.columns([3.2, 1])
        with b1:
            if st.button(
                "Add +" if available else "Unavailable",
                key=f"add_{item['id']}_{suffix}",
                disabled=not available,
                use_container_width=True,
                type="primary",
            ):
                add_to_cart(item, 1)
                st.toast(f"Added {item['name']} to cart")
        with b2:
            if st.button(
                "♥" if is_fav else "♡",
                key=f"fav_{item['id']}_{suffix}",
                use_container_width=True,
            ):
                if is_fav:
                    st.session_state.favorites = [fid for fid in favorites if fid != item["id"]]
                else:
                    st.session_state.favorites = [*favorites, item["id"]]
                st.rerun()
    else:
        if st.button(
            "Add +" if available else "Unavailable",
            key=f"add_{item['id']}_{suffix}",
            disabled=not available,
            use_container_width=True,
            type="primary",
        ):
            add_to_cart(item, 1)
            st.toast(f"Added {item['name']} to cart")
