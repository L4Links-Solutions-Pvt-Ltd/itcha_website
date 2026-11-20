import Link from 'next/link';
import { site, formatFee } from '@/lib/site';
import { upcomingEvents, publicNotices } from '@/lib/public-data';
import EventList from '@/components/EventList';
import NoticeList from '@/components/NoticeList';
import Committee from '@/components/Committee';

export const revalidate = 300;

export default async function Home() {
  const [events, notices] = await Promise.all([upcomingEvents(3), publicNotices(5)]);
  const annual = site.membership.tiers[0];
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">{site.name} &middot; {site.state}</p>
            <h1>Hostel owners of the IT corridor, together.</h1>
            <p className="lead">{site.tagline}</p>
            <div className="hero-cta">
              <Link href="/membership#apply" className="btn btn-gold">Become a member</Link>
              <Link href="/about" className="btn btn-ghost">About {site.shortName}</Link>
            </div>
            {formatFee(annual.fee) && (
              <p className="hero-note">{annual.name}: {formatFee(annual.fee)} {annual.period}</p>
            )}
          </div>
          <div className="hero-logo">
            <img src="/logo.png" alt={`${site.shortName} logo`} width="360" height="360" />
          </div>
        </div>
      </section>

      {site.stats.length > 0 && (
        <section className="stats">
          <div className="wrap stats-row">
            {site.stats.map((s) => (
              <div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">What we do</p>
          <h2>Know the rules. Follow the process. Run a safer hostel.</h2>
          <div className="grid-4">
            {site.focusAreas.map((f) => (
              <div key={f.title} className="card">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap split">
          <div>
            <p className="eyebrow">Membership</p>
            <h2>Be part of one strong voice</h2>
            <p>{site.membership.eligibility}</p>
            <ul className="checks">
              {site.membership.benefits.slice(0, 4).map((b) => <li key={b}>{b}</li>)}
            </ul>
            <Link href="/membership" className="btn btn-primary">Membership details</Link>
          </div>
          <ol className="steps">
            {site.membership.steps.map((s, i) => (
              <li key={s}><span>{i + 1}</span>{s}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap two-col">
          <div>
            <div className="section-head">
              <h2>Upcoming events</h2>
              <Link href="/events">All events &rarr;</Link>
            </div>
            <EventList events={events} empty="No upcoming events right now. Check back soon." />
          </div>
          <div>
            <div className="section-head">
              <h2>Latest notices</h2>
              <Link href="/notices">All notices &rarr;</Link>
            </div>
            <NoticeList notices={notices} empty="No notices yet." />
          </div>
        </div>
      </section>

      {site.committee.length > 0 && (
        <section className="section alt">
          <div className="wrap">
            <p className="eyebrow">Leadership</p>
            <h2>Office bearers</h2>
            <Committee />
          </div>
        </section>
      )}
    </>
  );
}
