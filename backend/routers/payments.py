import os
import logging
import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from database import SessionLocal
from models import Order
from emails import send_purchase_confirmation

logger = logging.getLogger(__name__)
router = APIRouter(tags=["payments"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

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
            success_url=f"{FRONTEND_URL}/download?product={body.product_id}&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/store?canceled=true",
            metadata={"product_id": body.product_id},
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
        session_data = event["data"]["object"]
        customer_email = session_data.get("customer_details", {}).get("email", "unknown")
        product_id = session_data.get("metadata", {}).get("product_id", "unknown")
        payment_intent = session_data.get("payment_intent", "")
        amount = session_data.get("amount_total", 0)
        logger.info(f"Payment confirmed: {customer_email} bought {product_id} (${amount/100:.2f})")
        db = SessionLocal()
        try:
            order = Order(
                email=customer_email,
                product_id=product_id,
                stripe_session_id=session_data.get("id"),
                stripe_payment_intent=payment_intent,
                amount_cents=amount,
            )
            db.add(order)
            db.commit()
        finally:
            db.close()

        # Send purchase confirmation email with download link
        product_info = PRODUCTS.get(product_id)
        if product_info and customer_email != "unknown":
            send_purchase_confirmation(
                to=customer_email,
                product_name=product_info["name"],
                product_id=product_id,
                amount_cents=amount,
            )
    return {"status": "ok"}


@router.get("/verify-purchase")
def verify_purchase(session_id: str):
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id")
    try:
        session = stripe.checkout.Session.retrieve(session_id)
    except stripe.error.StripeError:
        raise HTTPException(status_code=400, detail="Invalid session")
    if session.payment_status != "paid":
        raise HTTPException(status_code=403, detail="Payment not completed")
    product_id = session.metadata.get("product_id", "")
    return {
        "verified": True,
        "product_id": product_id,
        "email": session.customer_details.email if session.customer_details else None,
    }
