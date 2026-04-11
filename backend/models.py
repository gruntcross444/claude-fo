from datetime import datetime, timezone
from sqlalchemy import Column, Integer, BigInteger, String, Text, DateTime, Index
from database import Base


def _utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    discord_id = Column(String, nullable=True)
    google_id = Column(String, nullable=True)
    telegram_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=_utcnow)


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    source = Column(String, nullable=True)
    created_at = Column(DateTime, default=_utcnow)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=_utcnow)


class ScheduledEmail(Base):
    __tablename__ = "scheduled_emails"
    __table_args__ = (
        Index("ix_scheduled_pending", "sent", "send_after"),
    )

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, index=True)
    email_type = Column(String, nullable=False)  # e.g. "welcome_2", "welcome_3"
    send_after = Column(DateTime, nullable=False)
    sent = Column(Integer, default=0)  # 0 = pending, 1 = sent
    created_at = Column(DateTime, default=_utcnow)


class RentalApplication(Base):
    __tablename__ = "rental_applications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=True)
    building_id = Column(String, nullable=False)
    building_name = Column(String, nullable=False)
    wizard_data = Column(Text, nullable=True)  # JSON with SSN redacted
    stripe_session_id = Column(String, nullable=True)
    stripe_payment_intent = Column(String, nullable=True)
    amount_cents = Column(Integer, default=20000)
    status = Column(String, default="pending_payment")  # pending_payment, paid, under_review, approved, denied
    created_at = Column(DateTime, default=_utcnow)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    product_id = Column(String, nullable=False)
    stripe_session_id = Column(String, nullable=True)
    stripe_payment_intent = Column(String, nullable=True)
    amount_cents = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=_utcnow)


class TgUser(Base):
    __tablename__ = "tg_users"

    id            = Column(Integer, primary_key=True, index=True)
    telegram_id   = Column(BigInteger, unique=True, index=True, nullable=False)
    username      = Column(String, nullable=True)
    first_name    = Column(String, nullable=True)
    balance_cents = Column(Integer, default=0, nullable=False)
    created_at    = Column(DateTime, default=_utcnow)


class TgPurchase(Base):
    __tablename__ = "tg_purchases"

    id             = Column(Integer, primary_key=True, index=True)
    telegram_id    = Column(BigInteger, index=True, nullable=False)
    product_id     = Column(String, nullable=False)
    amount_cents   = Column(Integer, nullable=False)
    payment_method = Column(String, nullable=False)  # "btc","usdt","ltc","trx","balance"
    order_id       = Column(String, nullable=True)
    created_at     = Column(DateTime, default=_utcnow)


class TgTopup(Base):
    __tablename__ = "tg_topups"

    id            = Column(Integer, primary_key=True, index=True)
    telegram_id   = Column(BigInteger, index=True, nullable=False)
    order_id      = Column(String, unique=True, index=True, nullable=False)
    amount_cents  = Column(Integer, nullable=False)
    currency      = Column(String, nullable=False)
    status        = Column(String, default="pending")  # "pending","credited"
    created_at    = Column(DateTime, default=_utcnow)


class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True, index=True)
    buyer_name = Column(String, nullable=False)
    buyer_email = Column(String, nullable=False, index=True)
    property_name = Column(String, nullable=False)
    property_type = Column(String, nullable=False)
    stage = Column(String, default="prospectando", index=True)
    source = Column(String, nullable=False, index=True)
    deal_value = Column(Integer, nullable=False)  # in cents
    days_to_close = Column(Integer, nullable=True)
    conversion = Column(Integer, default=0, index=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=_utcnow, index=True)
    updated_at = Column(DateTime, default=_utcnow)
