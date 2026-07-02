# API Server Artifact

This folder is a runnable SQLite-backed RetentionPulse API server.

Runtime requirement: Node.js 24+ (uses built-in node:sqlite).

## Files

- build.mjs: esbuild bundle script
- src/server.mjs: Express API server
- src/db.mjs: SQLite schema, seed, and query helpers
- package.json: scripts and dependencies
- data/retentionpulse.sqlite: created automatically on first run

## Route coverage

- GET /api/public/schedule
- GET /api/students
- GET /api/classes
- GET /api/coaches
- GET /api/onboarding
- GET /api/actions?student_id=...
- GET /api/attendance?student_id=...
- POST /api/classes/:id/book
- POST /api/risk/recalculate
- POST /api/copilot/ask
- POST /api/onboarding/:studentId/token
- GET /api/intake/:token
- POST /api/intake/:token

## Usage

1. pnpm install
2. pnpm build
3. pnpm start

Development mode:

- pnpm dev

Notes:

- Database is seeded with sample students, attendance, classes, coaches, and onboarding records on first launch.
- Risk recalculation updates risk based on days since latest attendance.
