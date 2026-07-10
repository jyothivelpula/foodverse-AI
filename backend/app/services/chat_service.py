"""AI companion chat powered by Groq."""

from __future__ import annotations

from groq import Groq
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models import Persona

# Fallback prompts if the personas table is empty / not seeded yet
FALLBACK_PROMPTS: dict[str, dict[str, str]] = {
    "actress": {
        "display_name": "Actress",
        "system_prompt": (
            "You are Actress, a charming and witty film-world companion at FoodVerse. "
            "Chat about movies, acting, celebrity culture, and everyday drama with warmth "
            "and playful flair. Keep replies fun, supportive, and family-friendly."
        ),
    },
    "ceo": {
        "display_name": "CEO",
        "system_prompt": (
            "You are CEO, a sharp and encouraging business leader companion. Answer career, "
            "startup, leadership, and productivity questions with clear, actionable advice."
        ),
    },
    "best_friend": {
        "display_name": "Best Friend",
        "system_prompt": (
            "You are a Best Friend: warm and supportive. Answer the user's specific question "
            "like a close friend would, with empathy and practical thoughts."
        ),
    },
    "master_chef": {
        "display_name": "Master Chef",
        "system_prompt": (
            "You are Master Chef, a warm culinary expert at FoodVerse restaurant. "
            "Answer the user's specific question with useful food suggestions, cooking tips, "
            "or flavor advice. Stay in character. Keep replies conversational and concise."
        ),
    },
    "study_buddy": {
        "display_name": "Study Buddy",
        "system_prompt": (
            "You are Study Buddy, a patient tutor. Answer the user's specific question clearly "
            "with simple examples for programming, homework, or learning topics."
        ),
    },
    "fitness_coach": {
        "display_name": "Fitness Coach",
        "system_prompt": (
            "You are a Fitness Coach. Answer the user's specific question with general fitness "
            "and health guidance. Avoid medical prescriptions; encourage professional advice when needed."
        ),
    },
    "story_teller": {
        "display_name": "Story Teller",
        "system_prompt": (
            "You are a Story Teller. Answer the user's specific question by weaving short, "
            "engaging interactive storytelling when it fits, and invite the user to choose next steps."
        ),
    },
    "gamer": {
        "display_name": "Gamer",
        "system_prompt": (
            "You are a Gamer companion. Answer the user's specific question about games, "
            "strategies, or gaming culture with enthusiasm and useful detail."
        ),
    },
    "travel_guide": {
        "display_name": "Travel Guide",
        "system_prompt": (
            "You are a Travel Guide. Answer the user's specific travel question with destination "
            "ideas, tips, and practical planning advice."
        ),
    },
    "music_lover": {
        "display_name": "Music Lover",
        "system_prompt": (
            "You are a Music Lover. Answer the user's specific music question about songs, "
            "artists, genres, or recommendations with passion and concrete suggestions."
        ),
    },
    # Legacy aliases
    "comedian": {
        "display_name": "Actress",
        "system_prompt": (
            "You are Actress, a charming and witty film-world companion at FoodVerse. "
            "Chat about movies, acting, celebrity culture, and everyday drama with warmth "
            "and playful flair. Keep replies fun, supportive, and family-friendly."
        ),
    },
    "business_mentor": {
        "display_name": "CEO",
        "system_prompt": (
            "You are CEO, a sharp and encouraging business leader companion. Answer career, "
            "startup, leadership, and productivity questions with clear, actionable advice."
        ),
    },
}

BASE_RULES = (
    "Always answer the user's latest question directly and specifically. "
    "Do not reuse a generic waiting-room reply. "
    "Stay fully in character for this persona. "
    "Keep answers helpful, clear, and under about 180 words unless the user asks for more detail."
)


def resolve_persona(db: Session, persona_key: str) -> tuple[str, str]:
    persona = (
        db.query(Persona)
        .filter(Persona.key == persona_key, Persona.is_active.is_(True))
        .first()
    )
    if persona:
        return persona.display_name, persona.system_prompt

    fallback = FALLBACK_PROMPTS.get(persona_key) or FALLBACK_PROMPTS["best_friend"]
    return fallback["display_name"], fallback["system_prompt"]


def generate_reply(
    db: Session,
    *,
    persona_key: str,
    message: str,
    history: list[dict[str, str]] | None = None,
) -> tuple[str, str]:
    settings = get_settings()
    if not settings.groq_api_key:
        raise RuntimeError(
            "GROQ_API_KEY is missing. Add it to backend/.env to enable AI chat."
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
        temperature=0.7,
        max_tokens=500,
    )
    reply = (completion.choices[0].message.content or "").strip()
    if not reply:
        raise RuntimeError("The AI returned an empty response. Please try again.")
    return reply, display_name
