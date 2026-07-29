"""Quick SMTP check — run: python test_smtp.py

Requires SMTP_* in backend/.env (Gmail App Password recommended).
"""

from __future__ import annotations

import sys

from app.config import clear_settings_cache, get_settings
from app.services.email_service import send_password_reset_otp_email, smtp_configured


def main() -> int:
    clear_settings_cache()
    settings = get_settings()
    print(f"SMTP host: {settings.smtp_host}:{settings.smtp_port}")
    print(f"SMTP user: {settings.smtp_user or '(empty)'}")
    print(f"SMTP from: {settings.smtp_from or '(empty)'}")
    print(f"SMTP password set: {bool(settings.smtp_password)}")
    print(f"Configured: {smtp_configured()}")

    if not smtp_configured():
        print(
            "\nMissing SMTP settings. In backend/.env set:\n"
            "  SMTP_HOST=smtp.gmail.com\n"
            "  SMTP_PORT=587\n"
            "  SMTP_USER=your@gmail.com\n"
            "  SMTP_PASSWORD=your-16-char-app-password\n"
            "  SMTP_FROM=FoodVerse AI <your@gmail.com>\n"
            "\nCreate an App Password at: https://myaccount.google.com/apppasswords"
        )
        return 1

    to = settings.smtp_user
    print(f"\nSending test OTP email to {to} …")
    try:
        delivery = send_password_reset_otp_email(to_email=to, otp="123456")
        print(f"OK — delivery={delivery}. Check inbox (and Spam) for subject: Password Reset OTP")
        return 0
    except Exception as exc:  # noqa: BLE001
        print(f"FAILED: {exc}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
