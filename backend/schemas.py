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
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Za-z]', v):
            raise ValueError('Password must contain at least one letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
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



class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True
