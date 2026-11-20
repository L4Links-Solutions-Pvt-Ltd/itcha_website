'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav({ items }) {
  const path = usePathname();
  return (
    <nav className="admin-nav">
      {items.map((i) => {
        const active = i.href === '/admin' ? path === '/admin' : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} className={active ? 'active' : ''}>
            {i.label}
            {i.badge ? <span className="badge">{i.badge}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
