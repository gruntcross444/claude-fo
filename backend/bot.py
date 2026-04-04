import os
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
from nowpayments import create_payment, create_topup_payment, CURRENCY_LABELS
from database import SessionLocal
from models import TgUser, TgPurchase, TgTopup

logger = logging.getLogger(__name__)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

PRODUCTS = {
    "finance-tracker":        {"name": "Monthly Finance Tracker",      "price": 19,  "emoji": "📊"},
    "social-media-kit":       {"name": "Social Media Kit",             "price": 29,  "emoji": "📱"},
    "website-templates":      {"name": "Website Templates Pack",       "price": 39,  "emoji": "🌐"},
    "real-estate-template":   {"name": "Real Estate Landing Template", "price": 24,  "emoji": "🏠"},
    "content-calendar":       {"name": "Content Calendar Planner",     "price": 14,  "emoji": "📅"},
    "lead-funnel-template":   {"name": "Lead Funnel Blueprint",        "price": 34,  "emoji": "🎯"},
    "email-sms-playbook":     {"name": "Email & SMS Playbook",         "price": 24,  "emoji": "📧"},
    "automation-starter-kit": {"name": "Automation Starter Kit",       "price": 19,  "emoji": "⚙️"},
    "prompts-real-estate":    {"name": "Real Estate Prompt Pack",      "price": 14,  "emoji": "🏡"},
    "prompts-marketing":      {"name": "Marketing & Sales Prompts",    "price": 19,  "emoji": "📣"},
    "prompts-business":       {"name": "Business & Productivity Pack", "price": 14,  "emoji": "💼"},
    "prompts-content":        {"name": "Content Creator Toolkit",      "price": 19,  "emoji": "✍️"},
}

DOWNLOAD_FILES = {
    "finance-tracker":        "Monthly-Finance-Tracker-ClaudeFO.pdf",
    "social-media-kit":       "Social-Media-Kit-ClaudeFO.pdf",
    "website-templates":      "Website-Templates-Pack-ClaudeFO.pdf",
    "real-estate-template":   "Real-Estate-Landing-Template-ClaudeFO.pdf",
    "content-calendar":       "Content-Calendar-Planner-ClaudeFO.pdf",
    "lead-funnel-template":   "Lead-Funnel-Blueprint-ClaudeFO.pdf",
    "email-sms-playbook":     "Email-SMS-Playbook-ClaudeFO.pdf",
    "automation-starter-kit": "Automation-Starter-Kit-ClaudeFO.pdf",
    "prompts-real-estate":    "Real-Estate-Prompt-Pack-ClaudeFO.pdf",
    "prompts-marketing":      "Marketing-Sales-Prompts-ClaudeFO.pdf",
    "prompts-business":       "Business-Productivity-Prompts-ClaudeFO.pdf",
    "prompts-content":        "Content-Creator-Toolkit-ClaudeFO.pdf",
}

MAIN_MENU_TEXT = (
    "👋 Welcome to *CLAUDE.FO Store*\n\n"
    "Digital products for entrepreneurs.\n"
    "Pay with crypto — receive instantly.\n\n"
    "What would you like to do?"
)

MAIN_MENU_KEYBOARD = InlineKeyboardMarkup([
    [InlineKeyboardButton("🛍️ Browse Products", callback_data="menu_products")],
    [InlineKeyboardButton("💳 My Dashboard",    callback_data="menu_dashboard")],
    [InlineKeyboardButton("📦 My Orders",        callback_data="menu_orders")],
    [InlineKeyboardButton("💬 Support",          callback_data="menu_support")],
])


# ── Helper ────────────────────────────────────────────────────────

