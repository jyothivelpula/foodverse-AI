"""Seed demo customer and chef accounts.

Usage:
    cd backend
    python seed_users.py
"""

from app.core.security import hash_password
from app.database import SessionLocal, engine, Base
from app import models  # noqa: F401
from app.models.enums import UserRole
from app.models.user import User

DEMOS = [
    {
        "name": "Demo Customer",
        "email": "customer@foodverse.com",
        "password": "password123",
        "role": UserRole.CUSTOMER.value,
        "phone": "9000000001",
    },
    {
        "name": "Demo Chef",
        "email": "chef@foodverse.com",
        "password": "password123",
        "role": UserRole.CHEF.value,
        "phone": "9000000002",
    },
]


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for demo in DEMOS:
            existing = db.query(User).filter(User.email == demo["email"]).first()
            if existing:
                print(f"  skip (exists): {demo['email']} [{demo['role']}]")
                continue
            user = User(
                name=demo["name"],
                email=demo["email"],
                hashed_password=hash_password(demo["password"]),
                role=demo["role"],
                phone=demo["phone"],
            )
            db.add(user)
            print(f"  created: {demo['email']} / {demo['password']} [{demo['role']}]")
        db.commit()
        print("Done.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
