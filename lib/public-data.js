import 'server-only';
import { db, hasDb } from './db';

// Public pages must still render if the database is down or not configured yet.
async function safe(fn, fallback) {
  if (!hasDb()) return fallback;
  try {
    return await fn();
  } catch (e) {
    console.error('[public-data]', e);
    return fallback;
  }
}

export const upcomingEvents = (limit = 20) =>
  safe(
    () => db()`SELECT id, title, starts_at, venue, description FROM events
               WHERE published AND starts_at >= now() - interval '1 day'
               ORDER BY starts_at ASC LIMIT ${limit}`,
    [],
  );

export const pastEvents = (limit = 20) =>
  safe(
    () => db()`SELECT id, title, starts_at, venue, description FROM events
               WHERE published AND starts_at < now() - interval '1 day'
               ORDER BY starts_at DESC LIMIT ${limit}`,
    [],
  );

export const publicNotices = (limit = 50) =>
  safe(
    () => db()`SELECT id, title, body, category, created_at FROM notices
               WHERE published AND audience = 'public' ORDER BY created_at DESC LIMIT ${limit}`,
    [],
  );

export const publicNotice = (id) =>
  safe(async () => {
    const rows = await db()`SELECT id, title, body, category, created_at FROM notices
                            WHERE id = ${id} AND published AND audience = 'public'`;
    return rows[0] ?? null;
  }, null);

export const approvedMemberCount = () =>
  safe(async () => (await db()`SELECT count(*)::int AS n FROM members WHERE status = 'approved'`)[0].n, null);
