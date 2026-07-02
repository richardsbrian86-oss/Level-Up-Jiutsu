# Retention Pulse Dashboard

Retention Pulse Dashboard is a retention operations project for a Jiujitsu academy.  
It combines a frontend dashboard snapshot (`artifacts/retentionpulse-dashboard`) with a runnable API artifact (`artifacts/api-server`) backed by SQLite.

## Why

Student retention in martial arts often drops when attendance becomes inconsistent, onboarding steps are delayed, or follow-up actions are not tracked.  
This project exists to help coaches and staff:

- identify students with rising churn risk
- monitor onboarding completion
- keep classes and coach schedules visible
- trigger retention actions earlier with consistent data

## How

The solution is split into two parts:

1. **Dashboard artifact (this folder)**
   - `index.html`
   - `index-BO2Ko2Hr.js`
   - `index-CmHDsFUe.css`
   - `api-routes.txt` (discovered API paths used by the app)

2. **API server artifact (`/artifacts/api-server`)**
   - Express server (`src/server.mjs`)
   - SQLite data layer with schema + seed data (`src/db.mjs`)
   - build/start scripts in `package.json`

### Data + workflow model

- Students, attendance, onboarding, coaches, classes, and actions are stored in SQLite.
- Risk is recalculated from days since last attendance.
- Intake tokens support onboarding form completion.
- Class booking updates available capacity.

## Solutions Covered in the Project

### 1) Retention Risk Visibility
- `GET /api/students` returns student roster with risk and attendance gap.
- `POST /api/risk/recalculate` refreshes risk levels based on attendance recency.

### 2) Action Tracking for At-Risk Students
- `GET /api/actions?student_id=...` returns follow-up tasks for a student.

### 3) Attendance Monitoring
- `GET /api/attendance?student_id=...` provides attendance history per student.

### 4) Scheduling and Booking
- `GET /api/public/schedule` and `GET /api/classes` expose class schedule data.
- `POST /api/classes/:id/book` supports booking flow with capacity checks.

### 5) Coach and Onboarding Management
- `GET /api/coaches` returns available coaches and specialties.
- `GET /api/onboarding` returns onboarding checkpoints.
- `POST /api/onboarding/:studentId/token` generates onboarding intake links.
- `GET /api/intake/:token` and `POST /api/intake/:token` handle intake retrieval/submission.

### 6) Copilot Retention Assistant Endpoint
- `POST /api/copilot/ask` provides a lightweight retention summary response.

## Run the API Artifact Locally

From `/home/runner/work/Level-Up-Jiutsu/Level-Up-Jiutsu/artifacts/api-server`:

1. `pnpm install`
2. `pnpm build`
3. `pnpm start`

Development mode:

- `pnpm dev`

## Notes

- This dashboard folder is a deployment snapshot of the frontend build output.
- The API artifact is the editable backend reference for local execution and experimentation.
