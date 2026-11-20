import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { fmtDate, fmtDateTime } from '@/lib/format';
import { approveMember, deleteMember, renewMember, setMemberStatus, updateMember } from '../../../actions';
import ActionForm from '@/components/admin/ActionForm';
import ConfirmButton from '@/components/admin/ConfirmButton';
import MemberFields from '@/components/admin/MemberFields';

export default async function MemberPage({ params }) {
  const admin = await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [m] = await db()`SELECT m.*, a.name AS approved_by_name FROM members m LEFT JOIN admins a ON a.id = m.approved_by WHERE m.id = ${id}`;
  if (!m) notFound();
  const history = await db()`SELECT l.action, l.created_at, a.name FROM audit_log l LEFT JOIN admins a ON a.id = l.admin_id
                             WHERE l.target = ${String(id)} AND l.action LIKE 'member_%' ORDER BY l.created_at DESC LIMIT 20`;
  const Hidden = () => <input type="hidden" name="id" value={m.id} />;
  return (
    <>
      <p><Link href={m.status === 'pending' || m.status === 'rejected' ? '/admin/applications' : '/admin/members'}>&larr; Back</Link></p>
      <div className="page-head">
        <h1>{m.hostel_name}</h1>
        <span className={`status status-${m.status}`}>{m.status}</span>
      </div>
      <dl className="facts card">
        <div><dt>Membership no.</dt><dd>{m.membership_no ?? 'Not assigned yet'}</dd></div>
        <div><dt>Valid until</dt><dd>{m.tier === 'lifetime' ? 'Lifetime' : m.valid_until ? fmtDate(m.valid_until) : '-'}</dd></div>
        <div><dt>Applied</dt><dd>{fmtDateTime(m.applied_at)}</dd></div>
        <div><dt>Approved</dt><dd>{m.approved_at ? `${fmtDateTime(m.approved_at)} by ${m.approved_by_name ?? '-'}` : '-'}</dd></div>
      </dl>
      <div className="app-actions mt">
        {(m.status === 'pending' || m.status === 'rejected') && (
          <form action={approveMember}><Hidden /><ConfirmButton className="btn btn-primary btn-sm" message="Approve this member?">Approve</ConfirmButton></form>
        )}
        {m.status === 'approved' && m.tier !== 'lifetime' && (
          <form action={renewMember}><Hidden /><ConfirmButton className="btn btn-primary btn-sm" message="Extend membership by one year?">Renew 1 year</ConfirmButton></form>
        )}
        {m.status === 'approved' && (
          <form action={setMemberStatus}><Hidden /><input type="hidden" name="status" value="suspended" /><ConfirmButton className="btn btn-danger btn-sm" message="Suspend this member? They will stop receiving notices.">Suspend</ConfirmButton></form>
        )}
        {m.status === 'suspended' && (
          <form action={setMemberStatus}><Hidden /><input type="hidden" name="status" value="approved" /><ConfirmButton className="btn btn-sm">Reactivate</ConfirmButton></form>
        )}
        {admin.role === 'super_admin' && (
          <form action={deleteMember}><Hidden /><ConfirmButton className="btn btn-danger btn-sm" message="Permanently delete this member record? This cannot be undone.">Delete</ConfirmButton></form>
        )}
      </div>
      <div className="card mt">
        <h3>Details</h3>
        <ActionForm action={updateMember}>
          <Hidden />
          <MemberFields m={m} />
        </ActionForm>
      </div>
      {history.length > 0 && (
        <div className="card mt">
          <h3>History</h3>
          <ul className="activity">
            {history.map((h, i) => <li key={i}><span>{h.name ?? 'System'}: {h.action.replace('member_', '')}</span><small className="muted">{fmtDateTime(h.created_at)}</small></li>)}
          </ul>
        </div>
      )}
    </>
  );
}
