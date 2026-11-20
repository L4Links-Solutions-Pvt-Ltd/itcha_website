'use client';
import { useActionState } from 'react';
import { sendEnquiry } from '@/app/actions/public';

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendEnquiry, null);
  if (state?.ok) {
    return <div className="card success"><h3>Message sent</h3><p>Thank you. Someone from the association will get back to you.</p></div>;
  }
  const v = state?.values ?? {};
  return (
    <form action={action} className="form card">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <div className="form-grid">
        <label>Name *<input name="name" required maxLength={120} defaultValue={v.name} autoComplete="name" /></label>
        <label>Mobile number *<input name="phone" required inputMode="tel" maxLength={16} defaultValue={v.phone} autoComplete="tel" /></label>
        <label className="span-2">Email<input name="email" type="email" maxLength={160} defaultValue={v.email} autoComplete="email" /></label>
        <label className="span-2">Message *<textarea name="message" required rows={5} maxLength={3000} defaultValue={v.message} /></label>
      </div>
      {state?.error && <p className="error" role="alert">{state.error}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
