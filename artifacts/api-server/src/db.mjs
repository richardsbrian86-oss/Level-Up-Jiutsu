import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

function boolToInt(value) {
  return value ? 1 : 0;
}

function rowToBool(row, fields) {
  const next = { ...row };
  for (const field of fields) {
    next[field] = Boolean(next[field]);
  }
  return next;
}

function runTransaction(db, fn) {
  db.exec('BEGIN');
  try {
    fn();
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function createDb(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
  const db = new DatabaseSync(filePath);
  db.exec("PRAGMA journal_mode = WAL;");

  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      rank TEXT,
      join_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      risk_level TEXT NOT NULL DEFAULT 'low'
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      attended_at TEXT NOT NULL,
      class_name TEXT NOT NULL,
      present INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY(student_id) REFERENCES students(id)
    );

    CREATE TABLE IF NOT EXISTS coaches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      specialty TEXT
    );

    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      date TEXT,
      start_time TEXT,
      duration INTEGER NOT NULL DEFAULT 60,
      location TEXT,
      coach_id INTEGER,
      capacity INTEGER NOT NULL DEFAULT 20,
      booked_count INTEGER NOT NULL DEFAULT 0,
      is_recurring INTEGER NOT NULL DEFAULT 0,
      day_of_week INTEGER,
      FOREIGN KEY(coach_id) REFERENCES coaches(id)
    );

    CREATE TABLE IF NOT EXISTS actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      due_date TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(student_id) REFERENCES students(id)
    );

    CREATE TABLE IF NOT EXISTS onboarding (
      student_id INTEGER PRIMARY KEY,
      waiver_signed INTEGER NOT NULL DEFAULT 0,
      intro_class_done INTEGER NOT NULL DEFAULT 0,
      payment_setup INTEGER NOT NULL DEFAULT 0,
      coach_intro_done INTEGER NOT NULL DEFAULT 0,
      uniform_purchased INTEGER NOT NULL DEFAULT 0,
      whatsapp_added INTEGER NOT NULL DEFAULT 0,
      onboarding_complete INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      intake_token TEXT,
      intake_token_expires_at TEXT,
      waiver_signed_name TEXT,
      waiver_signed_at TEXT,
      intake_completed_at TEXT,
      FOREIGN KEY(student_id) REFERENCES students(id)
    );

    CREATE TABLE IF NOT EXISTS intake_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL UNIQUE,
      student_id INTEGER,
      payload_json TEXT NOT NULL,
      completed_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(student_id) REFERENCES students(id)
    );
  `);

  seedIfEmpty(db);
  return db;
}

function seedIfEmpty(db) {
  const count = db.prepare('SELECT COUNT(*) AS count FROM students').get().count;
  if (count > 0) {
    return;
  }

  const insertStudent = db.prepare(`
    INSERT INTO students (name, email, phone, rank, join_date, status, risk_level)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const students = [
    ['Marcus Webb', 'marcus.webb@email.com', '555-0101', 'Blue Belt', '2026-06-20T18:58:45.551Z', 'active', 'low'],
    ['Diana Chen', 'diana.chen@email.com', '555-0102', 'Green Belt', '2026-06-13T18:58:45.571Z', 'at_risk', 'medium'],
    ['Jordan Hill', 'jordan.hill@email.com', '555-0103', 'White Belt', '2026-06-05T18:58:45.590Z', 'at_risk', 'medium'],
    ['Priya Patel', 'priya.patel@email.com', '555-0104', 'Purple Belt', '2026-05-18T18:58:45.608Z', 'active', 'low'],
    ['Sam Liu', 'sam.liu@email.com', '555-0105', 'White Belt', '2025-11-29T22:34:08.306Z', 'at_risk', 'medium'],
    ['Jake Morrison', 'jake.morrison@email.com', '555-0106', 'Blue Belt', '2025-08-06T22:34:08.313Z', 'at_risk', 'high'],
    ['Sofia Ruiz', 'sofia.ruiz@email.com', '555-0107', 'Brown Belt', '2025-09-17T22:34:08.321Z', 'at_risk', 'medium'],
    ['Devon Banks', 'devon.banks@email.com', '555-0108', 'White Belt', '2026-03-08T22:34:08.334Z', 'active', 'low'],
    ['Tyler Stone', 'tyler.stone@email.com', '555-0109', 'Purple Belt', '2025-08-02T22:34:08.342Z', 'at_risk', 'high'],
    ['Maya Williams', 'maya.williams@email.com', '555-0110', 'Black Belt', '2025-10-11T22:34:08.350Z', 'at_risk', 'high']
  ];

  const insertAttendance = db.prepare(`
    INSERT INTO attendance (student_id, attended_at, class_name, present)
    VALUES (?, ?, ?, ?)
  `);

  const insertCoach = db.prepare(`
    INSERT INTO coaches (name, email, phone, specialty)
    VALUES (?, ?, ?, ?)
  `);

  const insertClass = db.prepare(`
    INSERT INTO classes (
      name, description, date, start_time, duration, location,
      coach_id, capacity, booked_count, is_recurring, day_of_week
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOnboarding = db.prepare(`
    INSERT INTO onboarding (
      student_id, waiver_signed, intro_class_done, payment_setup, coach_intro_done,
      uniform_purchased, whatsapp_added, onboarding_complete
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAction = db.prepare(`
    INSERT INTO actions (student_id, title, status, due_date, notes)
    VALUES (?, ?, ?, ?, ?)
  `);

  runTransaction(db, () => {
    for (const student of students) {
      insertStudent.run(...student);
    }

    const attendanceSeed = [
      [1, '2026-06-28T10:00:00.000Z', 'Fundamentals', 1],
      [1, '2026-06-30T10:00:00.000Z', 'Gi Basics', 1],
      [2, '2026-06-20T10:00:00.000Z', 'No-Gi Drills', 1],
      [3, '2026-06-18T10:00:00.000Z', 'Fundamentals', 1],
      [3, '2026-06-26T10:00:00.000Z', 'Gi Basics', 1],
      [4, '2026-06-29T10:00:00.000Z', 'Open Mat', 1],
      [6, '2026-06-21T10:00:00.000Z', 'Sparring', 1],
      [7, '2026-06-22T10:00:00.000Z', 'Advanced Gi', 1],
      [8, '2026-07-01T10:00:00.000Z', 'Fundamentals', 1],
      [9, '2026-06-15T10:00:00.000Z', 'No-Gi Drills', 1],
      [10, '2026-06-14T10:00:00.000Z', 'Advanced Gi', 1]
    ];
    for (const item of attendanceSeed) {
      insertAttendance.run(...item);
    }

    insertCoach.run('Coach Reyes', 'reyes@retentionpulse.local', '555-1001', 'Fundamentals');
    insertCoach.run('Coach Morgan', 'morgan@retentionpulse.local', '555-1002', 'Advanced');

    insertClass.run(
      'Fundamentals',
      'Core positions and escapes',
      null,
      '18:30',
      60,
      'Main Mat',
      1,
      20,
      8,
      1,
      1
    );
    insertClass.run(
      'No-Gi Drills',
      'Gripless transitions and entries',
      null,
      '19:15',
      60,
      'Main Mat',
      2,
      18,
      14,
      1,
      3
    );
    insertClass.run(
      'Open Mat Special',
      'Guest-led open mat',
      '2026-07-07',
      '17:00',
      90,
      'Annex',
      1,
      30,
      10,
      0,
      null
    );

    for (let studentId = 1; studentId <= students.length; studentId += 1) {
      insertOnboarding.run(studentId, 0, 0, 0, 0, 0, 0, 0);
    }

    insertAction.run(2, 'Reach out after absence', 'open', '2026-07-03', 'Call and offer a fundamentals recap.');
    insertAction.run(6, 'Offer private session', 'open', '2026-07-04', 'High-risk student, suggest 1:1 onboarding.');
  });
}

export function listStudents(db) {
  return db
    .prepare(`
      SELECT
        s.id,
        s.name,
        s.email,
        s.phone,
        s.rank,
        s.join_date,
        s.status,
        s.risk_level,
        COALESCE(ROUND(julianday('now') - julianday(MAX(a.attended_at)), 6), 999) AS days_since_last_attendance
      FROM students s
      LEFT JOIN attendance a ON a.student_id = s.id AND a.present = 1
      GROUP BY s.id
      ORDER BY days_since_last_attendance DESC
    `)
    .all();
}

export function listActionsByStudent(db, studentId) {
  return db
    .prepare(
      `
      SELECT id, student_id, title, status, due_date, notes, created_at
      FROM actions
      WHERE student_id = ?
      ORDER BY created_at DESC
    `
    )
    .all(studentId);
}

export function listAttendanceByStudent(db, studentId) {
  return db
    .prepare(
      `
      SELECT id, student_id, attended_at, class_name, present
      FROM attendance
      WHERE student_id = ?
      ORDER BY attended_at DESC
    `
    )
    .all(studentId)
    .map((row) => rowToBool(row, ['present']));
}

export function listClasses(db) {
  return db
    .prepare(
      `
      SELECT
        c.id,
        c.name,
        c.description,
        c.date,
        c.start_time,
        c.duration,
        c.location,
        c.coach_id,
        k.name AS coach_name,
        c.capacity,
        c.booked_count,
        (c.capacity - c.booked_count) AS spots_remaining,
        c.is_recurring,
        c.day_of_week
      FROM classes c
      LEFT JOIN coaches k ON k.id = c.coach_id
      ORDER BY c.is_recurring DESC, c.day_of_week ASC, c.start_time ASC, c.date ASC
    `
    )
    .all()
    .map((row) => rowToBool(row, ['is_recurring']));
}

export function listCoaches(db) {
  return db
    .prepare(
      `
      SELECT id, name, email, phone, specialty
      FROM coaches
      ORDER BY name ASC
    `
    )
    .all();
}

export function listOnboarding(db) {
  return db
    .prepare(
      `
      SELECT
        o.student_id,
        s.name,
        s.email,
        s.join_date,
        CAST(ROUND(julianday('now') - julianday(s.join_date), 0) AS INTEGER) AS days_since_joining,
        COALESCE(SUM(CASE WHEN a.present = 1 THEN 1 ELSE 0 END), 0) AS attendance_count,
        o.waiver_signed,
        o.intro_class_done,
        o.payment_setup,
        o.coach_intro_done,
        o.uniform_purchased,
        o.whatsapp_added,
        o.onboarding_complete,
        o.completed_at,
        o.intake_token,
        o.intake_token_expires_at,
        o.waiver_signed_name,
        o.waiver_signed_at,
        o.intake_completed_at
      FROM onboarding o
      JOIN students s ON s.id = o.student_id
      LEFT JOIN attendance a ON a.student_id = s.id
      GROUP BY o.student_id
      ORDER BY days_since_joining DESC
    `
    )
    .all()
    .map((row) =>
      rowToBool(row, [
        'waiver_signed',
        'intro_class_done',
        'payment_setup',
        'coach_intro_done',
        'uniform_purchased',
        'whatsapp_added',
        'onboarding_complete'
      ])
    );
}

export function recalculateRisk(db) {
  const students = listStudents(db);
  const update = db.prepare('UPDATE students SET risk_level = ?, status = ? WHERE id = ?');

  runTransaction(db, () => {
    for (const student of students) {
      const days = Number(student.days_since_last_attendance || 0);
      let risk = 'low';
      let status = 'active';
      if (days >= 10) {
        risk = 'high';
        status = 'at_risk';
      } else if (days >= 6) {
        risk = 'medium';
        status = 'at_risk';
      }
      update.run(risk, status, student.id);
    }
  });
  return students.length;
}

export function getIntakeByToken(db, token) {
  const onboarding = db
    .prepare(
      `
      SELECT
        o.student_id,
        s.name,
        s.email,
        o.intake_token,
        o.intake_token_expires_at,
        o.waiver_signed,
        o.waiver_signed_name,
        o.waiver_signed_at,
        o.intake_completed_at
      FROM onboarding o
      JOIN students s ON s.id = o.student_id
      WHERE o.intake_token = ?
      LIMIT 1
    `
    )
    .get(token);

  if (!onboarding) {
    return null;
  }

  return rowToBool(onboarding, ['waiver_signed']);
}

export function saveIntakeByToken(db, token, payload) {
  const onboarding = db
    .prepare('SELECT student_id FROM onboarding WHERE intake_token = ? LIMIT 1')
    .get(token);

  if (!onboarding) {
    return null;
  }

  db.prepare(
    `
    INSERT INTO intake_submissions (token, student_id, payload_json, completed_at)
    VALUES (?, ?, ?, datetime('now'))
    ON CONFLICT(token) DO UPDATE SET
      payload_json = excluded.payload_json,
      completed_at = excluded.completed_at
  `
  ).run(token, onboarding.student_id, JSON.stringify(payload ?? {}));

  db.prepare(
    `
    UPDATE onboarding
    SET
      intake_completed_at = datetime('now'),
      waiver_signed = ?,
      waiver_signed_name = COALESCE(?, waiver_signed_name),
      waiver_signed_at = CASE WHEN ? THEN datetime('now') ELSE waiver_signed_at END
    WHERE student_id = ?
  `
  ).run(
    boolToInt(Boolean(payload?.waiver_acknowledged || payload?.waiver_signed_name)),
    payload?.waiver_signed_name ?? null,
    boolToInt(Boolean(payload?.waiver_acknowledged || payload?.waiver_signed_name)),
    onboarding.student_id
  );

  return db
    .prepare(
      'SELECT token, student_id, payload_json, completed_at FROM intake_submissions WHERE token = ? LIMIT 1'
    )
    .get(token);
}

export function createOrRefreshIntakeToken(db, studentId, token, expiresAtIso) {
  db.prepare(
    `
    UPDATE onboarding
    SET intake_token = ?, intake_token_expires_at = ?
    WHERE student_id = ?
  `
  ).run(token, expiresAtIso, studentId);

  return db
    .prepare(
      `
      SELECT student_id, intake_token, intake_token_expires_at
      FROM onboarding
      WHERE student_id = ?
    `
    )
    .get(studentId);
}

export function bookClass(db, classId, booking) {
  const cls = db
    .prepare(
      `
      SELECT id, capacity, booked_count
      FROM classes
      WHERE id = ?
      LIMIT 1
    `
    )
    .get(classId);

  if (!cls) {
    return { ok: false, status: 404, error: 'Class not found' };
  }

  if (cls.booked_count >= cls.capacity) {
    return { ok: false, status: 409, error: 'Class is full' };
  }

  db.prepare('UPDATE classes SET booked_count = booked_count + 1 WHERE id = ?').run(classId);

  return {
    ok: true,
    booking: {
      class_id: classId,
      name: booking.name,
      email: booking.email,
      phone: booking.phone ?? null
    }
  };
}
