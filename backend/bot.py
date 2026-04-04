import os
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes

logger = logging.getLogger(__name__)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

PRODUCTS = {
    "finance-tracker":       {"name": "Monthly Finance Tracker",      "price": 1900,  "emoji": "📊"},
    "social-media-kit":      {"name": "Social Media Kit",             "price": 2900,  "emoji": "📱"},
    "website-templates":     {"name": "Website Templates Pack",       "price": 3900,  "emoji": "🌐"},
    "real-estate-template":  {"name": "Real Estate Landing Template", "price": 2400,  "emoji": "🏠"},
    "content-calendar":      {"name": "Content Calendar Planner",     "price": 1400,  "emoji": "📅"},
    "lead-funnel-template":  {"name": "Lead Funnel Blueprint",        "price": 3400,  "emoji": "🎯"},
    "email-sms-playbook":    {"name": "Email & SMS Playbook",         "price": 2400,  "emoji": "📧"},
    "automation-starter-kit":{"name": "Automation Starter Kit",       "price": 1900,  "emoji": "⚙️"},
    "prompts-real-estate":   {"name": "Real Estate Prompt Pack",      "price": 1400,  "emoji": "🏡"},
    "prompts-marketing":     {"name": "Marketing & Sales Prompts",    "price": 1900,  "emoji": "📣"},
    "prompts-business":      {"name": "Business & Productivity Pack", "price": 1400,  "emoji": "💼"},
    "prompts-content":       {"name": "Content Creator Toolkit",      "price": 1900,  "emoji": "✍️"},
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
        price = product["price"] / 100
        keyboard.append([
            InlineKeyboardButton(
                f"{product['emoji']} {product['name']} — ${price:.0f}",
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
    price = product["price"] / 100
    keyboard = [
        [InlineKeyboardButton("₿ Pay with Bitcoin",       callback_data=f"pay_btc_{product_id}")],
        [InlineKeyboardButton("🔵 Pay with USDT (TRC20)", callback_data=f"pay_usdt_{product_id}")],
        [InlineKeyboardButton("⚡ Pay with Litecoin",     callback_data=f"pay_ltc_{product_id}")],
        [InlineKeyboardButton("🔴 Pay with TRX",          callback_data=f"pay_trx_{product_id}")],
        [InlineKeyboardButton("⬅️ Back to Products",      callback_data="menu_products")],
    ]
    await query.edit_message_text(
        f"{product['emoji']} *{product['name']}*\n\n"
        f"💵 Price: *${price:.0f} USD*\n\n"
        f"Select your payment method:",
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


async def handle_crypto_payment(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    # Crypto payment logic will be wired in Step 2 (NOWPayments integration)
    await query.edit_message_text(
        "⏳ *Payment coming soon*\n\nCrypto checkout is being set up. Check back shortly!",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("⬅️ Back", callback_data="menu_products")]]),
    )


def build_application() -> Application:
    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("menu", show_products))
    app.add_handler(CallbackQueryHandler(show_main_menu,      pattern="^menu_main$"))
    app.add_handler(CallbackQueryHandler(show_products,       pattern="^menu_products$"))
    app.add_handler(CallbackQueryHandler(show_orders,         pattern="^menu_orders$"))
    app.add_handler(CallbackQueryHandler(show_support,        pattern="^menu_support$"))
    app.add_handler(CallbackQueryHandler(show_product_detail, pattern="^buy_"))
    app.add_handler(CallbackQueryHandler(handle_crypto_payment, pattern="^pay_"))
    return app
