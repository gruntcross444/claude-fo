import os
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters, ContextTypes
from nowpayments import create_payment, CURRENCY_LABELS

logger = logging.getLogger(__name__)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://claudefo.com")

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

# Map product_id to download filename
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
    [InlineKeyboardButton("📦 My Orders",        callback_data="menu_orders")],
    [InlineKeyboardButton("💬 Support",          callback_data="menu_support")],
])


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
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
    keyboard = [
        [InlineKeyboardButton("₿ Pay with Bitcoin",       callback_data=f"pay_btc_{product_id}")],
        [InlineKeyboardButton("🔵 Pay with USDT (TRC20)", callback_data=f"pay_usdt_{product_id}")],
        [InlineKeyboardButton("⚡ Pay with Litecoin",     callback_data=f"pay_ltc_{product_id}")],
        [InlineKeyboardButton("🔴 Pay with TRX",          callback_data=f"pay_trx_{product_id}")],
        [InlineKeyboardButton("⬅️ Back to Products",      callback_data="menu_products")],
    ]
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
        "📦 *My Orders*\n\nSend your email address and I'll look up your purchases.",
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


def build_application() -> Application:
    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("menu", show_products))
    app.add_handler(CallbackQueryHandler(show_main_menu,        pattern="^menu_main$"))
    app.add_handler(CallbackQueryHandler(show_products,         pattern="^menu_products$"))
    app.add_handler(CallbackQueryHandler(show_orders,           pattern="^menu_orders$"))
    app.add_handler(CallbackQueryHandler(show_support,          pattern="^menu_support$"))
    app.add_handler(CallbackQueryHandler(show_product_detail,   pattern="^buy_"))
    app.add_handler(CallbackQueryHandler(handle_crypto_payment, pattern="^pay_"))
    return app
