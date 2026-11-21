import Link from 'next/link';
import { db } from '@/lib/db';
import { AREAS, isArea } from '@/lib/areas';
import { fmtDate } from '@/lib/format';
import { addMember } from '../../actions';
import ActionForm from '@/components/admin/ActionForm';
import MemberFields from '@/components/admin/MemberFields';

const FILTERS = {
  active: 'Active',
  expiring: 'Renewal due (30 days)',
  expired: 'Lapsed',
  suspended: 'Suspended',
  all: 'All approved & suspended',
};

export default async function Members({ searchParams }) {
  const sp = await searchParams;
  const filter = FILTERS[sp.filter] ? sp.filter : 'active';
  const q = String(sp.q ?? '').trim().slice(0, 80);
  const like = `%${q}%`;
  const area = isArea(sp.area) ? sp.area : '';
  const rows = await db()`
    SELECT id, membership_no, owner_name, phone, hostel_name, area, beds, tier, status, valid_until
    FROM members
    WHERE status IN ('approved','suspended')
      AND (${area} = '' OR area = ${area})
      AND (${q} = '' OR owner_name ILIKE ${like} OR hostel_name ILIKE ${like} OR area ILIKE ${like} OR phone LIKE ${like} OR membership_no ILIKE ${like})
      AND CASE ${filter}
            WHEN 'active' THEN status = 'approved' AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
            WHEN 'expiring' THEN status = 'approved' AND valid_until BETWEEN CURRENT_DATE AND CURRENT_DATE + 30
            WHEN 'expired' THEN status = 'approved' AND valid_until < CURRENT_DATE
            WHEN 'suspended' THEN status = 'suspended'
            ELSE TRUE END
    ORDER BY hostel_name LIMIT 500`;
  const qs = (f) => `/admin/members?filter=${f}${q ? `&q=${encodeURIComponent(q)}` : ''}${area ? `&area=${encodeURIComponent(area)}` : ''}`;
  return (
    <>
      <div className="page-head">
        <h1>Members</h1>
        <a className="btn btn-sm btn-ghost-dark" href="/admin/members-export">Export all CSV</a>
      </div>
      <div className="toolbar">
        <div className="tabs">
          {Object.entries(FILTERS).map(([k, label]) => (
            <Link key={k} href={qs(k)} className={k === filter ? 'active' : ''}>{label}</Link>
          ))}
        </div>
        <form className="search">
          <input type="hidden" name="filter" value={filter} />
          <select name="area" defaultValue={area} aria-label="Area">
            <option value="">All areas</option>
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <input name="q" defaultValue={q} placeholder="Search name, hostel, phone, ITCHA no." />
          <button className="btn btn-sm">Search</button>
        </form>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>No.</th><th>Hostel</th><th>Owner</th><th>Mobile</th><th>Area</th><th>Beds</th><th>Valid until</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id}>
                <td><Link href={`/admin/members/${m.id}`}>{m.membership_no}</Link></td>
                <td><Link href={`/admin/members/${m.id}`}>{m.hostel_name}</Link></td>
                <td>{m.owner_name}</td>
                <td>{m.phone}</td>
                <td>{m.area}</td>
                <td>{m.beds ?? '-'}</td>
                <td>{m.tier === 'lifetime' ? 'Lifetime' : fmtDate(m.valid_until)}</td>
                <td><span className={`status status-${m.status}`}>{m.status}</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={8} className="muted">No members match.</td></tr>}
          </tbody>
        </table>
      </div>
      <details className="card mt">
        <summary><strong>Add a member directly</strong> <span className="muted">(e.g. registered on paper or at a meeting; approved immediately)</span></summary>
        <ActionForm action={addMember} submitLabel="Add member">
          <MemberFields />
        </ActionForm>
      </details>
    </>
  );
}
