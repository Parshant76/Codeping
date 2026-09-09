# CodePing – Coding Contest Aggregator

A full-stack **MERN** application that aggregates live coding contests from **Codeforces**, **LeetCode**, **CodeChef**, and **AtCoder**, with automated **email reminders** via NodeMailer and CRON scheduling.

Built to match the resume project by **Parshant Garg** (NIT Jalandhar · FNZ · Expedia).

---

## What You Need Installed First

Install these **before** starting (one-time setup):

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18+ (LTS recommended) | https://nodejs.org |
| **MongoDB** | 6+ (local) **OR** MongoDB Atlas (cloud) | https://www.mongodb.com/try/download/community |
| **Git** | Any recent version | https://git-scm.com/downloads |

Verify installation (open PowerShell or Terminal):

```powershell
node -v
npm -v
mongod --version
```

If `mongod` is not found, either install MongoDB locally or use MongoDB Atlas (free tier) — steps below.

---

## Project Structure

```
codeping/
├── backend/          ← Process 1: Express API + CRON + Email
├── frontend/         ← Process 2: React dashboard (Vite)
├── README.md         ← Setup guide (this file)
└── ARCHITECTURE.md   ← How everything works, file flows, learning topics
```

---

## Quick Start (Local – 2 Processes)

You will run **two separate terminals**:

1. **Terminal 1** → Backend API (port `5000`)
2. **Terminal 2** → Frontend UI (port `5173`)

### Step 1: Clone / Open the Project

```powershell
cd C:\Users\Parsh\Projects\codeping
```

### Step 2: Set Up MongoDB

**Option A – Local MongoDB (Windows)**

1. Install MongoDB Community Server.
2. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
3. Default connection string:
   ```
   mongodb://127.0.0.1:27017/codeping
   ```

**Option B – MongoDB Atlas (Cloud, no local install)**

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster.
3. Database Access → create a user + password.
4. Network Access → add IP `0.0.0.0/0` (for local dev) or your IP.
5. Connect → Drivers → copy connection string, e.g.:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/codeping
   ```

### Step 3: Configure Backend Environment

```powershell
cd backend
copy .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codeping
JWT_SECRET=replace_with_a_long_random_string
CLIENT_URL=http://localhost:5173

# Optional – email reminders (skip if you don't need emails yet)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=CodePing <your_email@gmail.com>
```

**Gmail App Password (for email reminders):**

1. Enable 2-Factor Authentication on Google account.
2. Google Account → Security → App passwords.
3. Generate password for "Mail" → paste into `EMAIL_PASS`.

> If email is not configured, the app still works — reminders are saved in DB but emails are skipped.

### Step 4: Install Backend Dependencies

```powershell
cd C:\Users\Parsh\Projects\codeping\backend
npm install
```

### Step 5: (Optional) Create Demo User

```powershell
npm run seed
```

Demo credentials:
- Email: `demo@codeping.dev`
- Password: `demo123`

### Step 6: Start Process 1 – Backend

```powershell
cd C:\Users\Parsh\Projects\codeping\backend
npm run dev
```

You should see:

```
MongoDB connected
Running startup contest sync...
CodePing API running on http://localhost:5000
```

Test in browser: http://localhost:5000/api/health

### Step 7: Configure & Start Process 2 – Frontend

Open a **new terminal**:

```powershell
cd C:\Users\Parsh\Projects\codeping\frontend
copy .env.example .env
npm install
npm run dev
```

Open: **http://localhost:5173**

---

## How to Use the App

1. Open http://localhost:5173
2. Click **Refresh Contests** to fetch latest contests from all platforms.
3. Filter by platform or search by name.
4. **Register** or login with demo account.
5. Click **Set Reminder** on any contest.
6. View reminders at **My Reminders**.
7. Email is sent automatically by CRON job before contest start (if email configured).

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/contests` | No | List contests (`?platform=&search=`) |
| POST | `/api/contests/sync` | No | Manual sync from platforms |
| GET | `/api/reminders` | Yes | User reminders |
| POST | `/api/reminders` | Yes | Create reminder |
| DELETE | `/api/reminders/:id` | Yes | Delete reminder |

---

## Deploy (Production Overview)

### Backend (Render / Railway / Azure)

1. Push repo to GitHub.
2. Create a web service pointing to `backend/`.
3. Set environment variables from `.env.example`.
4. Start command: `npm start`
5. Use MongoDB Atlas for production DB.

### Frontend (Vercel / Netlify)

1. Root directory: `frontend/`
2. Build command: `npm run build`
3. Output: `dist/`
4. Set `VITE_API_URL=https://your-api-domain.com/api`

### Post-deploy checklist

- [ ] Strong `JWT_SECRET`
- [ ] MongoDB Atlas with IP whitelist
- [ ] CORS `CLIENT_URL` set to production frontend URL
- [ ] Gmail/SMTP credentials for reminders

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `MongoDB connection failed` | Start local MongoDB or fix Atlas URI/credentials |
| `EADDRINUSE port 5000` | Kill process using port 5000 or change `PORT` in `.env` |
| No contests showing | Click **Refresh Contests**; check backend logs for API errors |
| Email not sending | Verify Gmail App Password; check `EMAIL_*` vars |
| CORS error | Ensure `CLIENT_URL` in backend `.env` matches frontend URL |

---

## Tech Stack

- **Frontend:** React 18, Vite, React Router, CSS
- **Backend:** Node.js, Express, JWT, bcrypt
- **Database:** MongoDB + Mongoose
- **Integrations:** Axios → Codeforces, LeetCode, CodeChef, AtCoder APIs
- **Automation:** node-cron, Nodemailer

---

## Author

**Parshant Garg**  
B.Tech ECE, NIT Jalandhar · Junior Analyst Developer @ FNZ  
GitHub · LeetCode · parshantgarg50101@gmail.com

For deep technical explanation, read **[ARCHITECTURE.md](./ARCHITECTURE.md)**.