def _get_or_create_tg_user(db, from_user) -> TgUser:
    user = db.query(TgUser).filter(TgUser.telegram_id == from_user.id).first()
    if not user:
        user = TgUser(
            telegram_id=from_user.id,
            username=from_user.username,
            first_name=from_user.first_name,
            balance_cents=0,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


# ── Core menu handlers ────────────────────────────────────────────

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    db = SessionLocal()
    try:
        _get_or_create_tg_user(db, update.message.from_user)
    finally:
        db.close()
    await update.message.reply_text(
        MAIN_MENU_TEXT,
        parse_mode="Markdown",
        reply_markup=MAIN_MENU_KEYBOARD,
    )


async def show_main_menu(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        MAIN_MENU_TEXT,
        parse_mode="Markdown",
        reply_markup=MAIN_MENU_KEYBOARD,
    )


async def show_products(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = []
    for product_id, product in PRODUCTS.items():
        keyboard.append([
            InlineKeyboardButton(
                f"{product['emoji']} {product['name']} — ${product['price']}",
                callback_data=f"buy_{product_id}",
            )
        ])
    keyboard.append([InlineKeyboardButton("⬅️ Back", callback_data="menu_main")])
    await query.edit_message_text(
        "🛍️ *Our Products*\n\nSelect a product to purchase with crypto:",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )


async def show_product_detail(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    product_id = query.data.replace("buy_", "")
    product = PRODUCTS.get(product_id)
    if not product:
        await query.edit_message_text("Product not found.")
        return

    # Check wallet balance
    balance_cents = 0
    db = SessionLocal()
    try:
        tg_user = db.query(TgUser).filter(TgUser.telegram_id == query.from_user.id).first()
        if tg_user:
            balance_cents = tg_user.balance_cents
    finally:
        db.close()

    price_cents = product["price"] * 100
    keyboard = [
        [InlineKeyboardButton("₿ Pay with Bitcoin",       callback_data=f"pay_btc_{product_id}")],
        [InlineKeyboardButton("🔵 Pay with USDT (TRC20)", callback_data=f"pay_usdt_{product_id}")],
        [InlineKeyboardButton("⚡ Pay with Litecoin",     callback_data=f"pay_ltc_{product_id}")],
        [InlineKeyboardButton("🔴 Pay with TRX",          callback_data=f"pay_trx_{product_id}")],
    ]
    if balance_cents >= price_cents:
        keyboard.append([
            InlineKeyboardButton(
                f"💳 Pay with Balance (${balance_cents/100:.2f} available)",
                callback_data=f"buywbal_{product_id}",
            )
        ])
    keyboard.append([InlineKeyboardButton("⬅️ Back to Products", callback_data="menu_products")])

    await query.edit_message_text(
        f"{product['emoji']} *{product['name']}*\n\n"
        f"💵 Price: *${product['price']} USD*\n\n"
        f"Select your payment method:",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )


async def handle_crypto_payment(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    parts = query.data.split("_", 2)  # pay_btc_product-id
    if len(parts) != 3:
        await query.edit_message_text("Invalid selection.")
        return

    _, currency, product_id = parts
    product = PRODUCTS.get(product_id)
    if not product:
        await query.edit_message_text("Product not found.")
        return

    await query.edit_message_text(
        f"⏳ *Creating your payment...*\n\nGenerating a {CURRENCY_LABELS.get(currency, currency)} address for *{product['name']}*.",
        parse_mode="Markdown",
    )

    try:
        payment = await create_payment(
            product_id=product_id,
            product_name=product["name"],
            amount_usd=product["price"],
            currency=currency,
            telegram_user_id=query.from_user.id,
        )

        pay_address = payment.get("pay_address", "N/A")
        pay_amount = payment.get("pay_amount", "N/A")
        pay_currency = payment.get("pay_currency", currency).upper()
        payment_id = payment.get("payment_id", "")
        expiry = payment.get("expiration_estimate_date", "")

        msg = (
            f"✅ *Payment Ready*\n\n"
            f"📦 *Product:* {product['emoji']} {product['name']}\n"
            f"💵 *Amount:* `{pay_amount} {pay_currency}`\n\n"
            f"📬 *Send to this address:*\n`{pay_address}`\n\n"
            f"⚠️ Send *exact amount* to this address only.\n"
            f"🔁 Your download link will be sent here automatically once payment is confirmed.\n\n"
            f"🆔 Payment ID: `{payment_id}`"
        )
        if expiry:
            msg += f"\n⏱ Expires: {expiry[:16].replace('T', ' ')} UTC"

        keyboard = [[InlineKeyboardButton("⬅️ Back to Menu", callback_data="menu_main")]]
        await query.edit_message_text(msg, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup(keyboard))

    except Exception as e:
        logger.error(f"NOWPayments error: {e}")
        keyboard = [[InlineKeyboardButton("⬅️ Try Again", callback_data=f"buy_{product_id}")]]
        await query.edit_message_text(
            "❌ *Payment creation failed.*\n\nPlease try again or contact support at support@claudefo.com",
            parse_mode="Markdown",
            reply_markup=InlineKeyboardMarkup(keyboard),
        )


async def show_orders(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "📦 *My Orders*\n\nFor order history or delivery issues, contact us:\n📧 support@claudefo.com\n\nInclude your payment email and we'll sort it out quickly.",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("⬅️ Back", callback_data="menu_main")]]),
    )


async def show_support(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "💬 *Support*\n\nNeed help?\n📧 support@claudefo.com\n🌐 claudefo.com",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("⬅️ Back", callback_data="menu_main")]]),
    )


