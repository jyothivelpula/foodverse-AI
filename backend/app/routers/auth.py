"""JWT auth: register, login, me, OTP password reset."""

from __future__ import annotations

import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.core.security import (
    create_access_token,
    create_password_reset_token,
    decode_password_reset_token,
    hash_password,
    pwd_context,
    verify_password,
)
from app.database import get_db
from app.models.enums import UserRole
from app.models.password_reset_otp import PasswordResetOtp
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResendOtpRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserOut,
    VerifyOtpRequest,
    VerifyOtpResponse,
)
from app.services.email_service import send_password_reset_otp_email

router = APIRouter(prefix="/auth", tags=["auth"])

OTP_TTL_MINUTES = 5
MAX_VERIFY_ATTEMPTS = 5
MAX_RESENDS = 5
RESEND_COOLDOWN_SECONDS = 60

_DB_DOWN = (
    "Database unavailable. On Render, set DATABASE_URL to your Supabase "
    "(or Render Postgres) connection URI, ensure tables/users exist, then redeploy. "
    "Check /health → db_error for details."
)


def _db_http_error(exc: Exception) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail=_DB_DOWN,
    )


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _generate_otp() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def _hash_otp(otp: str) -> str:
    return pwd_context.hash(otp)


def _verify_otp(otp: str, otp_hash: str) -> bool:
    try:
        return pwd_context.verify(otp, otp_hash)
    except Exception:  # noqa: BLE001
        return False


def _invalidate_otps(db: Session, email: str) -> None:
    db.query(PasswordResetOtp).filter(PasswordResetOtp.email == email).delete(
        synchronize_session=False
    )


def _create_and_send_otp(
    db: Session, *, email: str, resend_count: int = 0
) -> tuple[PasswordResetOtp, str, str]:
    """Returns (row, delivery, otp_plaintext). otp_plaintext is for console/dev only."""
    otp = _generate_otp()
    row = PasswordResetOtp(
        email=email,
        otp_hash=_hash_otp(otp),
        expires_at=_utcnow() + timedelta(minutes=OTP_TTL_MINUTES),
        attempts=0,
        resend_count=resend_count,
        verified=False,
    )
    db.add(row)
    db.commit()
    db.refresh(row)

    try:
        delivery = send_password_reset_otp_email(to_email=email, otp=otp)
    except RuntimeError as exc:
        _invalidate_otps(db, email)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc

    return row, delivery, otp


