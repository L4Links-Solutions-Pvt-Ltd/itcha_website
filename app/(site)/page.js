import Link from 'next/link';
import { site, formatFee } from '@/lib/site';
import { upcomingEvents, publicNotices } from '@/lib/public-data';
import EventList from '@/components/EventList';
import NoticeList from '@/components/NoticeList';
import Committee from '@/components/Committee';
import Icon from '@/components/Icon';
import HeroVideo from '@/components/HeroVideo';
import { Checks, Steps, Tiles } from '@/components/Tiles';

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
            <h1>Hostel owners of the IT corridor, <span className="hl">together.</span></h1>
            <p className="lead">{site.tagline}</p>
            <div className="hero-cta">
              <Link href="/membership#apply" className="btn btn-primary">Become a member <Icon name="ArrowRight" size={18} className="" /></Link>
              <Link href="/about" className="btn btn-light">About {site.shortName}</Link>
            </div>
            {formatFee(annual.fee) && (
              <p className="hero-note">{annual.name}: {formatFee(annual.fee)} {annual.period}</p>
            )}
          </div>
          {site.heroVideo ? (
            <HeroVideo {...site.heroVideo} />
          ) : (
            <div className="hero-logo">
              <img src="/logo.png" alt={`${site.shortName} logo`} width="360" height="360" />
            </div>
          )}
        </div>
      </section>

      {site.stats.length > 0 && (
        <section className="section-tight">
          <div className="wrap">
            <div className="stats-row card">
              {site.stats.map((s) => (
                <div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <div className="section-intro">
            <p className="eyebrow">What we do</p>
            <h2>Know the rules. Follow the process. Run a safer hostel.</h2>
          </div>
          <Tiles items={site.focusAreas} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="panel split">
            <div>
              <p className="eyebrow">Membership</p>
              <h2>Be part of one strong voice</h2>
              <p className="muted">{site.membership.eligibility}</p>
              <Checks items={site.membership.benefits.slice(0, 4)} />
              <Link href="/membership" className="btn btn-primary">Membership details <Icon name="ArrowRight" size={18} className="" /></Link>
            </div>
            <Steps steps={site.membership.steps} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap two-col">
          <div>
            <div className="section-head">
              <h2>Upcoming events</h2>
              <Link href="/events">View all <Icon name="ChevronRight" size={16} className="" /></Link>
            </div>
            <EventList events={events} empty="No upcoming events right now. Check back soon." />
          </div>
          <div>
            <div className="section-head">
              <h2>Latest notices</h2>
              <Link href="/notices">View all <Icon name="ChevronRight" size={16} className="" /></Link>
            </div>
            <NoticeList notices={notices} empty="No notices yet." />
          </div>
        </div>
      </section>

      {site.committee.length > 0 && (
        <section className="section">
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