# ── Dashboard handlers ────────────────────────────────────────────

async def show_dashboard(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    db = SessionLocal()
    try:
        user = _get_or_create_tg_user(db, query.from_user)
        balance = user.balance_cents / 100
    finally:
        db.close()

    name = query.from_user.first_name or "there"
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("➕ Add Funds",    callback_data="dash_addfunds")],
        [InlineKeyboardButton("🛒 My Purchases", callback_data="dash_purchases")],
        [InlineKeyboardButton("⬅️ Back",         callback_data="menu_main")],
    ])
    await query.edit_message_text(
        f"💳 *My Dashboard*\n\n"
        f"Hey {name}! Here's your account overview.\n\n"
        f"💰 *Wallet Balance:* ${balance:.2f}\n\n"
        f"Top up your wallet to buy products instantly — no blockchain wait time.",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )


async def show_addfunds(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("$5",  callback_data="topup_500"),
         InlineKeyboardButton("$10", callback_data="topup_1000")],
        [InlineKeyboardButton("$25", callback_data="topup_2500"),
         InlineKeyboardButton("$50", callback_data="topup_5000")],
        [InlineKeyboardButton("⬅️ Back", callback_data="menu_dashboard")],
    ])
    await query.edit_message_text(
        "➕ *Add Funds*\n\nSelect an amount to add to your wallet:",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )


async def handle_topup_amount(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    amount_cents = int(query.data.replace("topup_", ""))
    amount_usd = amount_cents / 100

    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("₿ Bitcoin",       callback_data=f"topup_currency_{amount_cents}_btc")],
        [InlineKeyboardButton("🔵 USDT (TRC20)", callback_data=f"topup_currency_{amount_cents}_usdt")],
        [InlineKeyboardButton("⚡ Litecoin",     callback_data=f"topup_currency_{amount_cents}_ltc")],
        [InlineKeyboardButton("🔴 TRX",          callback_data=f"topup_currency_{amount_cents}_trx")],
        [InlineKeyboardButton("⬅️ Back",         callback_data="dash_addfunds")],
    ])
    await query.edit_message_text(
        f"➕ *Add ${amount_usd:.2f} to Wallet*\n\nSelect your payment method:",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )


