"""Email engine powered by Resend.

Every outbound email flows through send_email(). Template functions
build the HTML and call it — no other module touches Resend directly.
"""

import os
import logging
import resend
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

resend.api_key = os.getenv("RESEND_API_KEY", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "Claude.FO <noreply@claudefo.com>")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
OWNER_EMAIL = os.getenv("OWNER_EMAIL", "lieskaram@gmail.com")


# ── Core sender ─────────────────────────────────────────────────

def send_email(to: str, subject: str, html: str) -> bool:
    """Send a single email. Returns True on success."""
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not set — email not sent")
        return False
    try:
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [to],
            "subject": subject,
            "html": html,
        })
        logger.info(f"Email sent to {to}: {subject}")
        return True
    except Exception as e:
        logger.error(f"Email failed to {to}: {e}")
        return False


# ── Shared HTML wrapper ─────────────────────────────────────────

def _wrap(body: str) -> str:
    """Wrap email body in a branded dark template."""
    return f"""
    <div style="background:#0a0b0f;padding:40px 20px;font-family:'Inter',system-ui,sans-serif;">
      <div style="max-width:520px;margin:0 auto;background:#13141a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px;color:#9ca3af;">
        <div style="text-align:center;margin-bottom:32px;">
          <span style="font-size:20px;font-weight:800;color:#fff;">
            <span style="background:linear-gradient(135deg,#6366f1,#c8a76b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Claude</span><span style="color:#fff;">.FO</span>
          </span>
        </div>
        {body}
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:12px;color:#555;">
          Claude.FO &mdash; Premium Digital Agency<br/>
          <a href="{FRONTEND_URL}" style="color:#6366f1;text-decoration:none;">claudefo.com</a>
        </div>
      </div>
    </div>
    """


# ── 1. Spin Wheel discount code ─────────────────────────────────

def send_spin_wheel_prize(to: str, prize: str, code: str):
    """Send the prize won from the spin wheel."""
    if prize.lower() in ("try again",):
        return  # No email for "Try Again"

    body = f"""
    <h2 style="color:#f3f4f6;font-size:22px;text-align:center;margin:0 0 8px;">
      You won: {prize}!
    </h2>
    <p style="text-align:center;margin-bottom:24px;">
      Use the code below at checkout to claim your prize.
    </p>
    <div style="background:rgba(200,167,107,0.1);border:2px solid #c8a76b;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
      <span style="font-size:28px;font-weight:800;color:#c8a76b;letter-spacing:0.1em;">{code}</span>
    </div>
    <div style="text-align:center;">
      <a href="{FRONTEND_URL}/store" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">
        Shop Now
      </a>
    </div>
    <p style="text-align:center;font-size:13px;color:#666;margin-top:16px;">
      This code is valid for 7 days. One use per customer.
    </p>
    """
    send_email(to, f"Your Claude.FO Prize: {prize}", _wrap(body))


# ── 2. Exit popup discount ───────────────────────────────────────

def send_exit_discount(to: str):
    """Send 10% off + free toolkit after exit popup signup."""
    code = "WELCOME10"
    body = f"""
    <h2 style="color:#f3f4f6;font-size:22px;text-align:center;margin:0 0 8px;">
      Here's your 10% off!
    </h2>
    <p style="text-align:center;margin-bottom:24px;">
      Thanks for signing up. Use this code on your first purchase:
    </p>
    <div style="background:rgba(200,167,107,0.1);border:2px solid #c8a76b;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
      <span style="font-size:28px;font-weight:800;color:#c8a76b;letter-spacing:0.1em;">{code}</span>
    </div>
    <p style="text-align:center;font-size:14px;margin-bottom:24px;">
      Plus, here are some free tools to get you started:
    </p>
    <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-weight:600;color:#a5b4fc;">Free Real Estate Toolkit:</p>
      <ul style="margin:0;padding-left:20px;color:#999;font-size:13px;line-height:2;">
        <li>Mortgage Calculator</li>
        <li>Rent vs Buy Comparison Tool</li>
        <li>First Home Buyer Checklist</li>
        <li>Pre-Qualification Assessment</li>
        <li>Recast Calculator</li>
      </ul>
    </div>
    <div style="text-align:center;">
      <a href="{FRONTEND_URL}/tools" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#c8a76b,#a88a4e);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">
        Try Free Tools
      </a>
    </div>
    """
    send_email(to, "Your 10% Off Code + Free Toolkit", _wrap(body))


