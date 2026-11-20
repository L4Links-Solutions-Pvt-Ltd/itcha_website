import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from './db';
import { SESSION_COOKIE, verifySession } from './session';

// Returns the logged-in, still-active admin (re-checked against the DB on every call, so
// deactivating an admin or changing their role takes effect immediately) or null.
export async function currentAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const payload = await verifySession(token);
  if (!payload?.sub) return null;
  const rows = await db()`SELECT id, name, email, role FROM admins WHERE id = ${Number(payload.sub)} AND active`;
  return rows[0] ?? null;
}

export async function requireAdmin({ role } = {}) {
  const admin = await currentAdmin();
  if (!admin) redirect('/admin/login');
  if (role === 'super_admin' && admin.role !== 'super_admin') throw new Error('Only a super admin can do this');
  return admin;
}

export async function audit(adminId, action, target, meta) {
  await db()`INSERT INTO audit_log (admin_id, action, target, meta)
             VALUES (${adminId}, ${action}, ${target ?? null}, ${meta ? JSON.stringify(meta) : null})`;
}
