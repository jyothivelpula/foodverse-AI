"""SMTP email helper for FoodVerse AI (OTP, etc.)."""

from __future__ import annotations

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import get_settings

logger = logging.getLogger(__name__)


def smtp_configured() -> bool:
    s = get_settings()
    return bool(s.smtp_host and s.smtp_user and s.smtp_password and s.smtp_from)


def send_password_reset_otp_email(*, to_email: str, otp: str) -> str:
    """Send a branded 6-digit OTP email.

    Returns:
        \"smtp\" if emailed, \"console\" if printed to server logs (dev fallback).
    Raises RuntimeError on failure.
    """
    settings = get_settings()
    if not smtp_configured():
        logger.warning(
            "SMTP not configured — OTP for %s is %s (console/dev fallback)",
            to_email,
            otp,
        )
        print(f"[FoodVerse OTP] {to_email} → {otp}", flush=True)
        return "console"


    subject = "Password Reset OTP"
    text_body = (
        f"Your FoodVerse AI password reset code is: {otp}\n\n"
        f"This code expires in 5 minutes. If you did not request this, ignore this email.\n"
    )
    html_body = f"""\
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FFF9F3;font-family:Segoe UI,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FFF9F3;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:480px;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #EBE4D8;">
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <div style="width:48px;height:48px;border-radius:999px;background:#FF5A1F;color:#fff;line-height:48px;font-size:22px;">🍽</div>
              <h1 style="margin:16px 0 4px;font-size:24px;color:#161411;">FoodVerse AI</h1>
              <p style="margin:0;color:#6B645C;font-size:14px;">Password reset verification</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:8px;color:#161411;font-size:15px;line-height:1.5;">
              Use this one-time code to reset your password:
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 0;">
              <div style="display:inline-block;letter-spacing:8px;font-size:32px;font-weight:700;color:#FF5A1F;background:#FFF7ED;border-radius:16px;padding:16px 24px;">
                {otp}
              </div>
            </td>
          </tr>
          <tr>
            <td style="color:#6B645C;font-size:13px;line-height:1.5;">
              This code expires in <strong>5 minutes</strong>. Do not share it with anyone.
              If you didn&apos;t request a reset, you can safely ignore this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.smtp_from
    msg["To"] = to_email
    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
            server.ehlo()
            if settings.smtp_use_tls:
                server.starttls()
                server.ehlo()
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.smtp_from, [to_email], msg.as_string())
    except Exception as exc:  # noqa: BLE001
        logger.exception("Failed to send OTP email to %s", to_email)
        raise RuntimeError("Failed to send email. Please try again later.") from exc
    return "smtp"
