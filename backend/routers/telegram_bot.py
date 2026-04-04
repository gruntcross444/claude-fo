import logging
from fastapi import APIRouter, Request
from telegram import Update
from bot import build_application

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
