'use client';

import React, { useState, useEffect } from 'react';

/**
 * Sticky bottom CTA bar shown only on mobile (lg:hidden).
 * Hides itself when the desktop BookingPanel (#booking) scrolls into view —
 * the two would otherwise stack a redundant CTA. When the tour is sold out
 * we render nothing because there is no actionable CTA.
 */
export function MobileBookingBar({
  priceFrom,
  priceLabel,
  bookCta,
  bookHref,
  isExternalPayment = false,
  status,
  statusLabel,
}) {
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const target = document.getElementById('booking');
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        setPanelVisible(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.1 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (status === 'sold_out') return null;
  if (panelVisible) return null;

  const linkProps = isExternalPayment
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 lg:hidden bg-white border-t border-neutral-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
      role="region"
      aria-label={bookCta}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-4xl mx-auto">
        <div className="flex flex-col min-w-0">
          {statusLabel && (
            <p className="text-caption font-medium text-wildher-text-muted truncate">
              {statusLabel}
            </p>
          )}
          {priceFrom != null && (
            <p className="text-body font-bold text-wildher-text">
              {priceLabel ? `${priceLabel} ` : ''}
              {priceFrom}€
            </p>
          )}
        </div>
        <a
          href={bookHref}
          {...linkProps}
          className="inline-flex items-center justify-center rounded-button bg-brand-primary-green hover:bg-brand-primary-green-hover transition-colors px-5 py-3 font-semibold text-white min-h-[48px] flex-shrink-0"
        >
          {bookCta}
        </a>
      </div>
    </div>
  );
}

export default MobileBookingBar;
