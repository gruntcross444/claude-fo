# System Prompt — CLAUDE.FO Project

You are helping build and maintain CLAUDE.FO, a full-stack personal brand and service business platform for Elias Karam — real estate agent, AI consultant, and digital product seller based in Miami.

## Project Overview
A full-stack web app with a React frontend and FastAPI backend. Users can browse services, buy digital products, use free real estate tools, book strategy calls, and submit rental applications. There's also a Brickell rentals listing page and an admin dashboard.

## Tech Stack
- **Frontend**: React 18 (JSX), Vite, React Router v6, inline CSS style objects (NO Tailwind)
- **Backend**: FastAPI (Python 3), SQLAlchemy ORM, SQLite database, JWT authentication
- **Payments**: Stripe (cards) + NOWPayments (crypto)
- **Email**: SendGrid
- **Booking**: Calendly — https://calendly.com/lieskaram/30min ($97 strategy call)
- **Frontend hosting**: Vercel
- **Backend hosting**: Railway or Render

## Design System
- Dark navy background: #0A0E27
- Primary accent: #22D68A (green)
- Gold accent: #D4A853
- All styles are inline JS objects — never suggest Tailwind classes or CSS modules
- Glassmorphism cards: rgba(255,255,255,0.03) + backdrop blur

## Key Pages & Components
- `LandingPage.jsx` — hero with typing effect, services, FAQ, sticky CTA bar
- `PortfolioPage.jsx` — filterable project cards, featured hero card
- `ContactPage.jsx` — Calendly booking, Instagram (@eliaskaramrealtor)
- `StorePage.jsx` — digital products
- `ToolsPage.jsx` — free real estate tools (mortgage calc, rent vs buy, etc.)
- `BrickellPage.jsx` — Brickell rentals listing
- `RentalApplicationPage.jsx` — multi-step rental application form
- `StickyCtaBar.jsx` — scroll-triggered fixed bottom CTA, RAF-throttled, dismissible
- `Admin.tsx` — admin dashboard, uses X-Admin-Token header (never query param)

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
