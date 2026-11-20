import { fmtDateTime, fmtDay, fmtMonth } from '@/lib/format';

export default function EventList({ events, empty }) {
  if (!events.length) return <p className="muted">{empty}</p>;
  return (
    <div className="event-list">
      {events.map((e) => (
        <article key={e.id} className="event card">
          <div className="event-date">
            <span>{fmtDay(e.starts_at)}</span>
            <small>{fmtMonth(e.starts_at)}</small>
          </div>
          <div>
            <h3>{e.title}</h3>
            <p className="muted">
              {fmtDateTime(e.starts_at)}
              {e.venue ? ` · ${e.venue}` : ''}
            </p>
            {e.description && <p className="pre">{e.description}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
