import React from 'react';

export function BookingPanel({
  priceFrom,
  priceLabel,
  spotsLeft,
  dateLabel,
  guestsLabel,
  bookCta,
  bookHref,
  bookCtaNote,
  isStripe = false,
}) {
  // External links (Stripe, mailto:) get target=_blank only for Stripe.
  const linkProps = isStripe
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

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
        <a
          href={bookHref}
          {...linkProps}
          className="block w-full text-center rounded-lg bg-brand-primary-green px-4 py-3 font-semibold text-white hover:bg-brand-primary-green/90 transition-colors"
        >
          {bookCta}
        </a>
        {bookCtaNote && (
          <p className="text-caption text-wildher-text-muted mt-3 text-center">
            {bookCtaNote}
          </p>
        )}
      </div>
    </aside>
  );
}
