# GigFlow – Smart Leads Dashboard

A production-ready CRM-style MERN dashboard for managing sales leads with JWT authentication, role-based access control, advanced filtering, backend pagination, debounced search, and CSV export.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, TypeScript, Tailwind CSS v4, React Router, Axios, TanStack React Query, React Hook Form, Zod |
| Backend | Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt |
| DevOps | Docker, Docker Compose, Nginx |

## Features

- **Authentication**: Register, login, JWT tokens, protected routes
- **Roles**: Admin (full access + CSV export + delete) and Sales User (create, view/update assigned leads only)
- **Leads CRUD**: Create, read, update, delete with validation
- **Filtering**: Combined status, source, name/email search, sort (latest/oldest) — all work together
- **Pagination**: Server-side only, 10 records per page with metadata
- **Debounced search**: 400ms delay on the frontend
- **Dashboard**: Total, Qualified, Contacted, Lost lead statistics
- **Dark mode**: Toggle in the navbar
- **UI**: Sidebar, responsive tables, toasts, delete confirmation modal, loading skeletons, empty states

## Project Structure

```
Assinment/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── models/
│       ├── services/
│       ├── utils/
│       ├── validators/
│       ├── interfaces/
│       └── types/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       ├── services/
│       ├── context/
│       ├── types/
│       ├── utils/
│       └── routes/
├── docker-compose.yml
└── README.md
```

## Quick Start (Local)

### Prerequisites

- Node.js 20+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm install
npm run dev
```

API runs at `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

App runs at `http://localhost:5173`

### 3. Docker (all services)

```bash
# From project root
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: localhost:27017

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `CLIENT_URL` | Frontend URL for CORS |
| `NODE_ENV` | `development` or `production` |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:5000/api`) |

## API Documentation

Base URL: `{API_URL}/api`

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register user |
| POST | `/auth/login` | No | Login, returns JWT |
| GET | `/auth/me` | Yes | Current user profile |
| GET | `/auth/users` | Yes | List users (for assign dropdown) |

**Register body:**
```json
{
  "name": "Jane Admin",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "Admin"
}
```

**Login body:**
```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "name": "...", "email": "...", "role": "Admin" }
  }
}
```

### Leads

All lead routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/leads/stats` | Any | Dashboard statistics |
| GET | `/leads/export` | Admin | Export filtered leads as CSV |
| GET | `/leads` | Any | Paginated list with filters |
| GET | `/leads/:id` | Any* | Single lead details |
| POST | `/leads` | Any | Create lead |
| PUT | `/leads/:id` | Any* | Update lead |
| DELETE | `/leads/:id` | Admin | Delete lead |

\*Sales users can only view/update leads assigned to them.

**Query parameters (GET `/leads`, GET `/leads/export`):**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `status` | string | `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | `Website`, `Instagram`, `Referral` |
| `search` | string | Search name or email |
| `sort` | string | `latest` or `oldest` |

**Example:**
```
GET /api/leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1
```

**Paginated response:**
```json
{
  "success": true,
  "data": [/* lead objects */],
  "currentPage": 1,
  "totalPages": 5,
  "totalRecords": 42,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

**Create lead body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram",
  "assignedTo": "<user_object_id>"
}
```

### Health Check

```
GET /api/health
```

## Role Permissions

| Action | Admin | Sales User |
|--------|-------|------------|
| Create leads | ✅ | ✅ |
| View all leads | ✅ | Assigned only |
| Update leads | ✅ | Assigned only |
| Delete leads | ✅ | ❌ |
| Export CSV | ✅ | ❌ |

## Deployment

**Full step-by-step guide:** see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Database — MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Copy the connection string into `MONGO_URI`

### Backend — Render / Railway

1. Connect your repository
2. Set root directory to `backend`
3. Build: `npm install && npm run build`
4. Start: `npm start`
5. Add environment variables from `.env.example`

### Frontend — Vercel

1. Import the repository
2. Set root directory to `frontend`
3. Add `VITE_API_URL` pointing to your deployed API (e.g. `https://your-api.onrender.com/api`)
4. Build command: `npm run build`
5. Output directory: `dist`

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| backend | `npm run dev` | Development with hot reload |
| backend | `npm run build` | Compile TypeScript |
| backend | `npm start` | Run production build |
| frontend | `npm run dev` | Vite dev server |
| frontend | `npm run build` | Production build |

## License

MIT
