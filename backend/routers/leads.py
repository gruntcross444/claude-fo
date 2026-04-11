from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session
from dependencies import get_db
from models import Lead, ScheduledEmail
from emails import send_exit_discount, send_welcome_email, send_spin_wheel_prize, send_free_pdf
import re

router = APIRouter(tags=["leads"])


class LeadRequest(BaseModel):
    email: str
    source: str = ""
    prize: str = ""
    prize_code: str = ""

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', v):
            raise ValueError('Invalid email format')
        return v.lower().strip()


@router.post("/leads")
def capture_lead(body: LeadRequest, db: Session = Depends(get_db)):
    existing = db.query(Lead).filter(Lead.email == body.email).first()
    is_new = existing is None

    if is_new:
        lead = Lead(email=body.email, source=body.source)
        db.add(lead)
        db.commit()

    # Trigger emails based on source
    if body.source == "spin_wheel" and body.prize:
        send_spin_wheel_prize(body.email, body.prize, body.prize_code or "SPIN10")
    elif body.source == "exit_popup":
        send_exit_discount(body.email)
    elif body.source == "free_pdf_offer":
        send_free_pdf(body.email)

    # Schedule welcome drip for all new leads
    if is_new:
        send_welcome_email(body.email, sequence_num=1)
        now = datetime.now(timezone.utc)
        db.add(ScheduledEmail(email=body.email, email_type="welcome_2", send_after=now + timedelta(days=2)))
        db.add(ScheduledEmail(email=body.email, email_type="welcome_3", send_after=now + timedelta(days=4)))
        db.commit()

    return {"status": "ok", "message": "Lead captured" if is_new else "Already captured"}
