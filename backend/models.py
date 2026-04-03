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


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    product_id = Column(String, nullable=False)
    stripe_session_id = Column(String, nullable=True)
    stripe_payment_intent = Column(String, nullable=True)
    amount_cents = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
