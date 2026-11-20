import Link from 'next/link';
import { db } from '@/lib/db';
import { channels } from '@/lib/notify';
import { fmtDateTime } from '@/lib/format';

export default async function Overview() {
  const sql = db();
  const [[s], recent, upcoming] = await Promise.all([
    sql`SELECT
          count(*) FILTER (WHERE status = 'approved')::int AS approved,
          count(*) FILTER (WHERE status = 'pending')::int AS pending,
          count(*) FILTER (WHERE status = 'approved' AND valid_until < CURRENT_DATE)::int AS expired,
          count(*) FILTER (WHERE status = 'approved' AND valid_until BETWEEN CURRENT_DATE AND CURRENT_DATE + 30)::int AS expiring,
          coalesce(sum(beds) FILTER (WHERE status = 'approved'), 0)::int AS beds
        FROM members`,
    sql`SELECT a.action, a.target, a.created_at, ad.name FROM audit_log a LEFT JOIN admins ad ON ad.id = a.admin_id
        WHERE a.action <> 'login_failed' ORDER BY a.created_at DESC LIMIT 12`,
    sql`SELECT count(*)::int AS n FROM events WHERE published AND starts_at >= now()`,
  ]);
  const cards = [
    { label: 'Active members', value: s.approved - s.expired, href: '/admin/members' },
    { label: 'Pending applications', value: s.pending, href: '/admin/applications', alert: s.pending > 0 },
    { label: 'Renewal due (30 days)', value: s.expiring, href: '/admin/members?filter=expiring' },
    { label: 'Membership lapsed', value: s.expired, href: '/admin/members?filter=expired' },
    { label: 'Beds represented', value: s.beds.toLocaleString('en-IN') },
    { label: 'Upcoming events', value: upcoming[0].n, href: '/admin/events' },
  ];
  return (
    <>
      <h1>Overview</h1>
      <div className="kpis">
        {cards.map((c) => {
          const inner = (<><span>{c.label}</span><strong>{c.value}</strong></>);
          return c.href ? (
            <Link key={c.label} href={c.href} className={`kpi${c.alert ? ' alert' : ''}`}>{inner}</Link>
          ) : (
            <div key={c.label} className="kpi">{inner}</div>
          );
        })}
      </div>
      <div className="grid-2 mt">
        <div className="card">
          <h3>Notification channels</h3>
          <ul className="plain">
            <li><strong>Website notice board</strong>Always on</li>
            <li><strong>Email</strong>{channels.email() ? 'Configured' : 'Not configured (set ZEPTO_API_KEY and EMAIL_FROM_ADDRESS)'}</li>
            <li><strong>WhatsApp</strong>{channels.whatsapp() ? 'Configured' : 'Not configured (set INTERAKT_API_KEY and INTERAKT_NOTICE_TEMPLATE)'}</li>
          </ul>
        </div>
        <div className="card">
          <h3>Recent activity</h3>
          {recent.length === 0 ? <p className="muted">Nothing yet.</p> : (
            <ul className="activity">
              {recent.map((r, i) => (
                <li key={i}><span>{r.name ?? 'System'}: {r.action.replace(/_/g, ' ')} {r.target ? `#${r.target}` : ''}</span><small className="muted">{fmtDateTime(r.created_at)}</small></li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
