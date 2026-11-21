'use client';
import { useActionState } from 'react';
import { applyForMembership } from '@/app/actions/public';
import { HOSTEL_TYPES, site } from '@/lib/site';
import { AREAS } from '@/lib/areas';

export default function MembershipForm() {
  const [state, action, pending] = useActionState(applyForMembership, null);
  if (state?.ok) {
    return (
      <div className="card success">
        <h3>{state.duplicate ? 'We already have your application' : 'Application received'}</h3>
        <p>
          Thank you. The committee will review your application and contact you on the mobile number you gave.
          Once approved you will get your membership number.
        </p>
      </div>
    );
  }
  const v = state?.values ?? {};
  return (
    <form action={action} className="form card">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <div className="form-grid">
        <label>Owner name *<input name="owner_name" required maxLength={120} defaultValue={v.owner_name} autoComplete="name" /></label>
        <label>Mobile number *<input name="phone" required inputMode="tel" maxLength={16} defaultValue={v.phone} autoComplete="tel" placeholder="10-digit mobile" /></label>
        <label>Email<input name="email" type="email" maxLength={160} defaultValue={v.email} autoComplete="email" /></label>
        <label>Hostel name *<input name="hostel_name" required maxLength={160} defaultValue={v.hostel_name} /></label>
        <label>Hostel type *
          <select name="hostel_type" required defaultValue={v.hostel_type || ''}>
            <option value="" disabled>Choose</option>
            {HOSTEL_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </label>
        <label>Area / locality *
          <select name="area" required defaultValue={v.area ?? ''}>
            <option value="" disabled>Choose your area</option>
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label>Number of beds<input name="beds" inputMode="numeric" maxLength={5} defaultValue={v.beds} /></label>
        <label>Number of branches<input name="branches" inputMode="numeric" maxLength={3} defaultValue={v.branches || '1'} /></label>
        <label className="span-2">Hostel address<textarea name="address" rows={2} maxLength={400} defaultValue={v.address} /></label>
        <label className="span-2">Membership type
          <select name="tier" defaultValue={v.tier || site.membership.tiers[0].id}>
            {site.membership.tiers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
      </div>
      <label className="check">
        <input type="checkbox" name="consent" required /> I run this hostel and agree to follow the association&rsquo;s rules and safety standards.
      </label>
      {state?.error && <p className="error" role="alert">{state.error}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? 'Submitting…' : 'Submit application'}</button>
    </form>
  );
}
