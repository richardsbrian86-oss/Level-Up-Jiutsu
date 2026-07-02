# Threat Model

## Project Overview

RetentionPulse is a publicly deployed student-retention dashboard for martial arts or gym coaches. It uses a React/Vite frontend in `artifacts/retentionpulse`, an Express 5 API in `artifacts/api-server`, PostgreSQL via Drizzle in `lib/db`, and an OpenAI-backed copilot endpoint under `/api/copilot/ask`.

Production scope for this scan is the public deployment at `retention-pulse-dashboard.replit.app`. The `artifacts/mockup-sandbox` app, `.agents/`, and local skills are development-only and are not considered production-reachable unless proven otherwise. TLS is handled by the platform.

## Assets

- **Student roster data** — names, email addresses, phone numbers, belt ranks, attendance history, and derived risk level. This is personal and operationally sensitive data.
- **Coach action history** — outreach and follow-up records in `action_log`. This can reveal internal business activity and student engagement history.
- **Application integrity** — the correctness of student, attendance, risk, and action records. Unauthorized changes directly affect business operations.
- **OpenAI API usage and prompt contents** — the copilot endpoint sends student-derived context to a third-party model and can incur billable usage.
- **Application secrets** — `DATABASE_URL` and `OPENAI_API_KEY` held in environment variables.

## Trust Boundaries

- **Browser to API** — the public internet can reach the Express app mounted at `/api`; all client input is untrusted.
- **API to PostgreSQL** — API routes have direct read/write access to student and activity tables.
- **API to OpenAI** — `/api/copilot/ask` sends model prompts and receives streamed responses from OpenAI.
- **Public to privileged business data** — the app handles student records that should only be visible and mutable by authorized staff.
- **Development-only to production** — `.agents/`, skills, and `artifacts/mockup-sandbox` are out of scope unless wired into the deployed app.

## Scan Anchors

- Production backend entry points: `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/app.ts`, `artifacts/api-server/src/routes/*.ts`
- Highest-risk areas: student/attendance/action routes, `risk.ts`, and `routes/copilot/index.ts`
- Public surface: all `/api/*` routes plus the React app under `artifacts/retentionpulse`
- Shared data boundary: `lib/db/src/index.ts` and `lib/db/src/schema/index.ts`
- Dev-only areas usually ignored: `.agents/**`, `.local/skills/**`, `artifacts/mockup-sandbox/**`

## Threat Categories

### Spoofing

This project currently exposes business APIs on a public deployment. The system must ensure that only authorized coaches can access student data or invoke state-changing routes. Any authentication or session mechanism must be enforced server-side on every protected endpoint.

### Tampering

The API allows creation, modification, and deletion of student, attendance, risk, and action records. The system must reject unauthorized writes and must not trust frontend-only restrictions or hidden UI controls as a security boundary.

### Information Disclosure

Student roster records, attendance timelines, risk classifications, and coach action history are sensitive. The system must restrict read access to authorized staff, avoid over-broad public responses, and ensure third-party model calls do not become an alternate exfiltration path.

### Denial of Service

The public API includes endpoints that can trigger database work and billable OpenAI calls. The system must bound request size and frequency, especially on `/api/copilot/ask` and any route that recalculates data across the full roster.

### Elevation of Privilege

The key risk in this project is broken access control rather than low-level injection: a public caller may be able to read or modify data reserved for coaches. The system must enforce authorization at the API layer before any database query or OpenAI call that uses student data.