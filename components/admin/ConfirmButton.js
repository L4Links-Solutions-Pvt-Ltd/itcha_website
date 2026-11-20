'use client';
import { useFormStatus } from 'react-dom';

// Submit button that asks for confirmation first. Place inside a <form action={serverAction}>.
export default function ConfirmButton({ message, children, className = 'btn btn-sm' }) {
  const { pending } = useFormStatus();
  return (
    <button
      className={className}
      disabled={pending}
      onClick={(e) => {
        if (message && !window.confirm(message)) e.preventDefault();
      }}
    >
      {pending ? '…' : children}
    </button>
  );
}
