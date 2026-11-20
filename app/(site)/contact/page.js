import { site } from '@/lib/site';
import ContactForm from '@/components/ContactForm';
import Icon from '@/components/Icon';

export const metadata = { title: 'Contact' };

export default function Contact() {
  const c = site.contact;
  const any = c.phone || c.email || c.address;
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Contact</p>
          <h1>Get in touch</h1>
          <p className="lead">Questions about membership, an issue at your hostel, or an event? Write to us.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap split">
          <ContactForm />
          {any && (
            <div className="card">
              <h3>Association office</h3>
              <ul className="plain contact-list">
                {c.phone && <li><Icon name="Phone" /><strong>Phone</strong><a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></li>}
                {c.email && <li><Icon name="Mail" /><strong>Email</strong><a href={`mailto:${c.email}`}>{c.email}</a></li>}
                {c.address && <li><Icon name="MapPin" /><strong>Address</strong>{c.address}</li>}
                {c.hours && <li><Icon name="Clock" /><strong>Office hours</strong>{c.hours}</li>}
                {c.mapUrl && <li><a href={c.mapUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></li>}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