async def handle_topup_payment(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    # callback: topup_currency_{amount_cents}_{currency}
    parts = query.data.split("_")  # ["topup", "currency", amount, currency]
    amount_cents = int(parts[2])
    currency = parts[3]

    await query.edit_message_text(
        f"⏳ *Creating top-up payment...*\n\nGenerating a {CURRENCY_LABELS.get(currency, currency)} address.",
        parse_mode="Markdown",
    )

    try:
        payment = await create_topup_payment(
            telegram_user_id=query.from_user.id,
            amount_cents=amount_cents,
            currency=currency,
        )

        order_id = payment.get("order_id", f"bal_{query.from_user.id}_{amount_cents}")
        pay_address = payment.get("pay_address", "N/A")
        pay_amount = payment.get("pay_amount", "N/A")
        pay_currency = payment.get("pay_currency", currency).upper()
        expiry = payment.get("expiration_estimate_date", "")

        # Save pending top-up to DB
        db = SessionLocal()
        try:
            topup = TgTopup(
                telegram_id=query.from_user.id,
                order_id=order_id,
                amount_cents=amount_cents,
                currency=currency,
                status="pending",
            )
            db.add(topup)
            db.commit()
        finally:
            db.close()

        msg = (
            f"✅ *Top-up Payment Ready*\n\n"
            f"💰 *Amount:* `{pay_amount} {pay_currency}`\n\n"
            f"📬 *Send to this address:*\n`{pay_address}`\n\n"
            f"⚠️ Send *exact amount* to this address only.\n"
            f"✨ Your wallet will be credited automatically once confirmed."
        )
        if expiry:
            msg += f"\n⏱ Expires: {expiry[:16].replace('T', ' ')} UTC"

        keyboard = [[InlineKeyboardButton("⬅️ Back to Menu", callback_data="menu_main")]]
        await query.edit_message_text(msg, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup(keyboard))

    except Exception as e:
        logger.error(f"Top-up payment error: {e}")
        keyboard = [[InlineKeyboardButton("⬅️ Try Again", callback_data="dash_addfunds")]]
        await query.edit_message_text(
            "❌ *Payment creation failed.*\n\nPlease try again or contact support@claudefo.com",
            parse_mode="Markdown",
            reply_markup=InlineKeyboardMarkup(keyboard),
        )


async def show_purchases(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    db = SessionLocal()
    try:
        purchases = (
            db.query(TgPurchase)
            .filter(TgPurchase.telegram_id == query.from_user.id)
            .order_by(TgPurchase.created_at.desc())
            .limit(20)
            .all()
        )
    finally:
        db.close()

    if not purchases:
        text = (
            "🛒 *My Purchases*\n\n"
            "You haven't bought anything yet.\n\n"
            "Use 🛍️ *Browse Products* to get started!"
        )
    else:
        lines = ["🛒 *My Purchases*\n"]
        for p in purchases:
            product = PRODUCTS.get(p.product_id, {})
            name = product.get("name", p.product_id)
            emoji = product.get("emoji", "📦")
            method = "💳 Balance" if p.payment_method == "balance" else p.payment_method.upper()
            date = p.created_at.strftime("%b %d, %Y")
            lines.append(f"{emoji} *{name}*\n   ${p.amount_cents/100:.2f} via {method} — {date}")
        text = "\n\n".join(lines)

    await query.edit_message_text(
        text,
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("⬅️ Back", callback_data="menu_dashboard")]]),
    )


async def handle_buy_with_balance(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    product_id = query.data.replace("buywbal_", "")
    product = PRODUCTS.get(product_id)
    if not product:
        await query.edit_message_text("Product not found.")
        return

    db = SessionLocal()
    try:
        user = db.query(TgUser).filter(TgUser.telegram_id == query.from_user.id).first()
        balance_cents = user.balance_cents if user else 0
    finally:
        db.close()

    price_cents = product["price"] * 100
    after_cents = balance_cents - price_cents

    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("✅ Confirm Purchase", callback_data=f"confirm_buywbal_{product_id}")],
        [InlineKeyboardButton("❌ Cancel",           callback_data=f"buy_{product_id}")],
    ])
    await query.edit_message_text(
        f"💳 *Buy with Balance*\n\n"
        f"📦 {product['emoji']} *{product['name']}*\n"
        f"💵 Price: *${product['price']:.2f}*\n\n"
        f"Your balance: ${balance_cents/100:.2f}\n"
        f"Balance after: ${after_cents/100:.2f}\n\n"
        f"Confirm your purchase?",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )


