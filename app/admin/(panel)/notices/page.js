import Link from 'next/link';
import { db } from '@/lib/db';
import { channels } from '@/lib/notify';
import { CATEGORY_LABEL, fmtDateTime } from '@/lib/format';
import { createNotice, deleteNotice, resendNotice, toggleNotice } from '../../actions';
import ActionForm from '@/components/admin/ActionForm';
import ConfirmButton from '@/components/admin/ConfirmButton';
import ChannelPicker from '@/components/admin/ChannelPicker';

export default async function Notices() {
  const sql = db();
  const [notices, logs, [{ n: active }]] = await Promise.all([
    sql`SELECT n.*, a.name AS author FROM notices n LEFT JOIN admins a ON a.id = n.created_by ORDER BY n.created_at DESC LIMIT 100`,
    sql`SELECT * FROM notification_logs ORDER BY created_at DESC LIMIT 300`,
    sql`SELECT count(*)::int AS n FROM members WHERE status = 'approved' AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)`,
  ]);
  const email = channels.email();
  const whatsapp = channels.whatsapp();
  return (
    <>
      <h1>Notices &amp; notifications</h1>
      <div className="card">
        <h3>New notice</h3>
        <p className="muted">
          Public notices appear on the website&rsquo;s Notices page. Members-only notices are not shown on the website and are only sent by the channels you tick.
          Active members right now: {active}.
        </p>
        <ActionForm action={createNotice} submitLabel="Save &amp; send" pendingLabel="Sending…" resetOnSuccess>
          <div className="form-grid">
            <label className="span-2">Title *<input name="title" required maxLength={200} /></label>
            <label>Type
              <select name="category" defaultValue="update">
                {Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label>Who can see it
              <select name="audience" defaultValue="public">
                <option value="public">Public (website + members)</option>
                <option value="members">Members only</option>
              </select>
            </label>
            <label className="span-2">Message *<textarea name="body" required rows={7} maxLength={10000} /></label>
            <ChannelPicker email={email} whatsapp={whatsapp} />
          </div>
        </ActionForm>
      </div>

      <h2 className="mt">Sent and published</h2>
      {notices.length === 0 && <p className="muted">No notices yet.</p>}
      {notices.map((n) => {
        const nlogs = logs.filter((l) => l.notice_id === n.id);
        return (
          <div key={n.id} className="card notice-admin">
            <div className="app-head">
              <div>
                <h3>{n.title}</h3>
                <p className="muted">
                  {CATEGORY_LABEL[n.category]} &middot; {n.audience === 'public' ? 'Public' : 'Members only'} &middot; {fmtDateTime(n.created_at)} &middot; {n.author ?? '-'}
                  {n.audience === 'public' && !n.published && ' · hidden from website'}
                </p>
              </div>
              {n.audience === 'public' && n.published && <Link href={`/notices/${n.id}`} target="_blank">View</Link>}
            </div>
            <details>
              <summary>Message</summary>
              <div className="pre">{n.body}</div>
            </details>
            {nlogs.length > 0 && (
              <ul className="activity">
                {nlogs.map((l) => (
                  <li key={l.id}>
                    <span>{l.channel}: {l.sent}/{l.recipients} sent{l.failed ? `, ${l.failed} failed` : ''}{l.details?.area ? ` (area: ${l.details.area})` : ''}{l.details?.errors?.length ? ` — ${l.details.errors.join('; ')}` : ''}</span>
                    <small className="muted">{fmtDateTime(l.created_at)}</small>
                  </li>
                ))}
              </ul>
            )}
            <div className="app-actions">
              {n.audience === 'public' && (
                <form action={toggleNotice}><input type="hidden" name="id" value={n.id} /><ConfirmButton>{n.published ? 'Hide from website' : 'Show on website'}</ConfirmButton></form>
              )}
              <form action={deleteNotice}><input type="hidden" name="id" value={n.id} /><ConfirmButton className="btn btn-danger btn-sm" message="Delete this notice?">Delete</ConfirmButton></form>
            </div>
            {(email || whatsapp) && (
              <details>
                <summary>Send again</summary>
                <ActionForm action={resendNotice} submitLabel="Send" pendingLabel="Sending…">
                  <input type="hidden" name="id" value={n.id} />
                  <ChannelPicker email={email} whatsapp={whatsapp} />
                </ActionForm>
              </details>
            )}
          </div>
        );
      })}
    </>
  );
}
