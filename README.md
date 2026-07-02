# Retention Pulse Dashboard

**AI-Powered Student Retention & Engagement Platform for Martial Arts Academies**

A full-stack application designed to help martial arts coaches identify at-risk students, track attendance patterns, and automate retention workflows. Built with modern Node.js, Express, React/Vite, and SQLite—deployed on Replit with support for Docker containerization.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Security](#security)
- [Deployment](#deployment)
- [Development Workflow](#development-workflow)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

---

## Overview

**Retention Pulse** solves a critical problem for martial arts schools: **student churn**. Without visibility into attendance patterns and engagement risk, coaches lose revenue and brand momentum when students quietly disappear.

This platform provides:

- **Real-time risk scoring** based on attendance trends
- **Automated action tracking** for coach follow-ups
- **Onboarding workflows** with token-based intake forms
- **Class management** with capacity tracking and bookings
- **Copilot integration** for AI-assisted insights
- **Dashboard UI** for coaches to monitor their students

The system auto-seeds with sample data and includes built-in mechanisms for risk recalculation, making it immediately operational for demonstration or production use.

---

## Key Features

### 1. **Student Roster Management**
- Track students by name, email, phone, belt rank, and join date
- Automatic risk classification (low, medium, high) based on attendance
- Student status tracking (active, at-risk, inactive)

### 2. **Attendance Tracking**
- Log class attendance with timestamps and class names
- Query attendance history per student
- Automatic days-since-attendance calculation for risk assessment

### 3. **Risk Recalculation Engine**
- Calculates risk levels based on customizable thresholds:
  - **Low risk**: < 6 days since last class
  - **Medium risk**: 6–9 days without attendance
  - **High risk**: 10+ days without attendance
- Runs on-demand or can be triggered by scheduled jobs

### 4. **Coach Action Tracking**
- Create, view, and manage follow-up actions
- Track action status and due dates
- Link actions to at-risk students

### 5. **Class & Coach Management**
- Recurring and one-off class scheduling
- Coach profiles with specialties
- Class capacity and booking management
- Spots-remaining calculation

### 6. **Onboarding Workflows**
- Multi-step checklist (waiver, intro class, payment, uniform, etc.)
- Token-based intake form submission
- Email-based onboarding invitations
- Track completion milestones

### 7. **AI Copilot Integration**
- `/api/copilot/ask` endpoint for AI-assisted insights
- Sends student risk context to OpenAI
- Returns retention-focused recommendations

---

## Live Demo

**Dashboard:** [https://retention-pulse-dashboard.replit.app/](https://retention-pulse-dashboard.replit.app/)

**API Base:** `https://retention-pulse-dashboard.replit.app/api`

*Sample credentials and data are pre-loaded for testing.*

---

## Tech Stack

### **Backend**
- **Runtime:** Node.js 24+ (supports built-in `node:sqlite`)
- **Framework:** Express.js (REST API)
- **Database:** SQLite 3 with WAL mode
- **Validation:** Input validation at route level
- **Build Tool:** esbuild for production bundling

### **Frontend**
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS (v4)
- **State Management:** TanStack React Query
- **Routing:** Wouter
- **UI Components:** Lucide React icons, Framer Motion

### **DevOps**
- **Package Manager:** pnpm (monorepo-ready)
- **Containerization:** Docker multi-stage build (Node 24-alpine)
- **Orchestration:** docker-compose
- **Deployment:** Replit, Azure (via `azure.yaml`)

### **Supply Chain Security**
- **Minimum Release Age:** 1440 minutes (1 day) to defend against npm exploits
- **Platform Exclusions:** `@replit/*` scoped packages for trusted vendors
- **Platform Optimization:** Linux x64 only; platform-specific binaries excluded

---

## Project Structure

```
Level-Up-Jiutsu/
├── artifacts/
│   ├── api-server/               # Express REST API (production artifact)
│   │   ├── src/
│   │   │   ├── server.mjs        # Express app setup & routes (13 endpoints)
│   │   │   ├── db.mjs            # SQLite schema, queries, seed data
│   │   │   └── build.mjs         # esbuild bundler config
│   │   ├── package.json
│   │   ├── data/
│   │   │   └── retentionpulse.sqlite  # Auto-created on first run
│   │   └── README.md             # API-specific docs
│   │
│   ├── retentionpulse-dashboard/  # Frontend artifact (Vite + React)
│   │   ├── index.html
│   │   ├── index-*.js            # Bundled React app
│   │   ├── index-*.css           # Compiled styles
│   │   └── api-routes.txt        # Extracted endpoint reference
│   │
│   └── retentionpulse             # Replit dev environment pointer
│
├── lib/                           # Shared libraries (when expanded)
│   └── (planned: shared schemas, utilities)
│
├── scripts/                       # Dev utilities
│   └── (seed, lint, typecheck scripts)
│
├── pnpm-workspace.yaml            # Workspace config + supply-chain rules
├── package.json                   # Root workspace config
├── tsconfig.base.json             # TypeScript shared config
├── Dockerfile                     # Multi-stage build (build → runtime)
├── docker-compose.yml             # Local/CI orchestration
├── azure.yaml                     # Azure deployment config
├── threat_model.md                # Security threat analysis
├── portfolio-manifest.json.json   # Author's project portfolio (metadata)
└── README.md                      # This file

```

---

## Getting Started

### Prerequisites

- **Node.js 24+** (for built-in SQLite support)
- **pnpm 9+** (or npm/yarn)
- **Docker & Docker Compose** (optional, for containerized deployment)

### Local Development

#### 1. **Clone & Install**
```bash
git clone https://github.com/richardsbrian86-oss/Level-Up-Jiutsu.git
cd Level-Up-Jiutsu/artifacts/api-server
pnpm install
```

#### 2. **Run the API Server**
```bash
# Development mode (hot reload)
pnpm dev

# Production build + start
pnpm build
pnpm start
```

The API will be available at `http://localhost:3000`.

#### 3. **Verify with Health Check**
```bash
curl http://localhost:3000/healthz
# Response: {"ok":true,"db":"/app/data/retentionpulse.sqlite"}
```

#### 4. **Database Auto-Seeding**
On first run, the database seeds automatically with:
- 10 sample students (various risk levels)
- 2 coaches (with specialties)
- 3 class schedules (recurring + one-off)
- 11 attendance records
- 2 sample action items

**SQLite file location:** `artifacts/api-server/data/retentionpulse.sqlite`

### Docker Deployment

#### **Build & Run Locally**
```bash
docker-compose up --build
# API runs on port 3000
```

#### **Environment Variables**
Create a `.env.docker` file (see `.env.docker.example`):
```env
NODE_ENV=production
PORT=3000
```

---

## API Documentation

### **Base URL**
```
http://localhost:3000/api
```

### **Endpoints**

#### **Students**
```
GET /api/students
```
Returns list of all students with calculated days-since-last-attendance.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Marcus Webb",
    "email": "marcus.webb@email.com",
    "phone": "555-0101",
    "rank": "Blue Belt",
    "join_date": "2026-06-20T18:58:45.551Z",
    "status": "active",
    "risk_level": "low",
    "days_since_last_attendance": 2
  }
]
```

#### **Risk Recalculation**
```
POST /api/risk/recalculate
```
Triggers risk recalculation for all students based on attendance.

**Response:**
```json
{
  "ok": true,
  "updated": 10
}
```

#### **Classes**
```
GET /api/public/schedule
GET /api/classes
```
List all classes with capacity and booking info.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Fundamentals",
    "description": "Core positions and escapes",
    "start_time": "18:30",
    "duration": 60,
    "location": "Main Mat",
    "coach_name": "Coach Reyes",
    "capacity": 20,
    "booked_count": 8,
    "spots_remaining": 12,
    "is_recurring": true,
    "day_of_week": 1
  }
]
```

#### **Book a Class**
```
POST /api/classes/:id/book
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234"
}
```

**Response:**
```json
{
  "class_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234"
}
```

#### **Attendance by Student**
```
GET /api/attendance?student_id=1
```

#### **Actions by Student**
```
GET /api/actions?student_id=1
```

#### **Onboarding Intake**
```
GET /api/intake/:token
POST /api/intake/:token

{
  "waiver_acknowledged": true,
  "waiver_signed_name": "John Doe"
}
```

#### **Copilot Insights**
```
POST /api/copilot/ask
Content-Type: application/json

{
  "prompt": "Which students should I prioritize for outreach?"
}
```

**Response:**
```json
{
  "answer": "Retention summary: 5 of 10 students currently at risk. Prompt received: Which students should I prioritize for outreach?"
}
```

### **Error Handling**
All endpoints return standard HTTP status codes:
- `200` — Success
- `400` — Bad request (missing/invalid params)
- `404` — Resource not found
- `409` — Conflict (e.g., class full)
- `500` — Server error

---

## Architecture

### **Data Flow**

```
┌─────────────────┐
│   React UI      │  (artifacts/retentionpulse-dashboard)
└────────┬────────┘
         │ HTTP/JSON
         ▼
┌─────────────────────────────────────────┐
│    Express REST API (server.mjs)        │
│  ┌─────────────────────────────────────┤
│  │ • Request validation               │
│  │ • Route handlers                   │
│  │ • Business logic routing           │
│  └─────────────────────────────────────┤
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Database Layer (db.mjs)                │
│  ┌─────────────────────────────────────┤
│  │ • Prepared statements              │
│  │ • Transaction management           │
│  │ • Risk recalculation               │
│  │ • Seed data                        │
│  └─────────────────────────────────────┤
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   SQLite Database (retentionpulse.sqlite)
│  ┌─────────────────────────────────────┤
│  │ • students (id, name, risk_level)  │
│  │ • attendance (student_id, date)    │
│  │ • coaches (name, specialty)        │
│  │ • classes (schedule, capacity)     │
│  │ • actions (follow-ups, status)     │
│  │ • onboarding (checklist, tokens)   │
│  └─────────────────────────────────────┤
└─────────────────────────────────────────┘
```

### **Database Schema**

**Students Table:**
```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  rank TEXT,
  join_date TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  risk_level TEXT DEFAULT 'low'
);
```

**Attendance Table:**
```sql
CREATE TABLE attendance (
  id INTEGER PRIMARY KEY,
  student_id INTEGER NOT NULL,
  attended_at TEXT NOT NULL,
  class_name TEXT NOT NULL,
  present INTEGER DEFAULT 1,
  FOREIGN KEY(student_id) REFERENCES students(id)
);
```

**Onboarding Table:**
```sql
CREATE TABLE onboarding (
  student_id INTEGER PRIMARY KEY,
  waiver_signed INTEGER DEFAULT 0,
  intro_class_done INTEGER DEFAULT 0,
  payment_setup INTEGER DEFAULT 0,
  coach_intro_done INTEGER DEFAULT 0,
  uniform_purchased INTEGER DEFAULT 0,
  whatsapp_added INTEGER DEFAULT 0,
  onboarding_complete INTEGER DEFAULT 0,
  completed_at TEXT,
  intake_token TEXT,
  intake_token_expires_at TEXT,
  FOREIGN KEY(student_id) REFERENCES students(id)
);
```

*Full schema defined in `artifacts/api-server/src/db.mjs` (lines 33–115).*

### **Key Design Decisions**

1. **SQLite with WAL Mode** — Enables concurrent reads/writes without heavyweight PostgreSQL setup. Ideal for Replit/edge deployments.

2. **Prepared Statements** — All queries use prepared statements to prevent SQL injection. Helper functions in `db.mjs` enforce this pattern.

3. **Transaction Wrapper** — `runTransaction()` utility ensures atomicity for multi-step operations (risk recalculation, seeding).

4. **Risk Algorithm** — Attendance-based (days since last class) rather than payment/engagement scoring. Simple, deterministic, and easy to explain to coaches.

5. **Token-Based Onboarding** — 7-day expiring tokens for intake forms prevent unauthorized access and simplify stateless verification.

6. **Stateless API** — Express routes are pure functions; no server-side sessions needed. Enables horizontal scaling.

---

## Security

### **Threat Model**

See [`threat_model.md`](./threat_model.md) for detailed analysis covering:

- **Spoofing:** Currently no authentication enforced—all API endpoints are public.
- **Tampering:** No write restrictions; any caller can modify student/attendance/action records.
- **Information Disclosure:** Student roster, attendance history, and risk classifications are publicly readable.
- **Denial of Service:** No rate limiting; `/api/copilot/ask` can trigger unbounded OpenAI API calls.
- **Elevation of Privilege:** No role-based access control (RBAC); coaches and public have equal permissions.

### **Production Recommendations**

To deploy to production, implement:

1. **Authentication** — JWT, OAuth, or session cookies for coaches.
2. **Authorization** — RBAC to restrict data access by role (Admin, Coach, Student).
3. **Rate Limiting** — Per-IP or per-user request throttling.
4. **Input Validation** — Strict schema validation on all inputs (Zod recommended).
5. **HTTPS** — All traffic must be encrypted in transit.
6. **Secrets Management** — Use `.env` files and secure vaults (never commit secrets).
7. **Audit Logging** — Log all state mutations for compliance.
8. **OpenAI Cost Control** — Set API usage limits; consider request sampling.

---

## Deployment

### **Replit (Current)**

The app is deployed at [`retention-pulse-dashboard.replit.app`](https://retention-pulse-dashboard.replit.app/). Replit auto-runs the `.replit` config:

```bash
pnpm --filter @workspace/api-server run dev
```

**Replit Environment:** 8 GB RAM, Node.js 24, auto-HTTPS.

### **Docker to Production**

#### **Build Image**
```bash
docker build -t retention-pulse:latest .
```

#### **Run Container**
```bash
docker run \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -v retention-pulse-data:/app/data \
  retention-pulse:latest
```

#### **Azure Deployment**
Reference `azure.yaml` for ACI/App Service configuration.

### **Environment Variables**

```env
# Required
NODE_ENV=production
PORT=3000

# Optional (for AI features)
OPENAI_API_KEY=sk-...

# Optional (for future expansions)
DATABASE_URL=postgresql://...
```

---

## Development Workflow

### **Local Setup**

```bash
# Install dependencies
pnpm install

# Run TypeScript typecheck (when expanded)
pnpm run typecheck

# Build for production
pnpm run build

# Run tests (when added)
pnpm run test
```

### **Adding New Features**

1. **Add a database query** → `db.mjs` (e.g., new `export function`)
2. **Add a route** → `server.mjs` (e.g., `app.get('/api/new', ...)`)
3. **Test manually** → `curl http://localhost:3000/api/new`
4. **Rebuild** → `pnpm build`
5. **Deploy** → Push to Replit or Docker image

### **Supply Chain Security**

This project enforces a **1-day minimum release age** for all npm packages (see `pnpm-workspace.yaml`). This defense mitigates supply-chain attacks.

**Excluded packages** (trusted vendors):
- `@replit/*` — Replit-published packages
- `stripe-replit-sync` — Stripe sync utilities

**To override:** Add package to `minimumReleaseAgeExclude` list (sparingly).

---

## Future Enhancements

- [ ] **Student Portal** — Let students book classes, view attendance, pay fees directly
- [ ] **SMS Notifications** — Twilio integration for attendance reminders
- [ ] **Payment Processing** — Stripe integration for automated billing
- [ ] **Advanced Analytics** — Cohort analysis, churn prediction, LTV modeling
- [ ] **Audit Logs** — Track all mutations with timestamps and user context
- [ ] **Role-Based Access** — Admin, Coach, Student, Parent roles with permissions
- [ ] **GraphQL API** — Alternative to REST for flexible querying
- [ ] **Mobile App** — React Native or Flutter app for coaches on-the-go
- [ ] **Integration Marketplace** — Zapier, Make.com, n8n connectors
- [ ] **Multi-Language Support** — i18n for global expansion

---

## Contributing

This is a portfolio project. Contributions are welcome for:

- Bug fixes
- Performance improvements
- Security hardening
- New features (with issue discussion first)

### **How to Contribute**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -am 'Add your feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is provided as-is for educational and portfolio purposes. See the repository for any applicable license file.

---

## Contact & Support

**Author:** [@richardsbrian86-oss](https://github.com/richardsbrian86-oss)

**Issues & Questions:**
- Open a GitHub issue for bug reports or feature requests
- Check existing issues before submitting duplicates

**Live App:** [retention-pulse-dashboard.replit.app](https://retention-pulse-dashboard.replit.app/)

**Repository:** [Level-Up-Jiutsu](https://github.com/richardsbrian86-oss/Level-Up-Jiutsu)

---

## Acknowledgments

- Built with [Node.js](https://nodejs.org/) and [Express.js](https://expressjs.com/)
- Frontend powered by [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- Database: [SQLite](https://www.sqlite.org/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- Hosting: [Replit](https://replit.com/)
- Package manager: [pnpm](https://pnpm.io/)

---

**Last updated:** July 2, 2026  
**Status:** Active & Maintained
