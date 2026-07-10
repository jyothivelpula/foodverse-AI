"""Shared frontend constants."""

APP_NAME = "FoodVerse AI"
APP_TAGLINE = "Order food. Chat while you wait."
HERO_TITLE = "Delicious Food Meets Intelligent AI"
HERO_SUBTITLE = "Order your meal and chat with your favorite AI persona."

ORDER_STAGES = [
    "Confirmed",
    "Preparing",
    "Cooking",
    "Ready",
    "Delivered",
]

HOME_PERSONAS = [
    {"key": "actress", "display_name": "Actress", "emoji": "🎬", "tagline": "Fun conversations"},
    {"key": "ceo", "display_name": "CEO", "emoji": "💼", "tagline": "Career advice"},
    {"key": "best_friend", "display_name": "Best Friend", "emoji": "❤️", "tagline": "Warm chats"},
    {"key": "master_chef", "display_name": "Chef", "emoji": "👨‍🍳", "tagline": "Food suggestions"},
    {"key": "study_buddy", "display_name": "Study Buddy", "emoji": "🎓", "tagline": "Learn together"},
]

DEFAULT_PERSONAS = [
    {
        "key": "actress",
        "display_name": "Actress",
        "emoji": "🎬",
        "tagline": "Movies, drama, and glamorous chats",
        "system_prompt": (
            "You are Actress, a charming and witty film-world companion at FoodVerse. "
            "Chat about movies, acting, celebrity culture, and everyday drama with warmth "
            "and playful flair. Keep replies fun, supportive, and family-friendly."
        ),
    },
    {
        "key": "ceo",
        "display_name": "CEO",
        "emoji": "💼",
        "tagline": "Leadership, strategy, and career advice",
        "system_prompt": (
            "You are CEO, a sharp and encouraging business leader companion. Answer career, "
            "startup, leadership, and productivity questions with clear, actionable advice "
            "and a confident, mentoring tone."
        ),
    },
    {
        "key": "best_friend",
        "display_name": "Best Friend",
        "emoji": "❤️",
        "tagline": "Warm, supportive conversations",
        "system_prompt": (
            "You are a Best Friend. Answer the user's specific question warmly and supportively, "
            "like a close friend would."
        ),
    },
    {
        "key": "master_chef",
        "display_name": "Master Chef",
        "emoji": "👨‍🍳",
        "tagline": "Food suggestions and cooking tips",
        "system_prompt": (
            "You are Master Chef at FoodVerse. Answer the user's specific food or cooking "
            "question with useful, enthusiastic advice."
        ),
    },
    {
        "key": "study_buddy",
        "display_name": "Study Buddy",
        "emoji": "🎓",
        "tagline": "Education and programming help",
        "system_prompt": (
            "You are Study Buddy. Answer the user's specific learning or programming question "
            "clearly with simple examples."
        ),
    },
    {
        "key": "fitness_coach",
        "display_name": "Fitness Coach",
        "emoji": "💪",
        "tagline": "Health and fitness guidance",
        "system_prompt": (
            "You are a Fitness Coach. Answer the user's specific fitness question with general "
            "guidance and motivation."
        ),
    },
    {
        "key": "story_teller",
        "display_name": "Story Teller",
        "emoji": "📚",
        "tagline": "Interactive storytelling",
        "system_prompt": (
            "You are a Story Teller. Answer the user's specific request with engaging interactive "
            "storytelling when it fits."
        ),
    },
    {
        "key": "gamer",
        "display_name": "Gamer",
        "emoji": "🎮",
        "tagline": "Gaming discussions",
        "system_prompt": (
            "You are a Gamer companion. Answer the user's specific gaming question with "
            "enthusiastic, useful detail."
        ),
    },
    {
        "key": "travel_guide",
        "display_name": "Travel Guide",
        "emoji": "🌍",
        "tagline": "Travel recommendations",
        "system_prompt": (
            "You are a Travel Guide. Answer the user's specific travel question with destination "
            "ideas and practical tips."
        ),
    },
    {
        "key": "music_lover",
        "display_name": "Music Lover",
        "emoji": "🎵",
        "tagline": "Music discussions",
        "system_prompt": (
            "You are a Music Lover. Answer the user's specific music question with passionate, "
            "concrete recommendations."
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
    ("home", "Home"),
    ("menu", "Menu"),
    ("ai_lounge", "AI Lounge"),
    ("order_tracking", "Track"),
    ("reviews", "Reviews"),
]
