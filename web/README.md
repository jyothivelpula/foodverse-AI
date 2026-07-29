# FoodVerse Web (React)

Modern React frontend for FoodVerse AI. Talks to the existing FastAPI backend for health checks and AI chat. Menu, cart, checkout, and tracking use client-side state (same behavior as the Streamlit demo).

## Stack

- Vite + React
- Tailwind CSS v4
- React Router
- Framer Motion
- Zustand (persisted cart / chat / profile)

## Run locally

```bash
# Terminal 1 — backend (from repo/backend)
python -m uvicorn app.main:app --reload

# Terminal 2 — React app (from repo/web)
npm install
npm run dev
```

Open http://localhost:5173

Optional env (`web/.env`):

```
VITE_API_URL=http://127.0.0.1:8000
```

## Build for deployment

```bash
npm run build
npm run preview
```

Deploy the `web/dist` folder to Vercel, Netlify, Cloudflare Pages, etc.

### Vercel setup (important)

1. Project **Root Directory**: leave empty (repo root) *or* set to `web`
2. Environment (Build) — set either:
   - `VITE_API_URL=https://foodverse-ai-geef.onrender.com`  ← recommended
   - or leave unset (app defaults to that Render URL on `*.vercel.app`)
3. Do **not** set `VITE_API_URL` to `/api` unless root `vercel.json` rewrites are confirmed working
4. Redeploy after changing env vars (Vite bakes `VITE_*` at **build** time)

Working backend: `https://foodverse-ai-geef.onrender.com/health` must show `"database":"ok"`.

### Render setup

- `DATABASE_URL` = Supabase **Session pooler** URI (`postgres.PROJECT_REF@…pooler.supabase.com`)
- `GROQ_API_KEY` required for chat
- SMTP vars (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`) for password-reset OTP emails
- Free tier sleeps when idle — open `/health` once to wake it

## Notes

- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me` (JWT includes `role`: `customer` | `chef`).
- Password reset OTP: `/forgot-password` → `/verify-otp` → `/reset-password` (API: `POST /auth/forgot-password`, `/auth/verify-otp`, `/auth/resend-otp`, `/auth/reset-password`).
- AI Lounge still uses `GET /health` and `POST /chat`.
- Demo users (after `python seed_users.py`): `customer@foodverse.com` / `chef@foodverse.com` — password `password123`.
- The older Streamlit UI remains in `frontend/` if you still need it.
