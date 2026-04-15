import os
import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from auth import hash_password, verify_password, create_access_token
from schemas import RegisterRequest, LoginRequest, OAuthCodeRequest, TokenResponse, UserResponse
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
    # Prefer the redirect_uri the frontend used so it matches exactly; fall
    # back to the env var for backwards compat.
    redirect_uri = body.redirect_uri or DISCORD_REDIRECT_URI
    with httpx.Client() as client:
        token_resp = client.post(
            "https://discord.com/api/oauth2/token",
            data={
                "client_id": DISCORD_CLIENT_ID,
                "client_secret": DISCORD_CLIENT_SECRET,
                "grant_type": "authorization_code",
                "code": body.code,
                "redirect_uri": redirect_uri,
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
    # Use the exact redirect_uri the frontend sent — it must match the one
    # Google received in the initial /o/oauth2/v2/auth call, otherwise the
    # token exchange fails with redirect_uri_mismatch.
    redirect_uri = body.redirect_uri or GOOGLE_REDIRECT_URI
    with httpx.Client() as client:
        token_resp = client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "code": body.code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri,
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


# ── Profile ─────────────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user
