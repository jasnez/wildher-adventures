'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';

export function BookingPanel({ priceFrom, priceLabel, spotsLeft, dateLabel, guestsLabel, bookCta, bookHref }) {
  return (
    <aside id="booking" className="sticky top-[var(--quick-facts-height,4rem)] z-10 w-full md:w-80 flex-shrink-0">
      <div className="rounded-xl border border-neutral-200 bg-wildher-surface p-5 shadow-lg">
        <p className="text-h3 font-bold text-wildher-text mb-1">
          {priceFrom != null && priceLabel ? `${priceLabel} ${priceFrom}€` : priceFrom != null ? `${priceFrom}€` : '—'}
        </p>
        <p className="text-small text-wildher-text-muted mb-4">{dateLabel}</p>
        <p className="text-small text-wildher-text-muted mb-4">{guestsLabel}</p>
        {spotsLeft != null && (
          <p className="text-small text-brand-primary-green font-medium mb-4">{spotsLeft}</p>
        )}
        <Link
          href={bookHref}
          className="block w-full text-center rounded-lg bg-brand-primary-green px-4 py-3 font-semibold text-white hover:bg-brand-primary-green/90 transition-colors"
        >
          {bookCta}
        </Link>
      </div>
    </aside>
  );
}