def _latest_otp(db: Session, email: str) -> PasswordResetOtp | None:
    return (
        db.query(PasswordResetOtp)
        .filter(PasswordResetOtp.email == email)
        .order_by(PasswordResetOtp.created_at.desc())
        .first()
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    if payload.role not in {UserRole.CUSTOMER, UserRole.CHEF}:
        raise HTTPException(status_code=400, detail="Role must be customer or chef")

    email = payload.email.lower().strip()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        user = User(
            name=payload.name.strip(),
            email=email,
            hashed_password=hash_password(payload.password),
            role=payload.role.value,
            phone=(payload.phone or None),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    except HTTPException:
        raise
    except (OperationalError, SQLAlchemyError) as exc:
        db.rollback()
        raise _db_http_error(exc) from exc

    token = create_access_token(
        subject=str(user.id),
        email=user.email,
        role=user.role,
        name=user.name,
    )
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    email = payload.email.lower().strip()
    try:
        user = db.query(User).filter(User.email == email).first()
    except (OperationalError, SQLAlchemyError) as exc:
        raise _db_http_error(exc) from exc

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(
        subject=str(user.id),
        email=user.email,
        role=user.role,
        name=user.name,
    )
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(
    payload: ForgotPasswordRequest, db: Session = Depends(get_db)
) -> ForgotPasswordResponse:
    email = payload.email.lower().strip()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email not found. Please check the address or create an account.",
            )
        _invalidate_otps(db, email)
        _, delivery, otp_plain = _create_and_send_otp(db, email=email, resend_count=0)
    except HTTPException:
        raise
    except (OperationalError, SQLAlchemyError) as exc:
        db.rollback()
        raise _db_http_error(exc) from exc

    if delivery == "console":
        message = (
            "Email is not configured yet. Your OTP is shown on the next screen "
            "(local/dev mode)."
        )
    else:
        message = "A 6-digit OTP has been sent to your email."

    return ForgotPasswordResponse(
        message=message,
        expires_in=OTP_TTL_MINUTES * 60,
        delivery=delivery,
        dev_otp=otp_plain if delivery == "console" else None,
    )


@router.post("/resend-otp", response_model=ForgotPasswordResponse)
def resend_otp(payload: ResendOtpRequest, db: Session = Depends(get_db)) -> ForgotPasswordResponse:
    email = payload.email.lower().strip()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email not found. Please check the address or create an account.",
            )

        latest = _latest_otp(db, email)
        resend_count = (latest.resend_count + 1) if latest else 1
        if latest and resend_count > MAX_RESENDS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many OTP requests. Please try again later.",
            )

        if latest:
            created = latest.created_at
            if created.tzinfo is None:
                created = created.replace(tzinfo=timezone.utc)
            elapsed = (_utcnow() - created).total_seconds()
            if elapsed < RESEND_COOLDOWN_SECONDS:
                wait = int(RESEND_COOLDOWN_SECONDS - elapsed)
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Please wait {wait}s before requesting another OTP.",
                )

        _invalidate_otps(db, email)
        _, delivery, otp_plain = _create_and_send_otp(
            db, email=email, resend_count=resend_count
        )
    except HTTPException:
        raise
    except (OperationalError, SQLAlchemyError) as exc:
        db.rollback()
        raise _db_http_error(exc) from exc

    if delivery == "console":
        message = (
            "Email is not configured yet. Your new OTP is shown below (local/dev mode)."
        )
    else:
        message = "A new OTP has been sent to your email."

    return ForgotPasswordResponse(
        message=message,
        expires_in=OTP_TTL_MINUTES * 60,
        delivery=delivery,
        dev_otp=otp_plain if delivery == "console" else None,
    )


@router.post("/verify-otp", response_model=VerifyOtpResponse)
def verify_otp(payload: VerifyOtpRequest, db: Session = Depends(get_db)) -> VerifyOtpResponse:
    email = payload.email.lower().strip()
    otp = payload.otp.strip()

    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email not found.",
            )

        row = _latest_otp(db, email)
        if not row:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No OTP found. Please request a new code.",
            )

        expires = row.expires_at
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        if _utcnow() > expires:
            db.delete(row)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP has expired. Please request a new code.",
            )

        if row.attempts >= MAX_VERIFY_ATTEMPTS:
            db.delete(row)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many incorrect attempts. Please request a new OTP.",
            )

        if not _verify_otp(otp, row.otp_hash):
            row.attempts += 1
            db.commit()
            remaining = MAX_VERIFY_ATTEMPTS - row.attempts
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid OTP. {remaining} attempt(s) remaining.",
            )

        # One-time use: delete OTP after successful verification
        db.delete(row)
        db.commit()
    except HTTPException:
        raise
    except (OperationalError, SQLAlchemyError) as exc:
        db.rollback()
        raise _db_http_error(exc) from exc

    reset_token = create_password_reset_token(subject=str(user.id), email=user.email)
    return VerifyOtpResponse(
        message="OTP verified successfully.",
        reset_token=reset_token,
    )


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(
    payload: ResetPasswordRequest, db: Session = Depends(get_db)
) -> MessageResponse:
    try:
        data = decode_password_reset_token(payload.token.strip())
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    try:
        user = db.query(User).filter(User.id == int(data["sub"])).first()
    except (OperationalError, SQLAlchemyError) as exc:
        raise _db_http_error(exc) from exc

    if not user or user.email.lower() != str(data["email"]).lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset session. Please start again.",
        )

    try:
        user.hashed_password = hash_password(payload.new_password)
        db.commit()
    except (OperationalError, SQLAlchemyError) as exc:
        db.rollback()
        raise _db_http_error(exc) from exc

    return MessageResponse(message="Your password has been updated successfully.")


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(user)
