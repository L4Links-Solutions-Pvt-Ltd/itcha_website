import { site, formatFee } from '@/lib/site';
import MembershipForm from '@/components/MembershipForm';

export const metadata = { title: 'Membership' };

export default function Membership() {
  const m = site.membership;
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Membership</p>
          <h1>Be a responsible hostel owner. Be an {site.shortName} member.</h1>
          <p className="lead">{m.eligibility}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid-2">
            {m.tiers.map((t) => (
              <div key={t.id} className="card tier">
                <h3>{t.name}</h3>
                <p className="price">{formatFee(t.fee) ?? 'Fee announced soon'}</p>
                {t.fee != null && <p className="muted">{t.period}</p>}
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap split">
          <div>
            <h2>Member benefits</h2>
            <ul className="checks">{m.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
          <div>
            <h2>How it works</h2>
            <ol className="steps">
              {m.steps.map((s, i) => <li key={s}><span>{i + 1}</span>{s}</li>)}
            </ol>
          </div>
        </div>
      </section>

      <section className="section" id="apply">
        <div className="wrap narrow">
          <h2>Apply for membership</h2>
          <p className="muted">Fields marked * are required. Your details are only used by the association.</p>
          <MembershipForm />
        </div>
      </section>
    </>
  );
}
