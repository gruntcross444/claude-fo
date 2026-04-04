import logging
from fastapi import APIRouter, Request, HTTPException
from telegram import Update
from bot import build_application, deliver_product
from nowpayments import verify_ipn_signature

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/telegram", tags=["telegram"])

_app = None


async def _get_app():
    global _app
    if _app is None:
        _app = build_application()
        await _app.initialize()
    return _app


@router.post("/webhook")
async def telegram_webhook(request: Request):
    data = await request.json()
    app = await _get_app()
    update = Update.de_json(data, app.bot)
    await app.process_update(update)
    return {"ok": True}


@router.post("/nowpayments-ipn")
async def nowpayments_ipn(request: Request):
    """
    NOWPayments IPN callback — fires when a payment status changes.
    On 'finished' or 'confirmed', deliver the product to the buyer's Telegram.
    """
    payload = await request.body()
    sig = request.headers.get("x-nowpayments-sig", "")

    if not verify_ipn_signature(payload, sig):
        raise HTTPException(status_code=400, detail="Invalid signature")

    data = await request.json()
    status = data.get("payment_status", "")
    order_id = data.get("order_id", "")  # format: tg_{telegram_user_id}_{product_id}

    logger.info(f"NOWPayments IPN: status={status} order_id={order_id}")

    if status in ("finished", "confirmed") and order_id.startswith("tg_"):
        try:
            parts = order_id.split("_", 2)  # ["tg", telegram_user_id, product_id]
            telegram_user_id = int(parts[1])
            product_id = parts[2]
            app = await _get_app()
            await deliver_product(app.bot, telegram_user_id, product_id)
            logger.info(f"Delivered {product_id} to Telegram user {telegram_user_id}")
        except Exception as e:
            logger.error(f"Delivery failed: {e}")

    return {"ok": True}
