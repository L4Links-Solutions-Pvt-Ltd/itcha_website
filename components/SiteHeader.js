'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { nav, site } from '@/lib/site';

export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="" width="48" height="48" />
          <span>
            <strong>{site.shortName}</strong>
            <small>{site.name}</small>
          </span>
        </Link>
        <button className="menu-btn" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
          <span />
          <span />
          <span />
        </button>
        <nav className={open ? 'nav open' : 'nav'}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={(n.href === '/' ? path === '/' : path.startsWith(n.href)) ? 'active' : ''}
            >
              {n.label}
            </Link>
          ))}
          <Link href="/membership#apply" className="btn btn-gold" onClick={() => setOpen(false)}>
            Become a member
          </Link>
        </nav>
      </div>
    </header>
  );
}
