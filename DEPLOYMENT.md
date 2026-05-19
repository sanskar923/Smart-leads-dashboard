# Deploy GigFlow (Production)

Deploy stack:
- **Database:** MongoDB Atlas (free tier)
- **Backend:** Render Web Service
- **Frontend:** Vercel

Your GitHub repo: `https://github.com/sanskar923/Smart-leads-dashboard`

---

## Step 1 — MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a **free M0 cluster**.
3. **Database Access** → Add user (username + password). Save credentials.
4. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) for cloud hosting.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string.

Example:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/gigflow?retryWrites=true&w=majority
```

Replace `USERNAME`, `PASSWORD`, and use database name `gigflow`.

---

## Step 2 — Push latest code to GitHub

```bash
cd /Users/rounikadlak/Desktop/Assinment
git add .
git commit -m "Prepare GigFlow for production deployment"
git push origin main
```

---

## Step 3 — Deploy backend on Render

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. **New +** → **Web Service** → connect `Smart-leads-dashboard`.
3. Settings:

| Setting | Value |
|---------|--------|
| **Name** | `gigflow-api` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

4. **Environment Variables:**

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | Your Atlas connection string |
| `JWT_SECRET` | Long random string (e.g. from `openssl rand -base64 32`) |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | `https://YOUR-APP.vercel.app` (set after Step 4, then redeploy) |

5. Click **Create Web Service** and wait for deploy.

6. Copy your API URL, e.g. `https://gigflow-api.onrender.com`

7. Test: `https://gigflow-api.onrender.com/api/health`

> Free Render services sleep after ~15 min idle. First request may take 30–60 seconds.

---

## Step 4 — Deploy frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New Project** → import `Smart-leads-dashboard`.
3. Settings:

| Setting | Value |
|---------|--------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

4. **Environment Variable:**

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://gigflow-api.onrender.com/api` |

Use your actual Render URL from Step 3.

5. Click **Deploy**.

6. Copy your Vercel URL, e.g. `https://smart-leads-dashboard.vercel.app`

---

## Step 5 — Connect frontend ↔ backend (CORS)

1. In **Render** → your service → **Environment**:
   - Set `CLIENT_URL` to your Vercel URL (no trailing slash):
     ```
     https://smart-leads-dashboard.vercel.app
     ```
2. **Save** and trigger **Manual Deploy** (or wait for auto-redeploy).

CORS also allows any `*.vercel.app` preview URL automatically.

---

## Step 6 — Verify production

1. Open your Vercel URL.
2. **Register** a new Admin account.
3. Create a lead and check the dashboard.

If login fails:
- Confirm `VITE_API_URL` ends with `/api`
- Confirm Render `MONGO_URI` is correct and Atlas allows `0.0.0.0/0`
- Check Render logs for errors

---

## Environment summary

### Render (backend)

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://...
JWT_SECRET=<strong-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-app.vercel.app
```

### Vercel (frontend)

```
VITE_API_URL=https://gigflow-api.onrender.com/api
```

---

## Optional: Railway instead of Render

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub.
2. Set root to `backend`, start: `npm start`, build: `npm run build`.
3. Add the same env vars as Render.
4. Use the Railway public URL in `VITE_API_URL`.

---

## Custom domain (optional)

- **Vercel:** Project → Settings → Domains
- **Render:** Service → Settings → Custom Domains

Update `CLIENT_URL` and `VITE_API_URL` to match your domains.
