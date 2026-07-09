"""Create the foodverse database if it does not exist."""

from sqlalchemy import create_engine, text

from app.config import get_settings


def main() -> None:
    url = get_settings().database_url
    admin_url = url.rsplit("/", 1)[0] + "/postgres"
    engine = create_engine(admin_url, isolation_level="AUTOCOMMIT")
    with engine.connect() as conn:
        exists = conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname = 'foodverse'")
        ).scalar()
        if exists:
            print("Database foodverse already exists")
        else:
            conn.execute(text("CREATE DATABASE foodverse"))
            print("Created database foodverse")


if __name__ == "__main__":
    main()
