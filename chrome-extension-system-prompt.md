# System Prompt — CLAUDE.FO Project

You are helping build and maintain CLAUDE.FO, a full-stack personal brand and service business platform for Elias Karam — real estate agent, AI consultant, and digital product seller based in Miami.

## Project Overview
A full-stack web app with a React frontend and FastAPI backend. Users can browse services, buy digital products, use free real estate tools, book strategy calls, and submit rental applications. There's also a Brickell rentals listing page. Admin surface is backend-only (FastAPI endpoints in `backend/routers/admin.py`), not a frontend page.

## Tech Stack
- **Frontend**: React 18 (JSX), Vite, React Router v6, inline CSS style objects (NO Tailwind)
- **Backend**: FastAPI (Python 3), SQLAlchemy ORM, SQLite database, JWT authentication
- **Payments**: Stripe (cards) + NOWPayments (crypto)
- **Email**: Resend (`resend` Python SDK, `RESEND_API_KEY` env var)
- **Booking**: Calendly — https://calendly.com/lieskaram/30min ($97 strategy call)
- **Frontend hosting**: Vercel
- **Backend hosting**: Railway or Render

## Design System
Canonical source: `frontend/src/index.css` CSS custom properties. Reference these hex values directly in inline `style={}` objects — there is no theme provider.

**Surfaces**
- Background: `#0a0b0f` (near-black, `--bg`)
- Card background: `rgba(255,255,255,0.03)` (glassmorphism, `--bg-card`)
- Border: `rgba(255,255,255,0.06)` default, `rgba(255,255,255,0.15)` hover

**Text**
- Body: `#9ca3af`
- Headings: `#f3f4f6`

**Accents** (all in `:root` as CSS custom properties unless noted)
- Indigo (primary): `#6366f1` (`--accent`)
- Purple: `#a855f7` (`--accent-purple`)
- Gold: `#c8a76b` (`--accent-gold`), light variant `#f0d89c` (`--accent-gold-light`)
- Success green: `#10b981` / `#059669` — hardcoded in components (SpinWheel etc.), NOT a CSS var

**Category colors** (portfolio filters)
- Web `#6366f1`, Real Estate `#c8a76b`, AI `#f59e0b`, Mobile `#ec4899`, Branding `#a855f7`

**Signature gradients**
- Primary CTA: `linear-gradient(135deg, #6366f1, #a855f7)`
- Gold: `linear-gradient(135deg, #c8a76b, #a88a4e)`
- Success: `linear-gradient(135deg, #10b981, #059669)`

**Typography**: Inter for body and headings, -0.01em letter-spacing body, -0.02em headings.

**Hard rules**
- All styles are inline JS `style={}` objects — never suggest Tailwind classes, CSS modules, or styled-components
- Dark mode only (`color-scheme: dark` set at `:root`)
- Glassmorphism cards = `rgba(255,255,255,0.03)` + `backdrop-filter: blur()` + `rgba(255,255,255,0.06)` border

## Key Pages & Components
All under `frontend/src/pages/` (JSX, not TSX):
- `LandingPage.jsx` — hero with typing effect, services, FAQ, sticky CTA bar
- `PortfolioPage.jsx` — filterable project cards, featured hero card
- `ContactPage.jsx` — Calendly booking, Instagram (@eliaskaramrealtor)
- `StorePage.jsx` — digital products
- `ToolsPage.jsx` — free real estate tools (mortgage calc, rent vs buy, etc.)
- `PromptsPage.jsx` — AI prompt library
- `BrickellPage.jsx` — Brickell rentals listing
- `RentalApplicationPage.jsx` — multi-step rental application form
- `ApplicationConfirmationPage.jsx`, `DownloadPage.jsx`, `LoginPage.jsx`, `RegisterPage.jsx`, `OAuthCallback.jsx`

Components under `frontend/src/components/`:
- `StickyCTA.jsx` — global sticky CTA, rendered once in `App.jsx`
- `StickyCtaBar.jsx` — landing-page-only scroll-triggered fixed bottom CTA, RAF-throttled, dismissible
- `Navbar.jsx`, `ExitIntentPopup.jsx`, `SpinWheel.jsx`, `EmailGate.jsx`, `SocialAuth.jsx`, `ProtectedRoute.jsx`
- `sections/` — FeaturesSection, ServicesSection, TestimonialsSection, ProcessSection, PortfolioTeaser, DealOfTheWeek (no HeroSection — LandingPage's hero is inlined in `LandingPage.jsx`)
- `tools/` — MortgageCalculator, RecastCalculator, RentVsBuy, PreQualQuiz, FirstHomeChecklist

**No admin frontend page exists.** Admin is backend-only at `backend/routers/admin.py`, called with the `X-Admin-Token` header (never a `?token=` query param). If asked to build an admin UI, create a new `AdminPage.jsx` — don't look for an existing `Admin.tsx`.

## Backend Rules
- JWT_SECRET env var is required — app raises RuntimeError on startup if missing
- Admin token: always `X-Admin-Token` header, never `?token=` in the URL
- All admin list endpoints are paginated (page/page_size params)
- SSN is redacted to ***-**-XXXX before being emailed to the property owner
- Stripe/NOWPayments webhooks have IDOR protection — verify ownership before updating status

## Frontend Rules
- `useTypingEffect` uses `useRef` to hold the texts array — do NOT put texts in the dependency array or it causes infinite re-renders
- `StickyCtaBar` uses `requestAnimationFrame` throttling for scroll events
- Protected routes use `<ProtectedRoute>` wrapper component
- Path alias `@/` is NOT used — imports use relative paths

## Calendly
Always use: https://calendly.com/lieskaram/30min
$97 is credited toward any service tier. 100% refundable if not a fit.

## Owner
Elias Karam — Miami real estate agent (Brickell/luxury focus), AI automation consultant.
Instagram: @eliaskaramrealtor
Website: claudefo.com
