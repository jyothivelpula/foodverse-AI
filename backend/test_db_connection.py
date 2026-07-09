"""Quick check that PostgreSQL accepts the credentials in .env.

Usage:
    cd backend
    python test_db_connection.py
"""

from sqlalchemy import text

from app.config import get_settings
from app.database import engine


def main() -> None:
    settings = get_settings()
    print(f"Connecting to: {engine.url}")
    print(f".env loaded: password length = {len(str(engine.url.password or ''))}")

    try:
        with engine.connect() as conn:
            version = conn.execute(text("SELECT version()")).scalar()
            db_name = conn.execute(text("SELECT current_database()")).scalar()
            user = conn.execute(text("SELECT current_user")).scalar()
        print("OK — connected successfully")
        print(f"  database: {db_name}")
        print(f"  user:     {user}")
        print(f"  version:  {version}")
    except Exception as exc:
        print("FAILED — could not connect")
        print(f"  {type(exc).__name__}: {exc}")
        print()
        print("Tips:")
        print("  1. Confirm PostgreSQL is running")
        print("  2. Update DATABASE_URL password in backend/.env")
        print("  3. Create the database if missing: CREATE DATABASE foodverse;")
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
