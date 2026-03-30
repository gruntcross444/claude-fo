import os
import stripe
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(tags=["payments"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
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
            success_url=f"{FRONTEND_URL}/store?success=true",
            cancel_url=f"{FRONTEND_URL}/store?canceled=true",
        )
        return {"url": session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=500, detail=str(e))
