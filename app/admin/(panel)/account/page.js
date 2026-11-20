import { requireAdmin } from '@/lib/auth';
import { changeOwnPassword } from '../../actions';
import ActionForm from '@/components/admin/ActionForm';

export default async function Account() {
  const me = await requireAdmin();
  return (
    <>
      <h1>My account</h1>
      <p className="muted">{me.name} &middot; {me.email}</p>
      <div className="card narrow-card">
        <h3>Change password</h3>
        <ActionForm action={changeOwnPassword} submitLabel="Change password" resetOnSuccess>
          <label>Current password<input name="current" type="password" required autoComplete="current-password" /></label>
          <label>New password (10+ characters)<input name="next" type="password" required minLength={10} autoComplete="new-password" /></label>
        </ActionForm>
      </div>
    </>
  );
}
