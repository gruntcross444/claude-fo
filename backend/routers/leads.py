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
