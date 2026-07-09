from pathlib import Path

structure = {
    "frontend": {
        "app.py": "",
        "api_client.py": "",
        "config.py": "",

        "pages": {
            "__init__.py": "",
            "home.py": "",
            "menu.py": "",
            "cart.py": "",
            "checkout.py": "",
            "order_tracking.py": "",
            "ai_lounge.py": "",
            "chat.py": "",
            "reviews.py": "",
            "profile.py": "",
        },

        "components": {
            "__init__.py": "",
            "navbar.py": "",
            "food_card.py": "",
            "category_card.py": "",
            "cart_sidebar.py": "",
            "chatbot.py": "",
            "order_status.py": "",
            "persona_selector.py": "",
            "footer.py": "",
        },

        "assets": {
            "images": {},
            "icons": {},
            "logo.png": "",
        },

        "styles": {
            "style.css": "",
        },

        "utils": {
            "__init__.py": "",
            "session.py": "",
            "helpers.py": "",
            "constants.py": "",
        },
    }
}


def create_structure(base_path, tree):
    for name, content in tree.items():
        path = base_path / name

        if isinstance(content, dict):
            path.mkdir(parents=True, exist_ok=True)
            create_structure(path, content)
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.touch(exist_ok=True)


if __name__ == "__main__":
    create_structure(Path("."), structure)
    print("✅ Frontend project structure created successfully!")