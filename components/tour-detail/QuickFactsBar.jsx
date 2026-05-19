'use client';

import React, { useEffect, useRef } from 'react';

export function QuickFactsBar({ duration, difficultyLabel, ascent, length, group, priceFrom, labels }) {
  const barRef = useRef(null);

  // Publish our rendered height as a CSS variable so that the sticky
  // BookingPanel (top-[var(--quick-facts-height,4rem)]) sits flush below
  // this bar instead of overlapping with it.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const publish = () => {
      const h = el.offsetHeight;
      document.documentElement.style.setProperty('--quick-facts-height', `${h}px`);
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--quick-facts-height');
    };
  }, []);

  const items = [
    { value: duration, label: labels?.duration },
    { value: difficultyLabel, label: labels?.difficulty },
    { value: ascent != null ? `${ascent} m` : null, label: labels?.ascent },
    { value: length != null ? `${length} km` : null, label: labels?.length },
    { value: group != null ? `${group} osoba` : null, label: labels?.group },
    { value: priceFrom != null ? `${labels?.priceFrom ?? ''} ${priceFrom}€` : null, label: labels?.price },
  ].filter((i) => i.value != null);

  return (
    <div ref={barRef} className="sticky top-0 z-20 bg-wildher-surface border-b border-neutral-200 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-wrap justify-between gap-4 text-sm">
          {items.map(({ value, label }, idx) => (
            <span key={idx} className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-1">
              {label && <span className="text-wildher-text-muted">{label}</span>}
              <span className="font-semibold text-wildher-text">{value}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
