# Retention Pulse Dashboard

Retention Pulse is a prototype retention dashboard for martial arts academies. It helps owners and coaches review attendance, identify students who may need follow-up, and manage class bookings and onboarding in one place.

## Features

- Student roster with attendance history and low-, medium-, or high-risk classifications.
- Attendance-based risk recalculation, using the time since each student's latest recorded class.
- Class schedules, coach information, capacity tracking, and class bookings.
- Onboarding checklists and token-based intake forms.
- A bundled dashboard snapshot for viewing the product interface.

The `/api/copilot/ask` endpoint currently returns a basic retention summary and echoes the submitted prompt. It does not call an AI service.

## Technology

- **API:** Node.js 24+, Express, and SQLite (`node:sqlite`)
- **Dashboard:** React and Vite bundle, with Tailwind CSS
- **Build:** esbuild; pnpm workspace

## Project contents

- `artifacts/api-server/` — runnable API source, SQLite schema and seed data, and build scripts.
- `artifacts/retentionpulse-dashboard/` — static, compiled dashboard assets and API route reference. The frontend source and a local frontend development server are not included.

## Run locally

You need Node.js 24 or later and pnpm.

From the repository root, install dependencies and start the API in development mode:

```sh
pnpm install
pnpm --dir artifacts/api-server dev
```

The API listens at `http://localhost:3000`. Check that it started with:

```sh
curl http://localhost:3000/healthz
```

The database is created at `artifacts/api-server/data/retentionpulse.sqlite` and seeded with demonstration records on first launch. The API can also be built and run with:

```sh
pnpm --dir artifacts/api-server build
pnpm --dir artifacts/api-server start
```

The compiled dashboard is a snapshot; it is not served by the API development command and cannot be rebuilt from this repository.

## API overview

All routes use the local API base URL `http://localhost:3000`.

| Capability | Routes |
| --- | --- |
| Students and risk | `GET /api/students`, `POST /api/risk/recalculate` |
| Attendance and follow-up actions | `GET /api/attendance?student_id=1`, `GET /api/actions?student_id=1` |
| Classes and coaches | `GET /api/public/schedule`, `GET /api/classes`, `GET /api/coaches`, `POST /api/classes/:id/book` |
| Onboarding | `GET /api/onboarding`, `POST /api/onboarding/:studentId/token`, `GET` and `POST /api/intake/:token` |
| Retention summary | `POST /api/copilot/ask` |

## Prototype and security notes

This repository is a portfolio prototype, not a production-ready student-management system. The API currently has no authentication, authorization, or rate limiting, and its routes expose seeded student and attendance data. Use only demonstration data; do not expose the service publicly or enter real student information.

## Project links

- Repository: [Retention Pulse Dashboard](https://github.com/richardsbrian86-oss/Retention-Pulse-Dashbaord)
- Maintainer: [@richardsbrian86-oss](https://github.com/richardsbrian86-oss)
