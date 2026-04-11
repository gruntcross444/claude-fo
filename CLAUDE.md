## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current

---

# CLAUDE.FO — Project Context

## What This Is
A full-stack personal brand website and service business platform for Elias Karam — real estate agent, AI consultant, and digital product seller.

## Stack
- **Frontend**: React 18 (JSX), Vite, vanilla CSS (inline styles + CSS-in-JS objects), React Router v6
- **Backend**: FastAPI (Python), SQLAlchemy ORM, SQLite (`app.db`), JWT auth
- **Payments**: NOWPayments (crypto), Stripe (cards)
- **Email**: SendGrid
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
    components/
      Navbar.jsx
      StickyCtaBar.jsx      — scroll-triggered fixed bottom bar, dismissible
      ExitIntentPopup.jsx
      SpinWheel.jsx
      EmailGate.jsx
      SocialAuth.jsx
      ProtectedRoute.jsx
      sections/
        HeroSection.jsx, FeaturesSection.jsx, ServicesSection.jsx
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
    emails.py               — SendGrid email (SSN redacted to last-4 before sending)
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
- Dark theme throughout: `#0A0E27` (deep navy), `#0d1117` (near-black)
- Primary green: `#22D68A` / `#00ff88`
- Gold accent: `#D4A853`
- Purple/indigo accents for some sections
- All styling via inline style objects — NO Tailwind, NO CSS modules
- Glassmorphism cards: `rgba(255,255,255,0.03)` background + blur

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
- Favicon is a custom branded SVG (dark square, indigo "C", gold dot)

## Owner
Elias Karam — real estate agent (Miami/Brickell focus), AI automation consultant, digital product seller.
Instagram: @eliaskaramrealtor
