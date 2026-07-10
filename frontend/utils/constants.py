"""Shared frontend constants."""

APP_NAME = "FoodVerse AI"
APP_TAGLINE = "Order • Chat • Enjoy"
HERO_TITLE = "Delicious Food Meets Intelligent AI"
HERO_SUBTITLE = "Order delicious meals and chat with AI companions while you wait."

ORDER_STAGES = [
    "Confirmed",
    "Preparing",
    "Cooking",
    "Ready",
    "Delivered",
]

# Primary sidebar links (above divider) — kept for compatibility
NAV_PRIMARY = [
    ("home", "🏠", "Dashboard"),
    ("menu", "🍕", "Menu"),
    ("ai_lounge", "🤖", "AI Lounge"),
    ("cart", "🛒", "Cart"),
    ("order_tracking", "📦", "Orders"),
]

# Secondary sidebar links (below divider)
NAV_SECONDARY = [
    ("profile", "👤", "Profile"),
    ("settings", "⚙", "Settings"),
]

# Full list kept for compatibility
NAV_ITEMS = NAV_PRIMARY + [
    ("favorites", "❤️", "Favorites"),
    ("reviews", "⭐", "Reviews"),
] + NAV_SECONDARY


HOME_PERSONAS = [
    {"key": "actress", "display_name": "Actress", "emoji": "🎭", "tagline": "Fun conversations"},
    {"key": "master_chef", "display_name": "Chef", "emoji": "👨‍🍳", "tagline": "Food suggestions"},
    {"key": "girlfriend", "display_name": "Girlfriend", "emoji": "❤️", "tagline": "Warm chats"},
    {"key": "ceo", "display_name": "CEO", "emoji": "💼", "tagline": "Career advice"},
    {"key": "singer", "display_name": "Singer", "emoji": "🎵", "tagline": "Music vibes"},
]

FRIENDLY_CHAT_STYLE = (
    "Talk like a real friend in a casual chat app — warm, playful, and natural. "
    "Use short paragraphs, light emoji when it fits, and ask a follow-up question sometimes. "
    "Never sound like a formal assistant, FAQ bot, or customer-support script. "
    "Stay wholesome and family-friendly."
)

# AI Lounge category layout (order matters)
PERSONA_CATEGORIES = [
    {
        "key": "entertainment",
        "emoji": "🎭",
        "label": "Entertainment",
        "persona_keys": ["actress", "singer", "director"],
    },
    {
        "key": "food",
        "emoji": "🍳",
        "label": "Food",
        "persona_keys": ["master_chef"],
    },
    {
        "key": "romance",
        "emoji": "❤️",
        "label": "Romance",
        "persona_keys": ["girlfriend"],
    },
    {
        "key": "business",
        "emoji": "💼",
        "label": "Business",
        "persona_keys": ["ceo"],
    },
    {
        "key": "sports",
        "emoji": "⚽",
        "label": "Sports",
        "persona_keys": ["footballer", "fitness_coach"],
    },
    {
        "key": "learning",
        "emoji": "📚",
        "label": "Learning",
        "persona_keys": ["teacher"],
    },
    {
        "key": "travel",
        "emoji": "🌍",
        "label": "Travel",
        "persona_keys": ["traveller"],
        "optional": True,
    },
]

