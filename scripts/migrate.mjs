// Idempotent schema setup. Runs before every `next build` (see package.json) and via `npm run migrate`.
// Skips quietly when DATABASE_URL is not set, so a build without a database still succeeds.
import { neon, neonConfig } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// Local testing only: point the driver at a Neon-HTTP-compatible proxy instead of Neon.
if (process.env.NEON_FETCH_ENDPOINT) neonConfig.fetchEndpoint = process.env.NEON_FETCH_ENDPOINT;

const url = process.env.DATABASE_URL;
if (!url) {
  console.log('[migrate] DATABASE_URL not set, skipping schema setup');
  process.exit(0);
}
const sql = neon(url);

const statements = [
  `CREATE TABLE IF NOT EXISTS admins (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE,
     password_hash TEXT NOT NULL,
     role TEXT NOT NULL DEFAULT 'committee' CHECK (role IN ('super_admin','committee')),
     active BOOLEAN NOT NULL DEFAULT TRUE,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     last_login_at TIMESTAMPTZ
   )`,
  `CREATE TABLE IF NOT EXISTS members (
     id SERIAL PRIMARY KEY,
     membership_no TEXT UNIQUE,
     owner_name TEXT NOT NULL,
     phone TEXT NOT NULL,
     email TEXT,
     hostel_name TEXT NOT NULL,
     hostel_type TEXT NOT NULL DEFAULT 'boys',
     area TEXT NOT NULL,
     address TEXT,
     beds INTEGER,
     branches INTEGER NOT NULL DEFAULT 1,
     tier TEXT NOT NULL DEFAULT 'annual',
     status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','suspended')),
     notes TEXT,
     rejection_reason TEXT,
     applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     approved_at TIMESTAMPTZ,
     approved_by INTEGER REFERENCES admins(id),
     valid_until DATE
   )`,
  `CREATE INDEX IF NOT EXISTS members_status_idx ON members(status)`,
  `CREATE INDEX IF NOT EXISTS members_phone_idx ON members(phone)`,
  `CREATE TABLE IF NOT EXISTS events (
     id SERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     starts_at TIMESTAMPTZ NOT NULL,
     venue TEXT,
     description TEXT,
     published BOOLEAN NOT NULL DEFAULT TRUE,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS notices (
     id SERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     body TEXT NOT NULL,
     category TEXT NOT NULL DEFAULT 'update' CHECK (category IN ('circular','meeting','update')),
     audience TEXT NOT NULL DEFAULT 'public' CHECK (audience IN ('public','members')),
     published BOOLEAN NOT NULL DEFAULT TRUE,
     created_by INTEGER REFERENCES admins(id),
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS notification_logs (
     id SERIAL PRIMARY KEY,
     notice_id INTEGER REFERENCES notices(id) ON DELETE SET NULL,
     channel TEXT NOT NULL,
     recipients INTEGER NOT NULL DEFAULT 0,
     sent INTEGER NOT NULL DEFAULT 0,
     failed INTEGER NOT NULL DEFAULT 0,
     details JSONB,
     created_by INTEGER REFERENCES admins(id),
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS enquiries (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     phone TEXT NOT NULL,
     email TEXT,
     message TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','closed')),
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS audit_log (
     id SERIAL PRIMARY KEY,
     admin_id INTEGER REFERENCES admins(id),
     action TEXT NOT NULL,
     target TEXT,
     meta JSONB,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
];

for (const s of statements) await sql.query(s);
console.log('[migrate] schema up to date');

const { BOOTSTRAP_ADMIN_EMAIL: email, BOOTSTRAP_ADMIN_PASSWORD: password, BOOTSTRAP_ADMIN_NAME: name } = process.env;
const [{ count }] = await sql`SELECT count(*)::int AS count FROM admins`;
if (count === 0 && email && password) {
  if (password.length < 10) throw new Error('BOOTSTRAP_ADMIN_PASSWORD must be at least 10 characters');
  const hash = await bcrypt.hash(password, 12);
  await sql`INSERT INTO admins (name, email, password_hash, role)
            VALUES (${name || 'Administrator'}, ${email.toLowerCase().trim()}, ${hash}, 'super_admin')`;
  console.log(`[migrate] created first super admin ${email}`);
} else if (count === 0) {
  console.log('[migrate] no admins yet: set BOOTSTRAP_ADMIN_EMAIL/PASSWORD or run `npm run create-admin`');
}
