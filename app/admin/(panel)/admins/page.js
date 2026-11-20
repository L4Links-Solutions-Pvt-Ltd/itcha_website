import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { fmtDateTime } from '@/lib/format';
import { createAdmin, resetAdminPassword, toggleAdmin } from '../../actions';
import ActionForm from '@/components/admin/ActionForm';
import ConfirmButton from '@/components/admin/ConfirmButton';

export default async function Admins() {
  const me = await requireAdmin();
  if (me.role !== 'super_admin') redirect('/admin');
  const admins = await db()`SELECT id, name, email, role, active, last_login_at FROM admins ORDER BY active DESC, name`;
  return (
    <>
      <h1>Committee logins</h1>
      <p className="muted">Super admins can manage logins and delete member records. Committee members can do everything else.</p>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Last sign-in</th><th>Status</th><th>Reset password</th></tr></thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.role === 'super_admin' ? 'Super admin' : 'Committee'}</td>
                <td>{a.last_login_at ? fmtDateTime(a.last_login_at) : 'Never'}</td>
                <td>
                  {a.id === me.id ? 'You' : (
                    <form action={toggleAdmin}><input type="hidden" name="id" value={a.id} />
                      <ConfirmButton className={a.active ? 'btn btn-danger btn-sm' : 'btn btn-sm'} message={a.active ? `Deactivate ${a.name}?` : undefined}>{a.active ? 'Deactivate' : 'Activate'}</ConfirmButton>
                    </form>
                  )}
                </td>
                <td>
                  {a.id !== me.id && (
                    <ActionForm action={resetAdminPassword} submitLabel="Reset" className="inline-form">
                      <input type="hidden" name="id" value={a.id} />
                      <input name="password" type="password" placeholder="New password (10+)" minLength={10} required autoComplete="new-password" />
                    </ActionForm>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card mt">
        <h3>Add a login</h3>
        <ActionForm action={createAdmin} submitLabel="Create login" resetOnSuccess>
          <div className="form-grid">
            <label>Name *<input name="name" required maxLength={120} /></label>
            <label>Email *<input name="email" type="email" required maxLength={160} /></label>
            <label>Temporary password *<input name="password" type="password" required minLength={10} autoComplete="new-password" /></label>
            <label>Role
              <select name="role" defaultValue="committee"><option value="committee">Committee</option><option value="super_admin">Super admin</option></select>
            </label>
          </div>
        </ActionForm>
      </div>
    </>
  );
}
