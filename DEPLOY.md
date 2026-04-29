# Deployment Guide

Backend → Render. Frontend → Vercel.

## Prerequisites
- MongoDB Atlas: Network Access set to **0.0.0.0/0** (Allow Access from Anywhere). Render uses dynamic IPs.
- GitHub repo pushed: `kiranworkmail2026-lang/portfolio-manager`
- Render account linked to GitHub
- Vercel account linked to GitHub

---

## Step 1 — Deploy backend to Render

1. https://dashboard.render.com → **New → Web Service**
2. Pick repo `portfolio-manager`
3. Fill in:
   - **Name**: `portfolio-manager-api` (or anything; URL will be `https://<name>.onrender.com`)
   - **Region**: closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Go`
   - **Build Command**: `go build -o app main.go`
   - **Start Command**: `./app`
   - **Instance Type**: Free
4. **Environment Variables** (click Advanced → Add Environment Variable):
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = `84a1bce4e1bc664171d01db1ec3c211e720dda51c9fa838f5b6cc2bde6b27036` (or any 64-char random string)
   - `CLIENT_URL` = `http://localhost:3000` (we'll update this after Vercel deploys)
   - `ENV` = `production`
   - `PORT` = `8080`
5. **Create Web Service**. Wait ~3-5 min for first build.
6. Once deployed, hit `https://<your-render-url>.onrender.com/api/health` — should return `{"data":{"status":"ok"}}`

**Save the Render URL** — you'll need it for Vercel.

---

## Step 2 — Deploy frontend to Vercel

1. https://vercel.com/new → import `portfolio-manager`
2. Fill in:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `client`
   - **Build/Output**: leave defaults
3. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = your Render URL from Step 1 (e.g. `https://portfolio-manager-api.onrender.com`)
4. **Deploy**. Wait ~2 min.
5. Once deployed, **save the Vercel URL** (e.g. `https://portfolio-manager.vercel.app`).

---

## Step 3 — Update Render with Vercel URL

1. Render dashboard → your service → **Environment**
2. Edit `CLIENT_URL` → set to your Vercel URL (e.g. `https://portfolio-manager.vercel.app`)
   - You can include localhost too, comma-separated: `https://portfolio-manager.vercel.app,http://localhost:3000`
3. **Save Changes** — triggers a redeploy (~2 min)

---

## Step 4 — Test production

1. Visit your Vercel URL
2. Register a new account
3. Upload `sample_portfolio.xlsx`
4. Verify dashboard renders charts

## Notes
- Render free tier sleeps after 15 min of inactivity. First request after sleep takes ~30-60s to spin up.
- Auto-deploys are wired up: any push to `main` triggers redeploys on both platforms.
- Cookies use `Secure=true; SameSite=None` in production (set via `ENV=production`), required for cross-domain auth between Vercel and Render.