# ── 3. Post-purchase confirmation ─────────────────────────────────

def send_purchase_confirmation(to: str, product_name: str, product_id: str, amount_cents: int, session_id: str = ""):
    """Send purchase confirmation with download link."""
    if session_id:
        download_url = f"{FRONTEND_URL}/download?product={product_id}&session_id={session_id}"
    else:
        download_url = f"{FRONTEND_URL}/download?product={product_id}"
    amount = f"${amount_cents / 100:.2f}" if amount_cents else ""

    body = f"""
    <h2 style="color:#f3f4f6;font-size:22px;text-align:center;margin:0 0 8px;">
      Payment Confirmed!
    </h2>
    <p style="text-align:center;margin-bottom:24px;">
      Thank you for purchasing <strong style="color:#f3f4f6;">{product_name}</strong>{f' ({amount})' if amount else ''}.
    </p>
    <div style="text-align:center;margin-bottom:24px;">
      <a href="{download_url}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:16px;">
        Download Your Product
      </a>
    </div>
    <p style="text-align:center;font-size:13px;color:#666;">
      This link will remain active. You can also access it anytime from your purchase confirmation.
    </p>
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:16px;margin-top:20px;">
      <p style="margin:0;font-size:13px;color:#888;">
        <strong style="color:#ccc;">Need help?</strong> Reply to this email or reach out on
        <a href="https://wa.me/13057999003" style="color:#25D366;text-decoration:none;">WhatsApp</a>.
      </p>
    </div>
    """
    send_email(to, f"Your Download: {product_name}", _wrap(body))


# ── 4. Welcome sequence (3 emails) ───────────────────────────────

def send_welcome_email(to: str, sequence_num: int = 1) -> bool:
    """Send one email from the 3-part welcome sequence.

    sequence_num 1: Immediate — welcome + free tools
    sequence_num 2: Day 2 — value showcase + social proof
    sequence_num 3: Day 4 — soft sell + discount
    """
    if sequence_num == 1:
        subject = "Welcome to Claude.FO — here's what you unlocked"
        body = f"""
        <h2 style="color:#f3f4f6;font-size:22px;text-align:center;margin:0 0 8px;">
          Welcome to Claude.FO
        </h2>
        <p style="text-align:center;margin-bottom:24px;">
          You just unlocked free access to our real estate toolkit. Here's what's inside:
        </p>
        <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:16px;margin-bottom:20px;">
          <ul style="margin:0;padding-left:20px;color:#ccc;font-size:14px;line-height:2.2;">
            <li>Mortgage Calculator</li>
            <li>Rent vs Buy Comparison</li>
            <li>First Home Buyer Checklist</li>
            <li>Pre-Qualification Assessment</li>
            <li>Recast Calculator</li>
          </ul>
        </div>
        <div style="text-align:center;margin-bottom:16px;">
          <a href="{FRONTEND_URL}/tools" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">
            Try the Tools
          </a>
        </div>
        <p style="text-align:center;font-size:14px;margin-bottom:8px;">
          Also check out our <a href="{FRONTEND_URL}/prompts" style="color:#f59e0b;text-decoration:none;font-weight:600;">free AI prompt library</a> &mdash; 10 prompts you can copy and use right now.
        </p>
        """

    elif sequence_num == 2:
        subject = "50 AI prompts that save real estate pros 10+ hours/week"
        body = f"""
        <h2 style="color:#f3f4f6;font-size:22px;text-align:center;margin:0 0 8px;">
          Stop writing from scratch
        </h2>
        <p style="text-align:center;margin-bottom:24px;">
          Our Real Estate Prompt Pack has 50 fill-in-the-blank prompts for:
        </p>
        <div style="margin-bottom:24px;">
          <div style="display:flex;gap:8px;margin-bottom:8px;">
            <span style="background:rgba(200,167,107,0.1);border:1px solid rgba(200,167,107,0.2);border-radius:8px;padding:8px 14px;font-size:13px;color:#c8a76b;">Property Listings</span>
            <span style="background:rgba(200,167,107,0.1);border:1px solid rgba(200,167,107,0.2);border-radius:8px;padding:8px 14px;font-size:13px;color:#c8a76b;">Tenant Emails</span>
          </div>
          <div style="display:flex;gap:8px;margin-bottom:8px;">
            <span style="background:rgba(200,167,107,0.1);border:1px solid rgba(200,167,107,0.2);border-radius:8px;padding:8px 14px;font-size:13px;color:#c8a76b;">Market Reports</span>
            <span style="background:rgba(200,167,107,0.1);border:1px solid rgba(200,167,107,0.2);border-radius:8px;padding:8px 14px;font-size:13px;color:#c8a76b;">Social Media Posts</span>
          </div>
          <div style="display:flex;gap:8px;">
            <span style="background:rgba(200,167,107,0.1);border:1px solid rgba(200,167,107,0.2);border-radius:8px;padding:8px 14px;font-size:13px;color:#c8a76b;">Investor Updates</span>
            <span style="background:rgba(200,167,107,0.1);border:1px solid rgba(200,167,107,0.2);border-radius:8px;padding:8px 14px;font-size:13px;color:#c8a76b;">Marketing Campaigns</span>
          </div>
        </div>
        <p style="text-align:center;margin-bottom:24px;font-size:14px;">
          Just replace the [BRACKETS] with your details. 30 seconds &rarr; professional result.
        </p>
        <div style="text-align:center;">
          <a href="{FRONTEND_URL}/prompts" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">
            Preview Free Prompts
          </a>
        </div>
        """

    elif sequence_num == 3:
        subject = "Your exclusive 15% off — expires in 48 hours"
        code = "INSIDER15"
        body = f"""
        <h2 style="color:#f3f4f6;font-size:22px;text-align:center;margin:0 0 8px;">
          Exclusive offer for you
        </h2>
        <p style="text-align:center;margin-bottom:24px;">
          As a thank you for joining Claude.FO, here's <strong style="color:#f3f4f6;">15% off</strong> any product in our store.
        </p>
        <div style="background:rgba(200,167,107,0.1);border:2px solid #c8a76b;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
          <span style="font-size:28px;font-weight:800;color:#c8a76b;letter-spacing:0.1em;">{code}</span>
          <p style="margin:8px 0 0;font-size:13px;color:#888;">Expires in 48 hours</p>
        </div>
        <p style="text-align:center;font-size:14px;margin-bottom:24px;color:#ccc;">
          Most popular: <strong>Real Estate Prompt Pack</strong> ($14) &mdash; 50 ready-to-use AI prompts.
        </p>
        <div style="text-align:center;">
          <a href="{FRONTEND_URL}/store" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#c8a76b,#a88a4e);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:16px;">
            Browse Store
          </a>
        </div>
        """
    else:
        return False

    return send_email(to, subject, _wrap(body))


