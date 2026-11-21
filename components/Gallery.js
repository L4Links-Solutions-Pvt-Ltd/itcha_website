'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Photo grid with a keyboard-friendly lightbox. `variant="mosaic"` is the home-page strip.
export default function Gallery({ photos, label, variant = 'grid' }) {
  const [open, setOpen] = useState(-1);
  const close = useCallback(() => setOpen(-1), []);
  const step = useCallback((d) => setOpen((i) => (i + d + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, close, step]);

  const cur = photos[open];
  return (
    <>
      <div className={variant === 'mosaic' ? 'photo-mosaic' : 'photo-grid'}>
        {photos.map((ph, i) => (
          <button key={ph.src} type="button" className="photo" onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${photos.length}${label ? ` from ${label}` : ''}`}>
            <img src={ph.thumb} alt="" width={ph.w} height={ph.h} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      {cur && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={label || 'Photo'} onClick={close}>
          <img src={cur.src} alt="" width={cur.w} height={cur.h} onClick={(e) => e.stopPropagation()} />
          <p className="lightbox-cap">{cur.album || label} &middot; {open + 1} / {photos.length}</p>
          <button type="button" className="lb-btn lb-close" onClick={close} aria-label="Close"><X size={26} /></button>
          {photos.length > 1 && (
            <>
              <button type="button" className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo"><ChevronLeft size={30} /></button>
              <button type="button" className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo"><ChevronRight size={30} /></button>
            </>
          )}
        </div>
      )}
    </>
  );
}
