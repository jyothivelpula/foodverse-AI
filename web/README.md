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

1. Project **Root Directory** = `web`
2. Environment variable (Build):
   - Prefer: `VITE_API_URL=/api`  
   - Or **remove** `VITE_API_URL` if it was set to `https://….onrender.com`  
   - Do **not** leave a full Render URL — the browser will call it cross-origin and often fail with “Cannot reach API”
3. `web/vercel.json` proxies `/api/*` → `https://foodverse-ai-1.onrender.com/*` and rewrites SPA routes to `index.html`
4. Redeploy after changing env vars (Vite bakes `VITE_*` at **build** time)

### Render setup

- `DATABASE_URL` must be your Render **Postgres** URL (not localhost)
- After DB is connected: run `python create_tables.py` and `python seed_users.py` (Render shell or one-off job)
- `GROQ_API_KEY` required for chat
- Free tier sleeps when idle — open `/health` once to wake it

## Notes

- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me` (JWT includes `role`: `customer` | `chef`).
- AI Lounge still uses `GET /health` and `POST /chat`.
- Demo users (after `python seed_users.py`): `customer@foodverse.com` / `chef@foodverse.com` — password `password123`.
- The older Streamlit UI remains in `frontend/` if you still need it.
