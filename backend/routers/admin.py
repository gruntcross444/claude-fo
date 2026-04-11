"""Read-only admin dashboard. Protected by ADMIN_SECRET env var.

Pass secret via header:  X-Admin-Token: <ADMIN_SECRET>

GET /admin/summary    — counts + recent activity
GET /admin/leads      — all leads
GET /admin/orders     — all orders
GET /admin/contacts   — all contact messages
GET /admin/applications — all rental applications
"""

import os
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.params import Header
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session
from dependencies import get_db
from models import Lead, Order, ContactMessage, RentalApplication

router = APIRouter(prefix="/admin", tags=["admin"])
limiter = Limiter(key_func=get_remote_address)

ADMIN_SECRET = os.getenv("ADMIN_SECRET", "")


def _check(token: str):
    if not ADMIN_SECRET or token != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden")


@router.get("/summary")
@limiter.limit("30/minute")
def admin_summary(
    request: Request,
    x_admin_token: str = Header("", alias="X-Admin-Token"),
    db: Session = Depends(get_db),
):
    _check(x_admin_token)
    leads         = db.query(Lead).count()
    orders        = db.query(Order).count()
    contacts      = db.query(ContactMessage).count()
    applications  = db.query(RentalApplication).count()
    paid_apps     = db.query(RentalApplication).filter(RentalApplication.status == "paid").count()

    recent_leads  = db.query(Lead).order_by(Lead.created_at.desc()).limit(5).all()
    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()

    return {
        "counts": {
            "leads": leads,
            "orders": orders,
            "contacts": contacts,
            "rental_applications": applications,
            "paid_applications": paid_apps,
        },
        "recent_leads": [
            {"email": l.email, "source": l.source, "created_at": l.created_at}
            for l in recent_leads
        ],
        "recent_orders": [
            {"email": o.email, "product_id": o.product_id,
             "amount": f"${o.amount_cents / 100:.2f}" if o.amount_cents else None,
             "created_at": o.created_at}
            for o in recent_orders
        ],
    }


@router.get("/leads")
@limiter.limit("30/minute")
def admin_leads(
    request: Request,
    x_admin_token: str = Header("", alias="X-Admin-Token"),
    db: Session = Depends(get_db),
):
    _check(x_admin_token)
    rows = db.query(Lead).order_by(Lead.created_at.desc()).all()
    return [{"id": r.id, "email": r.email, "source": r.source, "created_at": r.created_at} for r in rows]


@router.get("/orders")
@limiter.limit("30/minute")
def admin_orders(
    request: Request,
    x_admin_token: str = Header("", alias="X-Admin-Token"),
    db: Session = Depends(get_db),
):
    _check(x_admin_token)
    rows = db.query(Order).order_by(Order.created_at.desc()).all()
    return [
        {"id": r.id, "email": r.email, "product_id": r.product_id,
         "amount": f"${r.amount_cents / 100:.2f}" if r.amount_cents else None,
         "stripe_session_id": r.stripe_session_id, "created_at": r.created_at}
        for r in rows
    ]


@router.get("/contacts")
@limiter.limit("30/minute")
def admin_contacts(
    request: Request,
    x_admin_token: str = Header("", alias="X-Admin-Token"),
    db: Session = Depends(get_db),
):
    _check(x_admin_token)
    rows = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return [
        {"id": r.id, "name": r.name, "email": r.email,
         "message": r.message, "created_at": r.created_at}
        for r in rows
    ]


@router.get("/applications")
@limiter.limit("30/minute")
def admin_applications(
    request: Request,
    x_admin_token: str = Header("", alias="X-Admin-Token"),
    db: Session = Depends(get_db),
):
    _check(x_admin_token)
    rows = db.query(RentalApplication).order_by(RentalApplication.created_at.desc()).all()
    return [
        {"id": r.id, "name": r.name, "email": r.email, "phone": r.phone,
         "building_name": r.building_name, "status": r.status,
         "amount": f"${r.amount_cents / 100:.2f}" if r.amount_cents else None,
         "created_at": r.created_at}
        for r in rows
    ]