async def confirm_buy_with_balance(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    product_id = query.data.replace("confirm_buywbal_", "")
    product = PRODUCTS.get(product_id)
    if not product:
        await query.edit_message_text("Product not found.")
        return

    price_cents = product["price"] * 100
    tg_id = query.from_user.id

    db = SessionLocal()
    try:
        user = db.query(TgUser).filter(TgUser.telegram_id == tg_id).with_for_update().first()
        if not user or user.balance_cents < price_cents:
            await query.edit_message_text(
                "❌ *Insufficient balance.*\n\nPlease add funds to your wallet first.",
                parse_mode="Markdown",
                reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("➕ Add Funds", callback_data="dash_addfunds")]]),
            )
            return
        user.balance_cents -= price_cents
        db.add(TgPurchase(
            telegram_id=tg_id,
            product_id=product_id,
            amount_cents=price_cents,
            payment_method="balance",
            order_id=None,
        ))
        db.commit()
    finally:
        db.close()

    await query.edit_message_text(
        f"⏳ *Processing your purchase...*",
        parse_mode="Markdown",
    )
    await deliver_product(context.bot, tg_id, product_id)


# ── Delivery ──────────────────────────────────────────────────────

async def deliver_product(bot, telegram_user_id: int, product_id: str):
    """Send download link to user after payment confirmed."""
    product = PRODUCTS.get(product_id)
    filename = DOWNLOAD_FILES.get(product_id)
    if not product or not filename:
        logger.error(f"Cannot deliver unknown product: {product_id}")
        return

    download_url = f"{FRONTEND_URL}/downloads/{filename}"
    msg = (
        f"🎉 *Payment Confirmed!*\n\n"
        f"Thank you for your purchase of *{product['name']}*.\n\n"
        f"📥 *Download your file here:*\n{download_url}\n\n"
        f"Questions? Reply here or email support@claudefo.com\n\n"
        f"_— CLAUDE.FO Team_"
    )
    await bot.send_message(chat_id=telegram_user_id, text=msg, parse_mode="Markdown")


# ── App builder ───────────────────────────────────────────────────

def build_application() -> Application:
    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("menu", show_products))

    # Menu navigation
    app.add_handler(CallbackQueryHandler(show_main_menu,  pattern="^menu_main$"))
    app.add_handler(CallbackQueryHandler(show_products,   pattern="^menu_products$"))
    app.add_handler(CallbackQueryHandler(show_orders,     pattern="^menu_orders$"))
    app.add_handler(CallbackQueryHandler(show_support,    pattern="^menu_support$"))
    app.add_handler(CallbackQueryHandler(show_dashboard,  pattern="^menu_dashboard$"))

    # Dashboard sub-screens
    app.add_handler(CallbackQueryHandler(show_addfunds,         pattern="^dash_addfunds$"))
    app.add_handler(CallbackQueryHandler(show_purchases,        pattern="^dash_purchases$"))
    app.add_handler(CallbackQueryHandler(handle_topup_amount,   pattern=r"^topup_\d+$"))
    app.add_handler(CallbackQueryHandler(handle_topup_payment,  pattern="^topup_currency_"))

    # Balance purchase flow (must be before ^buy_ to avoid shadowing)
    app.add_handler(CallbackQueryHandler(handle_buy_with_balance,   pattern="^buywbal_"))
    app.add_handler(CallbackQueryHandler(confirm_buy_with_balance,  pattern="^confirm_buywbal_"))

    # Product & crypto payment flow
    app.add_handler(CallbackQueryHandler(show_product_detail,   pattern="^buy_"))
    app.add_handler(CallbackQueryHandler(handle_crypto_payment, pattern="^pay_"))

    return app
