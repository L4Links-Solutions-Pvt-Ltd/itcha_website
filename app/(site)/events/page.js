import { upcomingEvents, pastEvents } from '@/lib/public-data';
import EventList from '@/components/EventList';
import Gallery from '@/components/Gallery';
import Icon from '@/components/Icon';
import { albums } from '@/lib/gallery';
import { fmtDate } from '@/lib/format';

export const metadata = { title: 'Events' };
export const revalidate = 300;

export default async function Events() {
  const [upcoming, past] = await Promise.all([upcomingEvents(), pastEvents()]);
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Events</p>
          <h1>Meetings, workshops and awareness programmes</h1>
        </div>
      </section>
      <section className="section">
        <div className="wrap narrow">
          <h2>Upcoming</h2>
          <EventList events={upcoming} empty="No upcoming events right now. Check back soon." />
          {past.length > 0 && (
            <>
              <h2 className="mt">Past events</h2>
              <EventList events={past} empty="" />
            </>
          )}
        </div>
      </section>
      {albums.length > 0 && (
        <section className="section" id="photos">
          <div className="wrap">
            <p className="eyebrow">Gallery</p>
            <h2>Photos from our events</h2>
            {albums.map((a) => (
              <div key={a.slug} className="album" id={a.slug}>
                <h3>{a.title}</h3>
                {(a.date || a.time || a.location) && (
                  <p className="album-meta">
                    {a.date && <span><Icon name="CalendarDays" size={16} />{fmtDate(`${a.date}T12:00:00+05:30`)}</span>}
                    {a.time && <span><Icon name="Clock" size={16} />{a.time}</span>}
                    {a.location && <span><Icon name="MapPin" size={16} />{a.location}</span>}
                  </p>
                )}
                <Gallery photos={a.photos} label={a.title} />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
