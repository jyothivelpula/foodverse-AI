from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_ENV_FILE = Path(__file__).resolve().parent.parent / ".env"


def normalize_database_url(url: str) -> str:
    """Render/Heroku often provide postgres:// — SQLAlchemy needs +psycopg2."""
    if url.startswith("postgres://"):
        return "postgresql+psycopg2://" + url[len("postgres://") :]
    if url.startswith("postgresql://") and "+psycopg2" not in url:
        return "postgresql+psycopg2://" + url[len("postgresql://") :]
    return url


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Database — set DATABASE_URL on Render to your hosted Postgres
    # (or leave default; chat will fall back to built-in personas if DB is down)
    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/foodverse"

    # JWT (admin auth)
    secret_key: str = "change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 12  # 12 hours

    # Groq / AI
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"

    # Cloudinary (image storage)
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    @field_validator("database_url", mode="before")
    @classmethod
    def _fix_db_url(cls, value: object) -> object:
        if isinstance(value, str) and value.strip():
            return normalize_database_url(value.strip())
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
