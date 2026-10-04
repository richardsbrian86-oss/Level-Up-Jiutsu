# Retention Pulse Dashboard

Retention Pulse is a portfolio prototype for martial arts academies. It includes an attendance and retention dashboard snapshot and a SQLite-backed API for student records, class bookings, and onboarding.

## Run the API

Requires Node.js 24 or later and pnpm. From the repository root:

```sh
pnpm install
pnpm --dir artifacts/api-server dev
```

The API listens on port 3000 by default. Set `PORT` to use a different port. Its SQLite database and demonstration seed data are created on first launch.

To build and start the API:

```sh
pnpm --dir artifacts/api-server build
pnpm --dir artifacts/api-server start
```

## Project layout

- `artifacts/api-server/src/server.mjs` — Express routes.
- `artifacts/api-server/src/db.mjs` — SQLite schema, seed data, and queries.
- `artifacts/retentionpulse-dashboard/` — bundled dashboard snapshot; frontend source is not included.

The `/api/copilot/ask` route returns a basic retention summary; it does not use an AI service. The API is a prototype without authentication or authorization, so use demonstration data only.
