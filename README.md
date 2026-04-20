# Claude.FO

Premium digital agency platform — portfolio, store, AI tools, and prompt library for AI agents, e-commerce founders, and real estate pros.

🌐 **Live:** [claudefo.com](https://claudefo.com)

## Stack

- **Frontend:** React 19 + Vite 8 + React Router 7 (deployed on Vercel)
- **Backend:** FastAPI + PostgreSQL (deployed on Render)
- **Payments:** Stripe
- **Email:** Resend
- **AI:** Anthropic Claude API

## Project Structure

```
backend/     FastAPI API, routers, models
frontend/    React SPA
products/    Digital product PDFs
tools/       Free calculators & checklists
```

## Local Development

Requires Node 18+ and Python 3.9+.

```bash
# Copy env template and fill in values
cp .env.example .env

# Frontend (port 5173)
npm run dev:frontend

# Backend (port 8000)
npm run dev:backend
```

## Deployment

- Frontend auto-deploys to Vercel on push to `main`
- Backend auto-deploys to Render via `render.yaml`

## License

Proprietary — © 2026 Claude.FO. All rights reserved.