# ── 5. Free PDF lead magnet ───────────────────────────────────

def send_free_pdf(to: str):
    """Send the free Real Estate Prompt Pack PDF to a new lead."""
    pdf_url = f"{FRONTEND_URL}/downloads/Real-Estate-Prompt-Pack-ClaudeFO.pdf"
    body = f"""
    <h2 style="color:#f3f4f6;font-size:22px;text-align:center;margin:0 0 8px;">
      Your Free Prompt Pack is Ready!
    </h2>
    <p style="text-align:center;margin-bottom:24px;">
      Here are <strong style="color:#f3f4f6;">50 fill-in-the-blank AI prompts</strong> for real estate
      agents, investors, and property managers. Normally $14 — yours free.
    </p>
    <div style="background:rgba(200,167,107,0.08);border:1px solid rgba(200,167,107,0.2);border-radius:12px;padding:16px;margin-bottom:24px;">
      <ul style="margin:0;padding-left:20px;color:#ccc;font-size:14px;line-height:2.2;">
        <li>Property listing descriptions in 30 seconds</li>
        <li>Tenant &amp; investor email templates</li>
        <li>Market report and social media copy</li>
        <li>Negotiation scripts and buyer outreach</li>
      </ul>
    </div>
    <div style="text-align:center;margin-bottom:16px;">
      <a href="{pdf_url}" download style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:16px;">
        Download PDF Now
      </a>
    </div>
    <p style="text-align:center;font-size:13px;color:#666;margin-top:8px;">
      Want the full 200-prompt library?
      <a href="{FRONTEND_URL}/store" style="color:#c8a76b;text-decoration:none;font-weight:600;">Browse the Store</a>
    </p>
    """
    return send_email(to, "Your Free Real Estate Prompt Pack — Claude.FO", _wrap(body))


# ── 6. Rental application confirmation (to applicant) ─────────

