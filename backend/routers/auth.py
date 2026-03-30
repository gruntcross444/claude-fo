import os
import json
import base64
import hashlib
import hmac
import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from auth import hash_password, verify_password, create_access_token
from schemas import RegisterRequest, LoginRequest, OAuthCodeRequest, TelegramAuthRequest, TokenResponse, UserResponse
import models

router = APIRouter(prefix="/auth", tags=["auth"])

# Discord
DISCORD_CLIENT_ID = os.getenv("DISCORD_CLIENT_ID", "")
DISCORD_CLIENT_SECRET = os.getenv("DISCORD_CLIENT_SECRET", "")
DISCORD_REDIRECT_URI = os.getenv("DISCORD_REDIRECT_URI", "http://localhost:5173/auth/discord/callback")

# Google
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:5173/auth/google/callback")

# Facebook
FACEBOOK_APP_ID = os.getenv("FACEBOOK_APP_ID", "")
FACEBOOK_APP_SECRET = os.getenv("FACEBOOK_APP_SECRET", "")
FACEBOOK_REDIRECT_URI = os.getenv("FACEBOOK_REDIRECT_URI", "http://localhost:5173/auth/facebook/callback")

# Apple
APPLE_CLIENT_ID = os.getenv("APPLE_CLIENT_ID", "")
APPLE_TEAM_ID = os.getenv("APPLE_TEAM_ID", "")
APPLE_KEY_ID = os.getenv("APPLE_KEY_ID", "")
APPLE_REDIRECT_URI = os.getenv("APPLE_REDIRECT_URI", "http://localhost:5173/auth/apple/callback")

# Telegram
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")


def _find_or_create_user(db: Session, email: str, name: str, **id_fields) -> models.User:
    """Find user by email or create a new one."""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = models.User(name=name, email=email, **id_fields)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


# ── Email/Password ──────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        name=body.name,
        email=body.email,
        hashed_password=hash_password(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(access_token=create_access_token(user.id, user.email))


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email).first()
    if not user or not user.hashed_password or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenResponse(access_token=create_access_token(user.id, user.email))


# ── Discord ─────────────────────────────────────────────────────

@router.post("/discord", response_model=TokenResponse)
def discord_auth(body: OAuthCodeRequest, db: Session = Depends(get_db)):
    with httpx.Client() as client:
        token_resp = client.post(
            "https://discord.com/api/oauth2/token",
            data={
                "client_id": DISCORD_CLIENT_ID,
                "client_secret": DISCORD_CLIENT_SECRET,
                "grant_type": "authorization_code",
                "code": body.code,
                "redirect_uri": DISCORD_REDIRECT_URI,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
    if token_resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Discord authorization failed")

    access_token = token_resp.json().get("access_token")

    with httpx.Client() as client:
        user_resp = client.get(
            "https://discord.com/api/users/@me",
            headers={"Authorization": f"Bearer {access_token}"},
        )
    if user_resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Failed to fetch Discord profile")

    data = user_resp.json()
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Discord account has no email")
    name = data.get("global_name") or data.get("username", "Discord User")

    user = _find_or_create_user(db, email, name, discord_id=data["id"])
    return TokenResponse(access_token=create_access_token(user.id, user.email))


# ── Google ──────────────────────────────────────────────────────

@router.post("/google", response_model=TokenResponse)
def google_auth(body: OAuthCodeRequest, db: Session = Depends(get_db)):
    with httpx.Client() as client:
        token_resp = client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "code": body.code,
                "grant_type": "authorization_code",
                "redirect_uri": GOOGLE_REDIRECT_URI,
            },
        )
    if token_resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Google authorization failed")

    access_token = token_resp.json().get("access_token")

    with httpx.Client() as client:
        user_resp = client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
    if user_resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Failed to fetch Google profile")

    data = user_resp.json()
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")
    name = data.get("name", email)

    user = _find_or_create_user(db, email, name, google_id=data.get("id"))
    return TokenResponse(access_token=create_access_token(user.id, user.email))


# ── Facebook ────────────────────────────────────────────────────

@router.post("/facebook", response_model=TokenResponse)
def facebook_auth(body: OAuthCodeRequest, db: Session = Depends(get_db)):
    with httpx.Client() as client:
        token_resp = client.get(
            "https://graph.facebook.com/v19.0/oauth/access_token",
            params={
                "client_id": FACEBOOK_APP_ID,
                "client_secret": FACEBOOK_APP_SECRET,
                "redirect_uri": FACEBOOK_REDIRECT_URI,
                "code": body.code,
            },
        )
    if token_resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Facebook authorization failed")

    access_token = token_resp.json().get("access_token")

    with httpx.Client() as client:
        user_resp = client.get(
            "https://graph.facebook.com/me",
            params={"fields": "id,name,email", "access_token": access_token},
        )
    if user_resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Failed to fetch Facebook profile")

    data = user_resp.json()
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Facebook account has no email. Grant email permission.")
    name = data.get("name", email)

    user = _find_or_create_user(db, email, name, facebook_id=data.get("id"))
    return TokenResponse(access_token=create_access_token(user.id, user.email))


# ── Apple (Sign in with Apple) ──────────────────────────────────

@router.post("/apple", response_model=TokenResponse)
def apple_auth(body: OAuthCodeRequest, db: Session = Depends(get_db)):
    with httpx.Client() as client:
        token_resp = client.post(
            "https://appleid.apple.com/auth/token",
            data={
                "client_id": APPLE_CLIENT_ID,
                "client_secret": "",  # TODO: Generate a JWT signed with your Apple private key — see https://developer.apple.com/documentation/sign_in_with_apple
                "code": body.code,
                "grant_type": "authorization_code",
                "redirect_uri": APPLE_REDIRECT_URI,
            },
        )
    if token_resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Apple authorization failed")

    # Apple returns an id_token (JWT) — decode payload to get user info
    id_token = token_resp.json().get("id_token", "")
    try:
        payload_b64 = id_token.split(".")[1]
        payload_b64 += "=" * (4 - len(payload_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64))
    except Exception:
        raise HTTPException(status_code=401, detail="Failed to decode Apple token")

    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Apple account has no email")
    apple_sub = payload.get("sub", "")

    user = _find_or_create_user(db, email, email.split("@")[0], apple_id=apple_sub)
    return TokenResponse(access_token=create_access_token(user.id, user.email))


# ── Telegram ────────────────────────────────────────────────────

@router.post("/telegram", response_model=TokenResponse)
def telegram_auth(body: TelegramAuthRequest, db: Session = Depends(get_db)):
    # Verify the hash using the bot token
    data = body.model_dump(exclude={"hash"})
    data_filtered = {k: v for k, v in data.items() if v != "" and v is not None}

    secret_key = hashlib.sha256(TELEGRAM_BOT_TOKEN.encode()).digest()
    check_string = "\n".join(f"{k}={v}" for k, v in sorted(data_filtered.items()))
    computed_hash = hmac.new(secret_key, check_string.encode(), hashlib.sha256).hexdigest()

    if computed_hash != body.hash:
        raise HTTPException(status_code=401, detail="Telegram data verification failed")

    name = f"{body.first_name} {body.last_name}".strip() or body.username
    email = f"tg_{body.id}@telegram.user"

    user = _find_or_create_user(db, email, name, telegram_id=str(body.id))
    return TokenResponse(access_token=create_access_token(user.id, user.email))


# ── Profile ─────────────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user
