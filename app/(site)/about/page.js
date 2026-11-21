import Link from 'next/link';
import { site } from '@/lib/site';
import Committee from '@/components/Committee';
import Icon from '@/components/Icon';
import { Tiles } from '@/components/Tiles';

export const metadata = { title: 'About' };

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">About {site.shortName}</p>
          <h1>Built by hostel owners, for hostel owners.</h1>
          <p className="lead">
            {site.name} is a community of hostel, PG and co-living owners in the IT corridor of {site.state}.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div className="card">
            <span className="tile-icon tone-teal"><Icon name="HandHeart" size={24} /></span>
            <h3>Our mission</h3>
            <p>{site.mission}</p>
          </div>
          <div className="card">
            <span className="tile-icon tone-gold"><Icon name="Eye" size={24} /></span>
            <h3>Our vision</h3>
            <p>{site.vision}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>What we stand for</h2>
          <Tiles items={site.values} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Our work</h2>
          <Tiles items={site.focusAreas} cols={2} />
        </div>
      </section>

      {site.areas.length > 0 && (
        <section className="section">
          <div className="wrap">
            <h2>Where we are</h2>
            <div className="chips">{site.areas.map((a) => <span key={a} className="chip">{a}</span>)}</div>
          </div>
        </section>
      )}

      {site.committee.length > 0 && (
        <section className="section">
          <div className="wrap">
            <h2>Office bearers</h2>
            <Committee />
            <p className="mt"><Link href="/committee">Full central committee and area committees <Icon name="ChevronRight" size={16} className="" /></Link></p>
          </div>
        </section>
      )}

      {site.registration && (
        <section className="section">
          <div className="wrap">
            <h2>Registration</h2>
            <p>
              {site.shortName} is registered as {site.registration.registeredName || site.name}
              {site.registration.act ? ` under the ${site.registration.act}` : ''}, Reg. No. {site.registration.number}.
            </p>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap"><div className="cta-band">
          <h2>Run a hostel in the IT corridor?</h2>
          <Link href="/membership#apply" className="btn btn-primary">Apply for membership <Icon name="ArrowRight" size={18} className="" /></Link>
        </div></div>
      </section>
    </>
  );
}
