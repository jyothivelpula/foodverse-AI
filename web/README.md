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

Deploy the `web/dist` folder to Vercel, Netlify, Cloudflare Pages, etc. Point `VITE_API_URL` at your hosted FastAPI API.

### Vercel SPA refresh fix

`web/vercel.json` rewrites all routes to `index.html` so refreshing `/orders`, `/chef`, etc. works. Set the Vercel project **Root Directory** to `web`, then redeploy.

## Notes

- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me` (JWT includes `role`: `customer` | `chef`).
- AI Lounge still uses `GET /health` and `POST /chat`.
- Demo users (after `python seed_users.py`): `customer@foodverse.com` / `chef@foodverse.com` — password `password123`.
- The older Streamlit UI remains in `frontend/` if you still need it.
