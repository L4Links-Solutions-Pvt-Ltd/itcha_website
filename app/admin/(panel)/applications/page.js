import Link from 'next/link';
import { db } from '@/lib/db';
import { approveMember, rejectMember } from '../../actions';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { fmtDateTime } from '@/lib/format';
import { HOSTEL_TYPES } from '@/lib/site';

const typeLabel = (id) => HOSTEL_TYPES.find((t) => t.id === id)?.label ?? id;

export default async function Applications({ searchParams }) {
  const showRejected = (await searchParams).view === 'rejected';
  const rows = showRejected
    ? await db()`SELECT * FROM members WHERE status = 'rejected' ORDER BY applied_at DESC LIMIT 200`
    : await db()`SELECT * FROM members WHERE status = 'pending' ORDER BY applied_at ASC`;
  return (
    <>
      <div className="page-head">
        <h1>{showRejected ? 'Rejected applications' : 'Pending applications'}</h1>
        <Link href={showRejected ? '/admin/applications' : '/admin/applications?view=rejected'}>
          {showRejected ? 'Show pending' : 'Show rejected'}
        </Link>
      </div>
      {rows.length === 0 && <p className="muted">{showRejected ? 'No rejected applications.' : 'No applications waiting. All caught up.'}</p>}
      <div className="app-list">
        {rows.map((m) => (
          <div key={m.id} className="card application">
            <div className="app-head">
              <div>
                <h3>{m.hostel_name}</h3>
                <p className="muted">{typeLabel(m.hostel_type)} &middot; {m.area}{m.beds ? ` · ${m.beds} beds` : ''}{m.branches > 1 ? ` · ${m.branches} branches` : ''}</p>
              </div>
              <small className="muted">Applied {fmtDateTime(m.applied_at)}</small>
            </div>
            <dl className="facts">
              <div><dt>Owner</dt><dd>{m.owner_name}</dd></div>
              <div><dt>Mobile</dt><dd><a href={`tel:+91${m.phone}`}>{m.phone}</a></dd></div>
              <div><dt>Email</dt><dd>{m.email ?? '-'}</dd></div>
              <div><dt>Membership</dt><dd>{m.tier}</dd></div>
              {m.address && <div className="span-2"><dt>Address</dt><dd>{m.address}</dd></div>}
              {m.rejection_reason && <div className="span-2"><dt>Rejection reason</dt><dd>{m.rejection_reason}</dd></div>}
            </dl>
            <div className="app-actions">
              <form action={approveMember}>
                <input type="hidden" name="id" value={m.id} />
                <ConfirmButton className="btn btn-primary btn-sm" message={`Approve ${m.hostel_name}?`}>Approve</ConfirmButton>
              </form>
              {!showRejected && (
                <form action={rejectMember} className="inline-form">
                  <input type="hidden" name="id" value={m.id} />
                  <input name="reason" placeholder="Reason (optional)" maxLength={300} />
                  <ConfirmButton className="btn btn-danger btn-sm" message={`Reject ${m.hostel_name}?`}>Reject</ConfirmButton>
                </form>
              )}
              <Link href={`/admin/members/${m.id}`} className="btn btn-sm btn-ghost-dark">Edit details</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
