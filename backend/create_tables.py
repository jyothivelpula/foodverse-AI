"""Run this once to create all tables in the configured PostgreSQL database.

Usage:
    cd backend
    python create_tables.py
"""

from app.database import Base, engine
from app import models  # noqa: F401  (import so all models register with Base.metadata)


def main():
    print(f"Creating tables on: {engine.url}")
    Base.metadata.create_all(bind=engine)
    print("Done. Tables created:")
    for table in Base.metadata.sorted_tables:
        print(f"  - {table.name}")


if __name__ == "__main__":
    main()