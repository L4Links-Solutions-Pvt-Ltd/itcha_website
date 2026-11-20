import { upcomingEvents, pastEvents } from '@/lib/public-data';
import EventList from '@/components/EventList';

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
    </>
  );
}
