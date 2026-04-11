import os
import html
from fastapi import APIRouter, Depends
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session
from dependencies import get_db
from models import ContactMessage
from emails import send_email
import re

router = APIRouter(tags=["contact"])

OWNER_EMAIL = os.getenv("OWNER_EMAIL", "lieskaram@gmail.com")


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

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if len(v.strip()) < 1 or len(v) > 100:
            raise ValueError('Name must be between 1 and 100 characters')
        return v.strip()

    @field_validator('message')
    @classmethod
    def validate_message(cls, v):
        if len(v.strip()) < 1 or len(v) > 5000:
            raise ValueError('Message must be between 1 and 5000 characters')
        return v.strip()


@router.post("/contact")
def submit_contact(body: ContactRequest, db: Session = Depends(get_db)):
    msg = ContactMessage(name=body.name, email=body.email, message=body.message)
    db.add(msg)
    db.commit()

    # Notify owner (escape user input to prevent HTML injection)
    safe_name    = html.escape(body.name)
    safe_email   = html.escape(body.email)
    safe_message = html.escape(body.message)
    email_html = f"""
    <div style="background:#0a0b0f;padding:40px 20px;font-family:'Inter',system-ui,sans-serif;">
      <div style="max-width:520px;margin:0 auto;background:#13141a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px;color:#9ca3af;">
        <h2 style="color:#f3f4f6;font-size:20px;margin:0 0 16px;">New Contact Message</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:6px 0;color:#888;width:80px;">Name</td><td style="padding:6px 0;color:#f3f4f6;">{safe_name}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;color:#a5b4fc;"><a href="mailto:{safe_email}" style="color:#a5b4fc;">{safe_email}</a></td></tr>
        </table>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px;">
          <p style="margin:0;white-space:pre-wrap;color:#d1d5db;font-size:14px;line-height:1.6;">{safe_message}</p>
        </div>
      </div>
    </div>
    """
    send_email(OWNER_EMAIL, f"Contact: {safe_name} — claudefo.com", email_html)

    return {"status": "ok", "message": "Message received"}
