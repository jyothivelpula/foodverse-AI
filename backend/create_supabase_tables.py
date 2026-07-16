"""Create all FoodVerse tables on Supabase.

Usage:
  1. Put your real password in backend/.env:
       SUPABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.<ref>.supabase.co:5432/postgres
     (Project Settings → Database → Connection string → URI)
  2. cd backend
     python create_supabase_tables.py

Or paste supabase_schema.sql into Supabase → SQL Editor → Run.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

_ENV = Path(__file__).resolve().parent / ".env"
load_dotenv(_ENV)

supabase = (os.getenv("SUPABASE_URL") or os.getenv("SUPABASE_DB_URL") or "").strip()
if not supabase:
    # Fall back to DATABASE_URL only if it already points at Supabase
    db = (os.getenv("DATABASE_URL") or "").strip()
    if "supabase.co" in db:
        supabase = db

if not supabase:
    print("ERROR: Set SUPABASE_URL in backend/.env")
    print(
        "  SUPABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxx.supabase.co:5432/postgres"
    )
    sys.exit(1)

if "[YOUR-PASSWORD]" in supabase or "YOUR_PASSWORD" in supabase:
    print("ERROR: Replace [YOUR-PASSWORD] with your real Supabase database password.")
    sys.exit(1)

# Force this process to use Supabase (overrides local DATABASE_URL)
os.environ["DATABASE_URL"] = supabase

from app.config import clear_settings_cache, database_host_hint, get_settings  # noqa: E402

clear_settings_cache()

from app.database import Base, engine  # noqa: E402
from app import models  # noqa: F401, E402


def main() -> None:
    settings = get_settings()
    host = database_host_hint(settings.database_url)
    print(f"Creating tables on: {host}")
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as exc:
        print(f"FAILED: {exc}")
        print("Tips: check password, enable DB, and use the Session/URI connection string.")
        sys.exit(1)
    print("Done. Tables:")
    for table in Base.metadata.sorted_tables:
        print(f"  - {table.name}")


if __name__ == "__main__":
    main()
