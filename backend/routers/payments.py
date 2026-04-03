import os
import logging
import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(tags=["payments"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
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
            success_url=f"{FRONTEND_URL}/download?product={body.product_id}",
            cancel_url=f"{FRONTEND_URL}/store?canceled=true",
        )
        return {"url": session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        customer_email = session.get("customer_details", {}).get("email", "unknown")
        success_url = session.get("success_url", "")
        product_id = success_url.split("product=")[-1] if "product=" in success_url else "unknown"
        logger.info(f"Payment confirmed for {customer_email} - {product_id}")

    return {"status": "ok"}
