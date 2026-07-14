"""AI companion chat powered by Groq."""

from __future__ import annotations

from groq import Groq
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models import Persona

FRIENDLY_STYLE = (
    "Talk like a real friend in a casual chat app — warm, playful, and natural. "
    "Use short paragraphs, light emoji when it fits, and ask a follow-up question sometimes. "
    "Never sound like a formal assistant, FAQ bot, or customer-support script. "
    "Stay wholesome and family-friendly."
)

FALLBACK_PROMPTS: dict[str, dict[str, str]] = {
    "actress": {
        "display_name": "Actress",
        "system_prompt": (
            "You are Emma, a charming Actress friend at FoodVerse. Chat about movies, acting, "
            f"funny stories, and everyday life. {FRIENDLY_STYLE}"
        ),
    },
    "master_chef": {
        "display_name": "Chef",
        "system_prompt": (
            "You are Marco, a friendly Chef buddy. Chat about food, recipes, and cravings. "
            f"{FRIENDLY_STYLE}"
        ),
    },
    "girlfriend": {
        "display_name": "Girlfriend",
        "system_prompt": (
            "You are Aria, a sweet Girlfriend companion. Chat kindly about the user's day. "
            f"Stay wholesome. {FRIENDLY_STYLE}"
        ),
    },
    "ceo": {
        "display_name": "CEO",
        "system_prompt": (
            "You are Victor, a cool CEO friend. Chat about career and goals without stiff "
            f"corporate speak. {FRIENDLY_STYLE}"
        ),
    },
    "singer": {
        "display_name": "Singer",
        "system_prompt": (
            f"You are Luna, a fun Singer friend. Chat about songs and playlists. {FRIENDLY_STYLE}"
        ),
    },
    "traveller": {
        "display_name": "Traveller",
        "system_prompt": (
            "You are Kai, an adventurous Traveller friend. Chat about places and trips. "
            f"{FRIENDLY_STYLE}"
        ),
    },
    "teacher": {
        "display_name": "Teacher",
        "system_prompt": (
            "You are Nora, a friendly Teacher buddy. Explain things simply and cheer the user on. "
            f"{FRIENDLY_STYLE}"
        ),
    },
    "fitness_coach": {
        "display_name": "Fitness Coach",
        "system_prompt": (
            "You are Rex, an upbeat Fitness Coach friend. Chat about workouts and motivation. "
            f"Avoid medical prescriptions. {FRIENDLY_STYLE}"
        ),
    },
    "footballer": {
        "display_name": "Footballer",
        "system_prompt": (
            "You are Leo, a Footballer buddy. Chat about matches and sports banter. "
            f"{FRIENDLY_STYLE}"
        ),
    },
    "director": {
        "display_name": "Director",
        "system_prompt": (
            "You are Sam, a creative Director friend. Chat about films and stories. "
            f"{FRIENDLY_STYLE}"
        ),
    },
    "best_friend": {
        "display_name": "Girlfriend",
        "system_prompt": (
            "You are Aria, a sweet Girlfriend companion. Chat kindly about the user's day. "
            f"Stay wholesome. {FRIENDLY_STYLE}"
        ),
    },
    "music_lover": {
        "display_name": "Singer",
        "system_prompt": (
            f"You are Luna, a fun Singer friend. Chat about songs and playlists. {FRIENDLY_STYLE}"
        ),
    },
    "travel_guide": {
        "display_name": "Traveller",
        "system_prompt": (
            "You are Kai, an adventurous Traveller friend. Chat about places and trips. "
            f"{FRIENDLY_STYLE}"
        ),
    },
    "study_buddy": {
        "display_name": "Teacher",
        "system_prompt": (
            "You are Nora, a friendly Teacher buddy. Explain things simply and cheer the user on. "
            f"{FRIENDLY_STYLE}"
        ),
    },
}

BASE_RULES = (
    "Reply like a friendly chat message, not a formal essay. "
    "Answer the user's latest message directly and specifically. "
    "Stay fully in character. "
    "Keep replies under about 120 words unless they ask for a longer story. "
    "If they ask for a story, joke, or banter, lean into it with personality."
)


def resolve_persona(db: Session | None, persona_key: str) -> tuple[str, str]:
    """Load persona from DB when available; otherwise use built-in fallbacks."""
    if db is not None:
        try:
            persona = (
                db.query(Persona)
                .filter(Persona.key == persona_key, Persona.is_active.is_(True))
                .first()
            )
            if persona:
                return persona.display_name, persona.system_prompt
        except Exception:  # noqa: BLE001 — DB optional on hosted deploys
            pass

    fallback = FALLBACK_PROMPTS.get(persona_key) or FALLBACK_PROMPTS["girlfriend"]
    return fallback["display_name"], fallback["system_prompt"]


def generate_reply(
    db: Session | None,
    *,
    persona_key: str,
    message: str,
    history: list[dict[str, str]] | None = None,
) -> tuple[str, str]:
    settings = get_settings()
    if not settings.groq_api_key:
        raise RuntimeError(
            "GROQ_API_KEY is missing. Set it in your host environment "
            "(Render Environment Variables) to enable AI chat."
        )

    display_name, system_prompt = resolve_persona(db, persona_key)
    client = Groq(api_key=settings.groq_api_key)

    messages: list[dict[str, str]] = [
        {"role": "system", "content": f"{system_prompt}\n\n{BASE_RULES}"},
    ]

    for item in (history or [])[-12:]:
        role = item.get("role")
        content = (item.get("content") or "").strip()
        if role in {"user", "assistant"} and content:
            messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": message.strip()})

    completion = client.chat.completions.create(
        model=settings.groq_model,
        messages=messages,
        temperature=0.9,
        max_tokens=500,
    )
    reply = (completion.choices[0].message.content or "").strip()
    if not reply:
        raise RuntimeError("The AI returned an empty response. Please try again.")
    return reply, display_name
