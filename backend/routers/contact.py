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
    return {"status": "ok", "message": "Message received"}
