import express from 'express';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';

import {
  bookClass,
  createDb,
  createOrRefreshIntakeToken,
  getIntakeByToken,
  listActionsByStudent,
  listAttendanceByStudent,
  listClasses,
  listCoaches,
  listOnboarding,
  listStudents,
  recalculateRisk,
  saveIntakeByToken
} from './db.mjs';

const app = express();
app.use(express.json());
const dbPath = resolve(process.cwd(), 'data', 'retentionpulse.sqlite');
const db = createDb(dbPath);

app.get('/api/public/schedule', (_req, res) => {
  res.json(listClasses(db));
});

app.get('/api/students', (_req, res) => {
  res.json(listStudents(db));
});

app.get('/api/classes', (_req, res) => {
  res.json(listClasses(db));
});

app.get('/api/coaches', (_req, res) => {
  res.json(listCoaches(db));
});

app.get('/api/onboarding', (_req, res) => {
  res.json(listOnboarding(db));
});

app.get('/api/actions', (req, res) => {
  const studentId = Number(req.query.student_id);
  if (!studentId) {
    return res.status(400).json({ error: 'student_id query param required' });
  }
  return res.json(listActionsByStudent(db, studentId));
});

app.get('/api/attendance', (req, res) => {
  const studentId = Number(req.query.student_id);
  if (!studentId) {
    return res.status(400).json({ error: 'student_id query param required' });
  }
  return res.json(listAttendanceByStudent(db, studentId));
});

app.post('/api/classes/:id/book', (req, res) => {
  const classId = Number(req.params.id);
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() : '';

  if (!classId) {
    return res.status(400).json({ error: 'Invalid class id' });
  }
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const result = bookClass(db, classId, { name, email, phone });
  if (!result.ok) {
    return res.status(result.status).json({ error: result.error });
  }

  return res.json(result.booking);
});

app.post('/api/risk/recalculate', (_req, res) => {
  const updated = recalculateRisk(db);
  res.json({ ok: true, updated });
});

app.post('/api/copilot/ask', (req, res) => {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt : '';
  const students = listStudents(db);
  const atRisk = students.filter((student) => student.risk_level !== 'low').length;
  const answer = prompt
    ? `Retention summary: ${atRisk} of ${students.length} students currently at risk. Prompt received: ${prompt}`
    : `Retention summary: ${atRisk} of ${students.length} students currently at risk.`;
  res.json({ answer });
});

app.post('/api/onboarding/:studentId/token', (req, res) => {
  const studentId = Number(req.params.studentId);
  if (!studentId) {
    return res.status(400).json({ error: 'Invalid student id' });
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
  const result = createOrRefreshIntakeToken(db, studentId, token, expiresAt);
  if (!result) {
    return res.status(404).json({ error: 'Student onboarding record not found' });
  }
  return res.json(result);
});

app.get('/api/intake/:token', (req, res) => {
  const intake = getIntakeByToken(db, req.params.token);
  if (!intake) {
    return res.status(404).json({ error: 'Invalid intake token' });
  }
  return res.json(intake);
});

app.post('/api/intake/:token', (req, res) => {
  const submission = saveIntakeByToken(db, req.params.token, req.body ?? {});
  if (!submission) {
    return res.status(404).json({ error: 'Invalid intake token' });
  }
  return res.json({
    token: submission.token,
    student_id: submission.student_id,
    completed_at: submission.completed_at
  });
});

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, db: dbPath });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
