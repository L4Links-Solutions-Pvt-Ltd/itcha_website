// Usage: DATABASE_URL=... node scripts/create-admin.mjs <email> <password> "<name>" [super_admin|committee]
import { neon, neonConfig } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// Local testing only: point the driver at a Neon-HTTP-compatible proxy instead of Neon.
if (process.env.NEON_FETCH_ENDPOINT) neonConfig.fetchEndpoint = process.env.NEON_FETCH_ENDPOINT;

const [email, password, name = 'Administrator', role = 'super_admin'] = process.argv.slice(2);
if (!process.env.DATABASE_URL || !email || !password) {
  console.error('Usage: DATABASE_URL=... node scripts/create-admin.mjs <email> <password> "<name>" [super_admin|committee]');
  process.exit(1);
}
if (password.length < 10) { console.error('Password must be at least 10 characters'); process.exit(1); }
const sql = neon(process.env.DATABASE_URL);
const hash = await bcrypt.hash(password, 12);
await sql`INSERT INTO admins (name, email, password_hash, role) VALUES (${name}, ${email.toLowerCase().trim()}, ${hash}, ${role})
          ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, active = TRUE`;
console.log(`Admin ${email} ready (${role})`);