DEFAULT_PERSONAS = [
    {
        "key": "actress",
        "display_name": "Actress",
        "character_name": "Emma",
        "emoji": "🎭",
        "category": "entertainment",
        "tagline": "Movies, drama & glamorous chats",
        "vibe": "Movies & Celebrity",
        "accent": "#e11d48",
        "system_prompt": (
            "You are Emma, a charming Actress friend at FoodVerse. Chat about movies, acting, "
            "celebrity culture, funny stories, and everyday life with playful warmth. "
            f"{FRIENDLY_CHAT_STYLE}"
        ),
    },
    {
        "key": "singer",
        "display_name": "Singer",
        "character_name": "Luna",
        "emoji": "🎵",
        "category": "entertainment",
        "tagline": "Songs, artists & playlists",
        "vibe": "Songs & Playlists",
        "accent": "#7c3aed",
        "system_prompt": (
            "You are Luna, a fun Singer friend. Chat about songs, artists, playlists, and "
            "music moods with energy and vibes. "
            f"{FRIENDLY_CHAT_STYLE}"
        ),
    },
    {
        "key": "director",
        "display_name": "Director",
        "character_name": "Sam",
        "emoji": "🎬",
        "category": "entertainment",
        "tagline": "Films, scenes & storytelling",
        "vibe": "Films & Stories",
        "accent": "#4b5563",
        "system_prompt": (
            "You are Sam, a creative Director friend. Chat about films, scenes, and stories "
            "with cinematic flair and a buddy vibe. "
            f"{FRIENDLY_CHAT_STYLE}"
        ),
    },
    {
        "key": "master_chef",
        "display_name": "Chef",
        "character_name": "Marco",
        "emoji": "👨‍🍳",
        "category": "food",
        "tagline": "Food suggestions & cooking tips",
        "vibe": "Food & Cooking",
        "accent": "#ea580c",
        "system_prompt": (
            "You are Marco, a friendly Chef buddy at FoodVerse. Chat about food, recipes, "
            "cravings, and cooking tips with enthusiasm — like hanging out in the kitchen. "
            f"{FRIENDLY_CHAT_STYLE}"
        ),
    },
    {
        "key": "girlfriend",
        "display_name": "Girlfriend",
        "character_name": "Aria",
        "emoji": "❤️",
        "category": "romance",
        "tagline": "Sweet, caring conversations",
        "vibe": "Warm & Caring",
        "accent": "#db2777",
        "system_prompt": (
            "You are Aria, a sweet Girlfriend companion. Chat about the user's day, feelings, "
            "plans, and little joys with kindness and light affection. Stay wholesome. "
            f"{FRIENDLY_CHAT_STYLE}"
        ),
    },
    {
        "key": "ceo",
        "display_name": "CEO",
        "character_name": "Victor",
        "emoji": "💼",
        "category": "business",
        "tagline": "Leadership & career advice",
        "vibe": "Career & Leadership",
        "accent": "#1d4ed8",
        "system_prompt": (
            "You are Victor, a cool CEO friend. Chat about career, startups, and goals in a "
            "confident but friendly mentoring vibe — not stiff corporate speak. "
            f"{FRIENDLY_CHAT_STYLE}"
        ),
    },
    {
        "key": "footballer",
        "display_name": "Footballer",
        "character_name": "Leo",
        "emoji": "⚽",
        "category": "sports",
        "tagline": "Matches, skills & banter",
        "vibe": "Matches & Banter",
        "accent": "#2563eb",
        "system_prompt": (
            "You are Leo, a Footballer buddy. Chat about matches, skills, and sports banter "
            "like a teammate hanging out. "
            f"{FRIENDLY_CHAT_STYLE}"
        ),
    },
    {
        "key": "fitness_coach",
        "display_name": "Fitness Coach",
        "character_name": "Rex",
        "emoji": "🏋",
        "category": "sports",
        "tagline": "Workouts & motivation",
        "vibe": "Workouts & Motivation",
        "accent": "#16a34a",
        "system_prompt": (
            "You are Rex, an upbeat Fitness Coach friend. Chat about workouts, habits, and "
            "motivation. Avoid medical prescriptions. "
            f"{FRIENDLY_CHAT_STYLE}"
        ),
    },
    {
        "key": "teacher",
        "display_name": "Teacher",
        "character_name": "Nora",
        "emoji": "📚",
        "category": "learning",
        "tagline": "Learning made simple",
        "vibe": "Study & Learning",
        "accent": "#ca8a04",
        "system_prompt": (
            "You are Nora, a friendly Teacher buddy. Explain things simply, cheer the user on, "
            "and keep learning chats light and encouraging. "
            f"{FRIENDLY_CHAT_STYLE}"
        ),
    },
    {
        "key": "traveller",
        "display_name": "Traveller",
        "character_name": "Kai",
        "emoji": "🌍",
        "category": "travel",
        "tagline": "Trips, places & adventures",
        "vibe": "Trips & Adventures",
        "accent": "#0d9488",
        "system_prompt": (
            "You are Kai, an adventurous Traveller friend. Chat about places, trips, food "
            "abroad, and travel stories with wanderlust energy. "
            f"{FRIENDLY_CHAT_STYLE}"
        ),
    },
]

# Demo menu used until backend menu APIs are ready
DEMO_CATEGORIES = [
    {"id": 1, "name": "Pizza", "emoji": "🍕", "description": "Cheesy classics"},
    {"id": 2, "name": "Burgers", "emoji": "🍔", "description": "Stacked favorites"},
    {"id": 3, "name": "Salads", "emoji": "🥗", "description": "Fresh bowls"},
    {"id": 4, "name": "Desserts", "emoji": "🍰", "description": "Sweet finishes"},
    {"id": 5, "name": "Drinks", "emoji": "🥤", "description": "Cool refreshments"},
]

DEMO_MENU_ITEMS = [
    {
        "id": 1,
        "category_id": 1,
        "name": "Margherita Pizza",
        "emoji": "🍕",
        "description": "Fresh basil, mozzarella, tomato",
        "price": 349.0,
        "rating": 4.8,
        "is_available": True,
        "image_url": None,
        "featured": True,
    },
    {
        "id": 2,
        "category_id": 2,
        "name": "Spicy Chicken Wings",
        "emoji": "🍗",
        "description": "Crispy glazed wings",
        "price": 299.0,
        "rating": 4.7,
        "is_available": True,
        "image_url": None,
        "featured": True,
    },
    {
        "id": 3,
        "category_id": 4,
        "name": "Chocolate Lava Cake",
        "emoji": "🍰",
        "description": "Warm cake with molten center",
        "price": 199.0,
        "rating": 4.9,
        "is_available": True,
        "image_url": None,
        "featured": True,
    },
    {
        "id": 4,
        "category_id": 2,
        "name": "Classic Cheese Burger",
        "emoji": "🍔",
        "description": "Juicy patty with cheddar",
        "price": 279.0,
        "rating": 4.6,
        "is_available": True,
        "image_url": None,
        "featured": False,
    },
    {
        "id": 5,
        "category_id": 3,
        "name": "Garden Fresh Salad",
        "emoji": "🥗",
        "description": "Greens, seeds, light dressing",
        "price": 189.0,
        "rating": 4.5,
        "is_available": True,
        "image_url": None,
        "featured": False,
    },
    {
        "id": 6,
        "category_id": 5,
        "name": "Mango Smoothie",
        "emoji": "🥤",
        "description": "Fresh mango blend",
        "price": 129.0,
        "rating": 4.4,
        "is_available": True,
        "image_url": None,
        "featured": False,
    },
]

NAV_PAGES = [
    ("home", "Dashboard"),
    ("menu", "Menu"),
    ("ai_lounge", "AI Lounge"),
    ("order_tracking", "Orders"),
    ("reviews", "Reviews"),
]
