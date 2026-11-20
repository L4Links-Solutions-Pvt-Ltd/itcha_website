import { redirect } from 'next/navigation';
import { currentAdmin } from '@/lib/auth';
import { hasDb } from '@/lib/db';
import { site } from '@/lib/site';
import LoginForm from './LoginForm';

export const metadata = { title: 'Committee login', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (hasDb() && (await currentAdmin().catch(() => null))) redirect('/admin');
  return (
    <main className="login-page">
      <div className="card login-card">
        <img src="/logo.png" alt="" width="96" height="96" />
        <h1>{site.shortName} dashboard</h1>
        <p className="muted">For authorised committee members only.</p>
        {hasDb() ? <LoginForm /> : <p className="error">The database is not configured yet.</p>}
      </div>
    </main>
  );
}
