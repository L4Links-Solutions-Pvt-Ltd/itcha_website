import { db } from '@/lib/db';
import { fmtDateTime } from '@/lib/format';
import { createEvent, deleteEvent, toggleEvent } from '../../actions';
import ActionForm from '@/components/admin/ActionForm';
import ConfirmButton from '@/components/admin/ConfirmButton';

export default async function Events() {
  const events = await db()`SELECT * FROM events ORDER BY starts_at DESC LIMIT 200`;
  return (
    <>
      <h1>Events</h1>
      <div className="card">
        <h3>Add event</h3>
        <ActionForm action={createEvent} submitLabel="Add event" resetOnSuccess>
          <div className="form-grid">
            <label className="span-2">Title *<input name="title" required maxLength={200} /></label>
            <label>Date &amp; time (IST) *<input name="starts_at" type="datetime-local" required /></label>
            <label>Venue<input name="venue" maxLength={300} /></label>
            <label className="span-2">Details<textarea name="description" rows={4} maxLength={5000} /></label>
          </div>
        </ActionForm>
        <p className="muted small">Tip: to tell members about an event, also post a meeting notice under Notices.</p>
      </div>
      <div className="table-wrap mt">
        <table className="table">
          <thead><tr><th>When</th><th>Title</th><th>Venue</th><th>On website</th><th></th></tr></thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>{fmtDateTime(e.starts_at)}</td>
                <td>{e.title}</td>
                <td>{e.venue ?? '-'}</td>
                <td>
                  <form action={toggleEvent}><input type="hidden" name="id" value={e.id} /><ConfirmButton>{e.published ? 'Shown – hide' : 'Hidden – show'}</ConfirmButton></form>
                </td>
                <td>
                  <form action={deleteEvent}><input type="hidden" name="id" value={e.id} /><ConfirmButton className="btn btn-danger btn-sm" message="Delete this event?">Delete</ConfirmButton></form>
                </td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan={5} className="muted">No events yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
