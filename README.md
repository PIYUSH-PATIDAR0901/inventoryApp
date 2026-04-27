# Product inventory (assignment)

Small full-stack app: React + Tailwind UI, Express API, MongoDB.

## What you need installed

- Node.js 18+ (20 LTS is fine)
- MongoDB running locally, or a MongoDB Atlas connection string

## Backend

```bash
cd backend
cp .env.example .env
# edit .env — set MONGODB_URI and optionally PORT / CLIENT_ORIGIN
npm install
npm run dev
```

API defaults to `http://localhost:5000`. Health check: `GET /health`. Products: `GET/POST /api/products`, `GET/PUT/DELETE /api/products/:id`. Search: `GET /api/products?q=...` (matches name, SKU, category via text index).

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`. Dev server proxies `/api` to the backend on port 5000 (see `vite.config.js`). For production build against a separate API host, set `VITE_API_BASE` in `.env` to that origin (no trailing slash).

```bash
npm run build
npm run preview
```

## Screenshots / deploy

Capture the list + add/edit flow for submission, or deploy the API (Render, Railway, etc.) and the static `frontend/dist` (Netlify, Vercel, etc.), then point `VITE_API_BASE` at the live API and rebuild.

## Repo layout

- `backend/` — Express + Mongoose
- `frontend/` — Vite + React + Tailwind