def send_application_confirmation(to: str, applicant_name: str, building_name: str):
    """Send application confirmation to the applicant."""
    body = f"""
    <h2 style="color:#f3f4f6;font-size:22px;text-align:center;margin:0 0 8px;">
      Application Submitted!
    </h2>
    <p style="text-align:center;margin-bottom:24px;">
      Thank you, <strong style="color:#f3f4f6;">{applicant_name}</strong>. Your rental application for
      <strong style="color:#c8a76b;">{building_name}</strong> has been received.
    </p>
    <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-weight:600;color:#6ee7b7;">What happens next:</p>
      <ol style="margin:0;padding-left:20px;color:#999;font-size:13px;line-height:2.2;">
        <li>Our team reviews your application</li>
        <li>Credit and background check processed</li>
        <li>You&rsquo;ll hear back within <strong style="color:#f3f4f6;">24-48 hours</strong></li>
        <li>If approved, we&rsquo;ll send lease details</li>
      </ol>
    </div>
    <div style="text-align:center;">
      <a href="{FRONTEND_URL}/brickell" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#c8a76b,#a88a4e);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">
        Back to Brickell Living
      </a>
    </div>
    <p style="text-align:center;font-size:13px;color:#666;margin-top:16px;">
      Questions? Reach us on <a href="https://wa.me/13057999003" style="color:#25D366;text-decoration:none;">WhatsApp</a>.
    </p>
    """
    send_email(to, f"Application Received — {building_name}", _wrap(body))


# ── 6. Rental application details (to owner) ──────────────────

def send_application_to_owner(applicant_name: str, applicant_email: str, applicant_phone: str, building_name: str, wizard_data_json: str):
    """Send full application details to the business owner."""
    import json, html as _html
    try:
        data = json.loads(wizard_data_json) if wizard_data_json else {}
    except (json.JSONDecodeError, TypeError):
        data = {}

    rows = ""
    field_labels = {
        "name": "Full Name", "email": "Email", "phone": "Phone", "dob": "Date of Birth",
        "ssn": "SSN", "emergencyName": "Emergency Contact", "emergencyPhone": "Emergency Phone",
        "address": "Current Address", "city": "City", "state": "State", "zip": "ZIP",
        "currentRent": "Current Rent", "duration": "Duration at Address",
        "landlordName": "Landlord Name", "landlordPhone": "Landlord Phone", "moveReason": "Reason for Moving",
        "employmentStatus": "Employment Status", "employer": "Employer", "jobTitle": "Job Title",
        "monthlyIncome": "Monthly Income", "supervisorName": "Supervisor", "supervisorPhone": "Supervisor Phone",
        "jobDuration": "Time at Job",
        "buildingName": "Building", "unitType": "Unit Type", "moveInDate": "Move-in Date",
        "maxBudget": "Max Budget", "specialRequirements": "Special Requirements",
    }

    for key, label in field_labels.items():
        value = data.get(key, "")
        if value:
            safe_value = _html.escape(str(value))
            rows += f'<tr><td style="padding:6px 12px;color:#888;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.04);">{label}</td><td style="padding:6px 12px;color:#f3f4f6;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.04);">{safe_value}</td></tr>'

    applicant_name  = _html.escape(applicant_name)
    applicant_email = _html.escape(applicant_email)
    applicant_phone = _html.escape(applicant_phone)
    building_name   = _html.escape(building_name)

    body = f"""
    <h2 style="color:#f3f4f6;font-size:22px;text-align:center;margin:0 0 8px;">
      New Rental Application
    </h2>
    <p style="text-align:center;margin-bottom:24px;">
      <strong style="color:#c8a76b;">{applicant_name}</strong> applied for
      <strong style="color:#6366f1;">{building_name}</strong>
    </p>
    <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        {rows}
      </table>
    </div>
    <div style="background:rgba(200,167,107,0.08);border:1px solid rgba(200,167,107,0.2);border-radius:10px;padding:16px;margin-bottom:16px;">
      <p style="margin:0;font-size:13px;color:#c8a76b;font-weight:600;">
        Contact: {applicant_email} | {applicant_phone}
      </p>
    </div>
    <p style="text-align:center;font-size:12px;color:#555;">
      Application fee: $200.00 (paid via Stripe)
    </p>
    """
    send_email(OWNER_EMAIL, f"NEW APPLICATION: {applicant_name} — {building_name}", _wrap(body))
