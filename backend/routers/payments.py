import os
import logging
import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from database import SessionLocal
from models import Order, RentalApplication
from emails import send_purchase_confirmation, send_application_confirmation, send_application_to_owner

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
    "rental-application": {"name": "Rental Application Fee", "price": 20000},
}


class CheckoutRequest(BaseModel):
    product_id: str
    application_id: int = None


@router.post("/checkout")
def create_checkout(body: CheckoutRequest):
    product = PRODUCTS.get(body.product_id)
    if not product:
        raise HTTPException(status_code=400, detail="Product not found")

    metadata = {"product_id": body.product_id}
    if body.application_id:
        metadata["application_id"] = str(body.application_id)

    # Rental applications go to confirmation page, products go to download
    if body.product_id == "rental-application":
        success = f"{FRONTEND_URL}/application-confirmation?session_id={{CHECKOUT_SESSION_ID}}"
        cancel = f"{FRONTEND_URL}/brickell?canceled=true"
    else:
        success = f"{FRONTEND_URL}/download?product={body.product_id}&session_id={{CHECKOUT_SESSION_ID}}"
        cancel = f"{FRONTEND_URL}/store?canceled=true"

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
            allow_promotion_codes=True,
            success_url=success,
            cancel_url=cancel,
            metadata=metadata,
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
        session_id = session_data.get("id")
        logger.info(f"Payment confirmed: {customer_email} bought {product_id}")
        db = SessionLocal()
        try:
            # Idempotency: skip if this session was already processed
            existing_order = db.query(Order).filter(Order.stripe_session_id == session_id).first()
            if existing_order:
                logger.info(f"Webhook already processed for session {session_id}, skipping")
                return {"status": "ok"}
            order = Order(
                email=customer_email,
                product_id=product_id,
                stripe_session_id=session_id,
                stripe_payment_intent=payment_intent,
                amount_cents=amount,
            )
            db.add(order)
            db.commit()
        finally:
            db.close()

        # Handle rental application payments
        if product_id == "rental-application":
            app_id = session_data.get("metadata", {}).get("application_id")
            if not app_id:
                logger.warning(f"Rental application payment without application_id: {session_data.get('id')}")
            else:
                db2 = SessionLocal()
                try:
                    rental_app = db2.query(RentalApplication).filter(RentalApplication.id == int(app_id)).first()
                    if rental_app:
                        rental_app.status = "paid"
                        rental_app.stripe_session_id = session_data.get("id")
                        rental_app.stripe_payment_intent = payment_intent
                        rental_app.amount_cents = amount
                        db2.commit()
                        send_application_confirmation(customer_email, rental_app.name, rental_app.building_name)
                        send_application_to_owner(rental_app.name, rental_app.email, rental_app.phone, rental_app.building_name, rental_app.wizard_data)
                finally:
                    db2.close()
        else:
            # Send purchase confirmation email with download link
            product_info = PRODUCTS.get(product_id)
            if product_info and customer_email != "unknown":
                send_purchase_confirmation(
                    to=customer_email,
                    product_name=product_info["name"],
                    product_id=product_id,
                    amount_cents=amount,
                    session_id=session_data.get("id", ""),
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
