import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { site } from '@/lib/site';
import { logout } from '../actions';
import AdminNav from '@/components/admin/AdminNav';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard', robots: { index: false } };

export default async function PanelLayout({ children }) {
  const admin = await requireAdmin();
  const [{ pending, enquiries }] = await db()`
    SELECT (SELECT count(*)::int FROM members WHERE status = 'pending') AS pending,
           (SELECT count(*)::int FROM enquiries WHERE status = 'new') AS enquiries`;
  const items = [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/applications', label: 'Applications', badge: pending },
    { href: '/admin/members', label: 'Members' },
    { href: '/admin/notices', label: 'Notices & notifications' },
    { href: '/admin/events', label: 'Events' },
    { href: '/admin/enquiries', label: 'Enquiries', badge: enquiries },
    ...(admin.role === 'super_admin' ? [{ href: '/admin/admins', label: 'Committee logins' }] : []),
    { href: '/admin/account', label: 'My account' },
  ];
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link href="/admin" className="admin-brand">
          <img src="/logo.png" alt="" width="40" height="40" />
          <strong>{site.shortName} dashboard</strong>
        </Link>
        <AdminNav items={items} />
        <div className="admin-user">
          <div>{admin.name}</div>
          <small className="muted">{admin.role === 'super_admin' ? 'Super admin' : 'Committee'}</small>
          <div className="admin-user-links">
            <Link href="/" target="_blank">View site</Link>
            <form action={logout}><button className="link">Sign out</button></form>
          </div>
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
