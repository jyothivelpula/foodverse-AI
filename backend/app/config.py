from functools import lru_cache
import os
from pathlib import Path
from urllib.parse import urlparse, urlunparse

from pydantic import AliasChoices, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_ENV_FILE = Path(__file__).resolve().parent.parent / ".env"

# Render sets RENDER=true — never prefer a bundled local .env over dashboard env vars
_ON_RENDER = bool(os.getenv("RENDER") or os.getenv("RENDER_SERVICE_ID"))


def normalize_database_url(url: str) -> str:
    """Render/Heroku often provide postgres:// — SQLAlchemy needs +psycopg2."""
    url = url.strip().strip('"').strip("'")
    if url.startswith("postgres://"):
        url = "postgresql+psycopg2://" + url[len("postgres://") :]
    elif url.startswith("postgresql://") and "+psycopg2" not in url:
        url = "postgresql+psycopg2://" + url[len("postgresql://") :]

    # External Render Postgres requires TLS
    try:
        # Strip driver for parse: postgresql+psycopg2:// → postgresql://
        parseable = url.replace("postgresql+psycopg2://", "postgresql://", 1)
        parsed = urlparse(parseable)
        host = (parsed.hostname or "").lower()
    except Exception:
        host = ""

    if ("render.com" in host or _ON_RENDER) and "sslmode=" not in url:
        sep = "&" if "?" in url else "?"
        url = f"{url}{sep}sslmode=require"
    return url


def database_host_hint(url: str) -> str:
    """Safe host:dbname for /health (no credentials)."""
    try:
        parseable = url.replace("postgresql+psycopg2://", "postgresql://", 1)
        parsed = urlparse(parseable)
        db = (parsed.path or "/").lstrip("/") or "?"
        return f"{parsed.hostname or '?'}/{db}"
    except Exception:
        return "unparseable"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # On Render, ignore local .env so dashboard DATABASE_URL always wins
        env_file=None if _ON_RENDER else _ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
        # Environment variables always override env_file when both exist
        env_ignore_empty=True,
    )

    # Accept DATABASE_URL (Render) or database_url
    database_url: str = Field(
        default="postgresql+psycopg2://postgres:postgres@localhost:5432/foodverse",
        validation_alias=AliasChoices("DATABASE_URL", "database_url"),
    )

    secret_key: str = Field(
        default="change-this-in-production",
        validation_alias=AliasChoices("SECRET_KEY", "secret_key"),
    )
    algorithm: str = "HS256"
    access_token_expire_minutes: int = Field(
        default=60 * 12,
        validation_alias=AliasChoices(
            "ACCESS_TOKEN_EXPIRE_MINUTES", "access_token_expire_minutes"
        ),
    )

    groq_api_key: str = Field(
        default="",
        validation_alias=AliasChoices("GROQ_API_KEY", "groq_api_key"),
    )
    groq_model: str = Field(
        default="llama-3.3-70b-versatile",
        validation_alias=AliasChoices("GROQ_MODEL", "groq_model"),
    )

    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    @field_validator("database_url", mode="before")
    @classmethod
    def _fix_db_url(cls, value: object) -> object:
        if isinstance(value, str) and value.strip():
            return normalize_database_url(value)
        return value

    @field_validator("groq_api_key", mode="before")
    @classmethod
    def _strip_groq_key(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip().strip('"').strip("'")
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


def clear_settings_cache() -> None:
    get_settings.cache_clear()
