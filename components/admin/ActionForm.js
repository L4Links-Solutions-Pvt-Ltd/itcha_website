'use client';
import { useActionState, useEffect, useRef } from 'react';

// Wraps a server action that returns { ok } or { error } and shows the result.
export default function ActionForm({ action, children, submitLabel = 'Save', pendingLabel = 'Saving…', resetOnSuccess = false, className = 'form' }) {
  const [state, formAction, pending] = useActionState(action, null);
  const ref = useRef(null);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      {state?.error && <p className="error" role="alert">{state.error}</p>}
      {state?.ok && <p className="ok" role="status">{state.ok}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? pendingLabel : submitLabel}</button>
    </form>
  );
}
