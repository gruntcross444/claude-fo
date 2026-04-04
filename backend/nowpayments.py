"""
NOWPayments API integration.
Creates crypto payment invoices and verifies payment status.
"""

import os
import hmac
import hashlib
import json
import logging
import httpx

logger = logging.getLogger(__name__)

NOWPAYMENTS_API_KEY = os.getenv("NOWPAYMENTS_API_KEY", "")
NOWPAYMENTS_IPN_SECRET = os.getenv("NOWPAYMENTS_IPN_SECRET", "")
BASE_URL = "https://api.nowpayments.io/v1"

CURRENCY_MAP = {
    "btc":  "btc",
    "usdt": "usdttrc20",
    "ltc":  "ltc",
    "trx":  "trx",
}

CURRENCY_LABELS = {
    "btc":  "Bitcoin",
    "usdt": "USDT (TRC20)",
    "ltc":  "Litecoin",
    "trx":  "TRX",
}


async def create_payment(product_id: str, product_name: str, amount_usd: float, currency: str, telegram_user_id: int) -> dict:
    """Create a NOWPayments invoice and return payment details."""
    pay_currency = CURRENCY_MAP.get(currency)
    if not pay_currency:
        raise ValueError(f"Unsupported currency: {currency}")

    payload = {
        "price_amount": amount_usd,
        "price_currency": "usd",
        "pay_currency": pay_currency,
        "order_id": f"tg_{telegram_user_id}_{product_id}",
        "order_description": product_name,
        "is_fixed_rate": False,
        "is_fee_paid_by_user": False,
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{BASE_URL}/payment",
            headers={"x-api-key": NOWPAYMENTS_API_KEY, "Content-Type": "application/json"},
            json=payload,
            timeout=15,
        )
        resp.raise_for_status()
        return resp.json()


async def get_payment_status(payment_id: str) -> dict:
    """Check payment status by payment ID."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{BASE_URL}/payment/{payment_id}",
            headers={"x-api-key": NOWPAYMENTS_API_KEY},
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json()


def verify_ipn_signature(payload: bytes, sig_header: str) -> bool:
    """Verify NOWPayments IPN webhook signature."""
    if not NOWPAYMENTS_IPN_SECRET:
        return True  # Skip verification if secret not set
    expected = hmac.new(
        NOWPAYMENTS_IPN_SECRET.encode(),
        payload,
        hashlib.sha512,
    ).hexdigest()
    return hmac.compare_digest(expected, sig_header)
