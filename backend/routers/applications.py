"""Rental application endpoint. Saves application data before Stripe checkout."""

import json
import re
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session
from dependencies import get_db
from models import RentalApplication

router = APIRouter(tags=["applications"])


class ApplicationRequest(BaseModel):
    name: str
    email: str
    phone: str = ""
    building_id: str
    building_name: str
    wizard_data: str  # JSON string — SSN will be redacted before saving

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', v):
            raise ValueError('Invalid email format')
        return v.lower().strip()

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if len(v.strip()) < 1 or len(v) > 200:
            raise ValueError('Name must be between 1 and 200 characters')
        return v.strip()


def _redact_ssn(wizard_data_str: str) -> str:
    """Redact SSN from wizard data JSON, keeping only last 4 digits."""
    try:
        data = json.loads(wizard_data_str)
        ssn = data.get('ssn', '')
        if ssn and len(ssn) >= 4:
            data['ssn'] = f"***-**-{ssn[-4:]}"
        elif ssn:
            data['ssn'] = '***-**-****'
        return json.dumps(data)
    except (json.JSONDecodeError, TypeError):
        return wizard_data_str


@router.post("/rental-applications")
def create_application(body: ApplicationRequest, db: Session = Depends(get_db)):
    redacted_data = _redact_ssn(body.wizard_data)

    app = RentalApplication(
        name=body.name,
        email=body.email,
        phone=body.phone,
        building_id=body.building_id,
        building_name=body.building_name,
        wizard_data=redacted_data,
        status="pending_payment",
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    return {"id": app.id, "status": app.status}
