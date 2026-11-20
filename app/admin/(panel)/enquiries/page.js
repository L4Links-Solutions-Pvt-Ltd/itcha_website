import { db } from '@/lib/db';
import { fmtDateTime } from '@/lib/format';
import { toggleEnquiry } from '../../actions';
import ConfirmButton from '@/components/admin/ConfirmButton';

export default async function Enquiries() {
  const rows = await db()`SELECT * FROM enquiries ORDER BY (status = 'new') DESC, created_at DESC LIMIT 200`;
  return (
    <>
      <h1>Enquiries</h1>
      <p className="muted">Messages sent from the website&rsquo;s Contact page.</p>
      {rows.length === 0 && <p className="muted">No messages yet.</p>}
      {rows.map((r) => (
        <div key={r.id} className={`card enquiry${r.status === 'closed' ? ' closed' : ''}`}>
          <div className="app-head">
            <div>
              <h3>{r.name}</h3>
              <p className="muted"><a href={`tel:+91${r.phone}`}>{r.phone}</a>{r.email && <> &middot; <a href={`mailto:${r.email}`}>{r.email}</a></>} &middot; {fmtDateTime(r.created_at)}</p>
            </div>
            <form action={toggleEnquiry}><input type="hidden" name="id" value={r.id} /><ConfirmButton>{r.status === 'new' ? 'Mark handled' : 'Reopen'}</ConfirmButton></form>
          </div>
          <p className="pre">{r.message}</p>
        </div>
      ))}
    </>
  );
}
