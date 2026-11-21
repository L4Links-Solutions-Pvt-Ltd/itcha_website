import Link from 'next/link';
import { site } from '@/lib/site';
import { centralCommittee, subCommittees, ecMembers } from '@/lib/central-committee';
import { areaCommittees } from '@/lib/area-committees';
import Icon from '@/components/Icon';
import OpenOnHash from '@/components/OpenOnHash';

export const metadata = {
  title: 'Committee',
  description: 'ITCHA central committee, sub-committees and area committees across the IT corridor.',
};

const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function Person({ name, role, note }) {
  return (
    <li>
      <strong>{name}</strong>
      {(role || note) && <span className="muted">{[role, note].filter(Boolean).join(' · ')}</span>}
    </li>
  );
}

export default function CommitteePage() {
  const memberCount = areaCommittees.reduce((n, a) => n + a.members.length, 0);
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Committee 2026</p>
          <h1>Who runs {site.shortName}</h1>
          <p className="lead">
            {site.shortName} works at two levels: a central committee for the whole IT corridor, and an area
            committee in each locality that looks after hostels nearby.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="org-chart">
            <a href="#central" className="org-node org-top">
              <Icon name="Landmark" size={26} />
              <strong>Central Committee</strong>
              <span>Office bearers, EC members from every area</span>
            </a>
            <div className="org-branches">
              <a href="#sub-committees" className="org-node">
                <Icon name="ClipboardCheck" size={22} />
                <strong>{subCommittees.length} sub-committees</strong>
                <span>Discipline, building owners, IT cell, sports &amp; culture, media</span>
              </a>
              <a href="#areas" className="org-node">
                <Icon name="MapPin" size={22} />
                <strong>{areaCommittees.length} area committees</strong>
                <span>{memberCount} office bearers and EC members</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="central">
        <div className="wrap">
          <p className="eyebrow">Central Committee</p>
          <h2>Central committee</h2>
          <div className="role-grid">
            {centralCommittee.map((g) => (
              <div key={g.title} className="card role-card">
                <h3>{g.title}</h3>
                <ul className="people">{g.members.map((m) => <Person key={m.name + (m.role || '')} {...m} />)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="sub-committees">
        <div className="wrap">
          <p className="eyebrow">Sub-committees</p>
          <h2>Sub-committees</h2>
          <div className="role-grid">
            {subCommittees.map((g) => (
              <div key={g.title} className="card role-card">
                <h3>{g.title}</h3>
                <ul className="people">{g.members.map((m) => <Person key={m.name} {...m} />)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="ec">
        <div className="wrap">
          <p className="eyebrow">Executive Committee</p>
          <h2>EC members by area</h2>
          <p className="muted">Each area sends members to the central committee&rsquo;s executive committee.</p>
          <div className="ec-grid">
            {ecMembers.map((g) => (
              <div key={g.area} className="ec-area">
                <h3>{g.area}</h3>
                <p>{g.members.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="areas">
        <div className="wrap">
          <p className="eyebrow">Area committees</p>
          <h2>Area committees</h2>
          <p className="muted">Each locality has its own committee. Tap an area to see its members.</p>
          <div className="chips area-jump">
            {areaCommittees.map((a) => <a key={a.area} href={`#area-${slug(a.area)}`} className="chip">{a.area}</a>)}
          </div>
          <OpenOnHash />
          <div className="area-list">
            {areaCommittees.map((a) => {
              const bearers = a.members.filter((m) => m.role !== 'EC Member');
              const ec = a.members.filter((m) => m.role === 'EC Member');
              return (
                <details key={a.area} id={`area-${slug(a.area)}`} className="card area-card">
                  <summary>
                    <span><Icon name="MapPin" size={18} />{a.area}</span>
                    <small>{a.members.length} members</small>
                  </summary>
                  <ul className="people people-cols">{bearers.map((m) => <Person key={m.name + m.role} {...m} />)}</ul>
                  {ec.length > 0 && (
                    <>
                      <h4>EC members</h4>
                      <p className="ec-names">{ec.map((m) => m.name).join(', ')}</p>
                    </>
                  )}
                </details>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap"><div className="cta-band">
          <h2>Run a hostel in one of these areas?</h2>
          <Link href="/membership#apply" className="btn btn-primary">Apply for membership <Icon name="ArrowRight" size={18} className="" /></Link>
        </div></div>
      </section>
    </>
  );
}
