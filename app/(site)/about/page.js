import Link from 'next/link';
import { site } from '@/lib/site';
import Committee from '@/components/Committee';

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
            <h3>Our mission</h3>
            <p>{site.mission}</p>
          </div>
          <div className="card">
            <h3>Our vision</h3>
            <p>{site.vision}</p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <h2>What we stand for</h2>
          <div className="grid-4">
            {site.values.map((v) => (
              <div key={v.title} className="card">
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Our work</h2>
          <div className="grid-2">
            {site.focusAreas.map((f) => (
              <div key={f.title} className="card">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {site.areas.length > 0 && (
        <section className="section alt">
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
          </div>
        </section>
      )}

      {site.registration && (
        <section className="section alt">
          <div className="wrap">
            <h2>Registration</h2>
            <p>
              {site.name} is registered under the {site.registration.act} (Reg. No. {site.registration.number}
              {site.registration.year ? `, ${site.registration.year}` : ''}).
            </p>
          </div>
        </section>
      )}

      <section className="section cta-band">
        <div className="wrap cta-row">
          <h2>Run a hostel in the IT corridor?</h2>
          <Link href="/membership#apply" className="btn btn-gold">Apply for membership</Link>
        </div>
      </section>
    </>
  );
}
