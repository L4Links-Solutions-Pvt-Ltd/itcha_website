'use client';

import { useEffect } from 'react';

// Opens the <details> element the URL hash points at (e.g. /committee#area-kondapur).
export default function OpenOnHash() {
  useEffect(() => {
    const open = () => {
      const el = window.location.hash && document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (el && el.tagName === 'DETAILS') {
        el.open = true;
        el.scrollIntoView({ block: 'start' });
      }
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);
  return null;
}
