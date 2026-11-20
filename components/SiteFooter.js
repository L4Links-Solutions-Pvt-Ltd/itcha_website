import Link from 'next/link';
import { nav, site } from '@/lib/site';

export default function SiteFooter() {
  const c = site.contact;
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <div className="footer-brand">
            <img src="/logo.png" alt="" width="56" height="56" />
            <div>
              <strong>{site.shortName}</strong>
              <div>{site.name}</div>
              <div>{site.state}</div>
            </div>
          </div>
          {site.registration && (
            <p className="muted-light">
              Registered under the {site.registration.act}, Reg. No. {site.registration.number}
            </p>
          )}
        </div>
        <div>
          <h4>On this site</h4>
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            {c.phone && <li><a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></li>}
            {c.email && <li><a href={`mailto:${c.email}`}>{c.email}</a></li>}
            {c.address && <li>{c.address}</li>}
            <li><Link href="/contact">Send us a message</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap footer-base">
        <span>&copy; {new Date().getFullYear()} {site.name}</span>
        <Link href="/admin">Committee login</Link>
      </div>
    </footer>
  );
}
