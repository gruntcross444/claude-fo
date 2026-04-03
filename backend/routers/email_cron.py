"""Process scheduled emails. Hit GET /emails/process-queue to send due emails.

Call this endpoint via cron (e.g. every 30 min) or manually.
Protected by a simple secret token to prevent abuse.
"""

import os
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query
from database import SessionLocal
from models import ScheduledEmail
from emails import send_welcome_email

router = APIRouter(prefix="/emails", tags=["emails"])

CRON_SECRET = os.getenv("CRON_SECRET", "")


@router.get("/process-queue")
def process_email_queue(token: str = Query("")):
    """Process all due scheduled emails. Protected by CRON_SECRET."""
    if not CRON_SECRET or token != CRON_SECRET:
        raise HTTPException(status_code=403, detail="Invalid token")

    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        due = db.query(ScheduledEmail).filter(
            ScheduledEmail.sent == 0,
            ScheduledEmail.send_after <= now,
        ).limit(50).all()

        sent_count = 0
        for item in due:
            if item.email_type == "welcome_2":
                send_welcome_email(item.email, sequence_num=2)
            elif item.email_type == "welcome_3":
                send_welcome_email(item.email, sequence_num=3)

            item.sent = 1
            sent_count += 1

        db.commit()
        return {"status": "ok", "processed": sent_count}
    finally:
        db.close()
