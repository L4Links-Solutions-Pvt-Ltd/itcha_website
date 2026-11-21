'use client';

import { useEffect, useRef } from 'react';

// Muted, looping hero clip. Autoplays unless the visitor prefers reduced motion,
// in which case it stays on the poster frame and they can press play.
export default function HeroVideo({ src, poster, caption }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.pause();
      v.controls = true;
    } else {
      v.play().catch(() => { v.controls = true; });
    }
  }, []);

  return (
    <figure className="hero-video">
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={caption || 'ITCHA video'} />
      {caption && <figcaption><span className="live-dot" aria-hidden="true" />{caption}</figcaption>}
    </figure>
  );
}
