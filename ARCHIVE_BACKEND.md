### `backend/main.py`

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database import engine, Base
from routers import auth as auth_router
from routers import contact as contact_router
from routers import payments as payments_router
from routers import leads as leads_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://claude-fo.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(contact_router.router)
app.include_router(payments_router.router)
app.include_router(leads_router.router)


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}
```

### `backend/database.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
```

### `backend/models.py`

```python
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    discord_id = Column(String, nullable=True)
    google_id = Column(String, nullable=True)
    facebook_id = Column(String, nullable=True)
    apple_id = Column(String, nullable=True)
    telegram_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    source = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### `backend/schemas.py`

```python
from pydantic import BaseModel, field_validator
from typing import Optional, Dict, Any
import re


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', v):
            raise ValueError('Invalid email format')
        return v.lower().strip()

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        return v.lower().strip()


class OAuthCodeRequest(BaseModel):
    code: str


class TelegramAuthRequest(BaseModel):
    id: int
    first_name: str = ""
    last_name: str = ""
    username: str = ""
    photo_url: str = ""
    auth_date: int
    hash: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True
```

### `backend/auth.py`

```python
import os
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "changeme_use_a_long_random_string")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_DAYS = 7


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_access_token(user_id: int, email: str) -> str:
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=JWT_EXPIRY_DAYS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
```

### `backend/dependencies.py`

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlalchemy.orm import Session
from database import SessionLocal
from auth import decode_token
import models

bearer_scheme = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    token = credentials.credentials
    try:
        payload = decode_token(token)
        user_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user
```

### `backend/routers/__init__.py`

```python
```

### `backend/routers/auth.py`

```python
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
```

### `backend/routers/contact.py`

```python
from fastapi import APIRouter, Depends
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session
from dependencies import get_db
from models import ContactMessage
import re

router = APIRouter(tags=["contact"])


class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', v):
            raise ValueError('Invalid email format')
        return v.lower().strip()


@router.post("/contact")
def submit_contact(body: ContactRequest, db: Session = Depends(get_db)):
    msg = ContactMessage(name=body.name, email=body.email, message=body.message)
    db.add(msg)
    db.commit()
    return {"status": "ok", "message": "Message received"}
```

### `backend/routers/payments.py`

```python
import os
import logging
import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(tags=["payments"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Product catalog — prices in cents
PRODUCTS = {
    "finance-tracker": {"name": "Monthly Finance Tracker", "price": 1900},
    "social-media-kit": {"name": "Social Media Kit", "price": 2900},
    "website-templates": {"name": "Website Templates Pack", "price": 3900},
    "real-estate-template": {"name": "Real Estate Landing Template", "price": 2400},
    "content-calendar": {"name": "Content Calendar Planner", "price": 1400},
    "lead-funnel-template": {"name": "Lead Funnel Blueprint", "price": 3400},
    "email-sms-playbook": {"name": "Email & SMS Playbook", "price": 2400},
    "automation-starter-kit": {"name": "Automation Starter Kit", "price": 1900},
    "prompts-real-estate": {"name": "Real Estate Prompt Pack", "price": 1400},
    "prompts-marketing": {"name": "Marketing & Sales Prompts", "price": 1900},
    "prompts-business": {"name": "Business & Productivity Pack", "price": 1400},
    "prompts-content": {"name": "Content Creator Toolkit", "price": 1900},
}


class CheckoutRequest(BaseModel):
    product_id: str


@router.post("/checkout")
def create_checkout(body: CheckoutRequest):
    product = PRODUCTS.get(body.product_id)
    if not product:
        raise HTTPException(status_code=400, detail="Product not found")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": product["name"]},
                    "unit_amount": product["price"],
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=f"{FRONTEND_URL}/download?product={body.product_id}",
            cancel_url=f"{FRONTEND_URL}/store?canceled=true",
        )
        return {"url": session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        customer_email = session.get("customer_details", {}).get("email", "unknown")
        success_url = session.get("success_url", "")
        product_id = success_url.split("product=")[-1] if "product=" in success_url else "unknown"
        logger.info(f"Payment confirmed for {customer_email} - {product_id}")

    return {"status": "ok"}
```

### `backend/routers/leads.py`

```python
from fastapi import APIRouter, Depends
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session
from dependencies import get_db
from models import Lead
import re

router = APIRouter(tags=["leads"])


class LeadRequest(BaseModel):
    email: str
    source: str = ""

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', v):
            raise ValueError('Invalid email format')
        return v.lower().strip()


@router.post("/leads")
def capture_lead(body: LeadRequest, db: Session = Depends(get_db)):
    existing = db.query(Lead).filter(Lead.email == body.email).first()
    if existing:
        return {"status": "ok", "message": "Already captured"}
    lead = Lead(email=body.email, source=body.source)
    db.add(lead)
    db.commit()
    return {"status": "ok", "message": "Lead captured"}
```

### `backend/requirements.txt`

```text
fastapi
uvicorn[standard]
sqlalchemy
python-jose[cryptography]
passlib[bcrypt]
bcrypt==4.0.1
python-dotenv
httpx
stripe
```
