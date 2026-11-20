import { currentAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const cell = (v) => {
  let s = v == null ? '' : v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // neutralise spreadsheet formulas
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) return new Response('Unauthorized', { status: 401 });
  const rows = await db()`SELECT membership_no, hostel_name, owner_name, phone, email, hostel_type, area, address, beds, branches, tier, status, valid_until::text AS valid_until, applied_at, approved_at
                          FROM members WHERE status IN ('approved','suspended') ORDER BY hostel_name`;
  const cols = ['membership_no', 'hostel_name', 'owner_name', 'phone', 'email', 'hostel_type', 'area', 'address', 'beds', 'branches', 'tier', 'status', 'valid_until', 'applied_at', 'approved_at'];
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n');
  await db()`INSERT INTO audit_log (admin_id, action, target) VALUES (${admin.id}, 'members_exported', ${String(rows.length)})`;
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="itcha-members-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
