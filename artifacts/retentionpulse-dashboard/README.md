# Retention Pulse Dashboard

Retention Pulse helps martial arts academies spot declining student engagement and organize timely follow-up. This directory contains a bundled dashboard snapshot; the runnable API backend lives separately in `artifacts/api-server`.

## Why

When students attend less often, they can disengage before coaches notice. Retention Pulse brings attendance history, retention risk, follow-up actions, class schedules, and onboarding progress into one place so academy teams can respond earlier and keep students connected.

## How

The project is split into two artifacts:

- **Dashboard (`artifacts/retentionpulse-dashboard`)** — a static frontend snapshot containing `index.html`, bundled JavaScript and CSS, and `api-routes.txt`. The frontend source and its development server are not included here.
- **API server (`artifacts/api-server`)** — a runnable Express service backed by SQLite. It seeds sample records on first launch and provides the data and operations used by the dashboard.

With the backend dependencies installed (see the [API server README](../api-server/README.md)), start it from the repository root. Node.js 24 or later is required:

```sh
pnpm --dir artifacts/api-server dev
```

The API listens on port `3000` by default; set `PORT` to use another port. This starts the backend only, not a local dashboard development server.

## Solutions Covered in the Project

| Solution area | Functionality and API routes |
| --- | --- |
| Retention risk | Review student profiles and attendance recency with `GET /api/students`; refresh risk classifications with `POST /api/risk/recalculate`. |
| Attendance and follow-up | View a student's attendance and coach actions with `GET /api/attendance?student_id=...` and `GET /api/actions?student_id=...`. |
| Class and coach operations | Browse schedules, classes, and coaches with `GET /api/public/schedule`, `GET /api/classes`, and `GET /api/coaches`; book a class with `POST /api/classes/:id/book`. |
| Student onboarding | Review progress with `GET /api/onboarding`; create an intake link with `POST /api/onboarding/:studentId/token`, then retrieve or submit intake details with `GET /api/intake/:token` and `POST /api/intake/:token`. |
| Retention summary assistant | Request a basic at-risk student summary with `POST /api/copilot/ask`. This endpoint currently returns a simple summary; it does not connect to an external AI service. |
