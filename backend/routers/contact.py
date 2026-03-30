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
