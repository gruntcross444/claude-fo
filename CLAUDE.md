# CLAUDE.FO — Project Context

## What This Is
A full-stack personal brand website and service business platform for Elias Karam — real estate agent, AI consultant, and digital product seller.

## Stack
- **Frontend**: React 18 (JSX), Vite, vanilla CSS (inline styles + CSS-in-JS objects), React Router v6
- **Backend**: FastAPI (Python), SQLAlchemy ORM, SQLite (`app.db`), JWT auth
- **Payments**: NOWPayments (crypto), Stripe (cards)
- **Email**: Resend (`resend` Python SDK, `RESEND_API_KEY` env var)
- **Hosting**: Vercel (frontend) + Railway/Render (backend)
- **Booking**: Calendly — `https://calendly.com/lieskaram/30min`

## Project Structure
```
CLAUDE.FO/
  frontend/src/
    pages/
      LandingPage.jsx       — hero, FAQ, services, tools teaser, sticky CTA
      PortfolioPage.jsx     — project cards with filter, featured hero card
      ContactPage.jsx       — Calendly booking, social links (Instagram: eliaskaramrealtor)
      StorePage.jsx         — digital products for sale
      ToolsPage.jsx         — free tools hub
      PromptsPage.jsx       — AI prompt library
      BrickellPage.jsx      — Brickell rentals listing page
      RentalApplicationPage.jsx
      ApplicationConfirmationPage.jsx
      LoginPage.jsx / RegisterPage.jsx
      DownloadPage.jsx
      OAuthCallback.jsx
    components/
      Navbar.jsx
      StickyCtaBar.jsx      — landing-page-only scroll-triggered fixed bottom bar, RAF-throttled, dismissible
      ExitIntentPopup.jsx
      SpinWheel.jsx
      EmailGate.jsx
      SocialAuth.jsx
      ProtectedRoute.jsx
      sections/              — LandingPage's hero is inlined in LandingPage.jsx; no HeroSection.jsx
        FeaturesSection.jsx, ServicesSection.jsx
        TestimonialsSection.jsx, ProcessSection.jsx, PortfolioTeaser.jsx
        DealOfTheWeek.jsx
      tools/
        MortgageCalculator.jsx, RecastCalculator.jsx, RentVsBuy.jsx
        PreQualQuiz.jsx, FirstHomeChecklist.jsx
    hooks/
      useTypingEffect.jsx   — animated typing, uses useRef to avoid infinite loops
      useScrollReveal.jsx
      useCounter.jsx
    context/
      AuthContext.jsx
    i18n/
      LanguageContext.jsx

  backend/
    main.py                 — FastAPI app, CORS, rate limiting (slowapi)
    auth.py                 — JWT (raises RuntimeError if JWT_SECRET missing)
    models.py               — SQLAlchemy models
    schemas.py              — Pydantic validation (password: 8+ chars, letter + number)
    emails.py               — Resend email engine (SSN redacted to last-4 before sending)
    nowpayments.py          — crypto payment webhooks
    database.py
    dependencies.py
    routers/
      auth.py               — register/login
      admin.py              — paginated lead/order/user/app lists, X-Admin-Token header
      payments.py           — Stripe + NOWPayments webhooks, IDOR protection
      leads.py
      contact.py
      applications.py       — rental applications
      telegram_bot.py
      email_cron.py
```

## Design System
Canonical source: `frontend/src/index.css` (CSS custom properties on `:root`). Inline `style={}` objects in components should reference these hex values directly — there is no theme provider.

**Base surfaces**
- `--bg`: `#0a0b0f` — page background (near-black)
- `--bg-card`: `rgba(255,255,255,0.03)` — glassmorphism card background
- `--border`: `rgba(255,255,255,0.06)` — default card border
- `--border-hover`: `rgba(255,255,255,0.15)` — hover/focus border

**Text**
- `--text`: `#9ca3af` — body copy
- `--text-h`: `#f3f4f6` — headings (h1/h2/h3 override in index.css)

**Accents**
- `--accent`: `#6366f1` — primary indigo (links, focus rings, gradient start)
- `--accent-purple`: `#a855f7` — secondary purple (gradient end)
- `--accent-gold`: `#c8a76b` — tan/gold (real estate, premium CTAs)
- `--accent-gold-light`: `#f0d89c` — gold highlight
- Success green: `#10b981` (→ `#059669` darker) — hardcoded in components (e.g. SpinWheel), NOT a CSS custom property

**Category colors** (used in PortfolioPage filters / tags)
- `--cat-web`: `#6366f1` (indigo)
- `--cat-realestate`: `#c8a76b` (gold)
- `--cat-ai`: `#f59e0b` (amber)
- `--cat-mobile`: `#ec4899` (pink)
- `--cat-branding`: `#a855f7` (purple)

**Signature gradients**
- Primary CTA: `linear-gradient(135deg, #6366f1, #a855f7)`
- Premium rainbow: `linear-gradient(135deg, #6366f1, #a855f7, #c8a76b, #6366f1)`
- Gold button: `linear-gradient(135deg, #c8a76b, #a88a4e)`
- Success button: `linear-gradient(135deg, #10b981, #059669)`

**Typography**
- Font stack: `'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif` (both sans and headings)
- Monospace: `ui-monospace, 'Cascadia Code', Consolas, monospace`
- Letter spacing: `-0.01em` body, `-0.02em` headings
- Scale: `--text-xs` 0.72rem, `--text-sm` 0.82rem, `--text-base` 0.95rem, `--text-lg` 1.05rem, `--text-xl` 1.3rem

**Rules**
- All component styling via inline JS `style={}` objects — NO Tailwind, NO CSS modules, NO styled-components
- Glassmorphism cards: `--bg-card` background + `backdrop-filter: blur()` + `--border`
- `color-scheme: dark` is set at `:root` — dark mode is the only mode

## Key Business Logic
- **Auth**: JWT tokens, protected routes via ProtectedRoute component
- **Admin**: Token via `X-Admin-Token` header (NOT query param), rate-limited 30/min, all lists paginated
- **Payments**: Stripe for cards, NOWPayments for crypto. IDOR protection on rental app payment status.
- **Rental Applications**: Multi-step form → email to owner → SSN shown as ***-**-XXXX in email
- **Calendly**: `https://calendly.com/lieskaram/30min` — $97 strategy call, credited toward any service

## Important Rules
- No Tailwind — all styles are inline JS objects
- JWT_SECRET must be set in env or app crashes on startup (intentional)
- Admin token goes in `X-Admin-Token` header, never in the URL
- useTypingEffect uses `textsRef` (not texts in dep array) to prevent infinite re-renders
- StickyCtaBar uses RAF throttling for scroll events (not raw scroll listener)
- Favicon is a custom branded SVG at `frontend/public/favicon.svg` — rounded-rect background (`#0d0d14`→`#13131f` gradient), indigo-purple "C" (`#6366f1`→`#a855f7` gradient), gold dot accent (`#c8a76b`)
- There is NO admin frontend page — admin surface is backend-only at `backend/routers/admin.py`, hit with an `X-Admin-Token` header from curl / Postman / a future dashboard
- Path alias `@/` is NOT configured — all frontend imports use relative paths (`../components/...`)

## Owner
Elias Karam — real estate agent (Miami/Brickell focus), AI automation consultant, digital product seller.
Instagram: @eliaskaramrealtor
