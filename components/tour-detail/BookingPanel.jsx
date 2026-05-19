import React from 'react';

const STATUS_STYLES = {
  sold_out: 'bg-neutral-200 text-neutral-800',
  almost_full: 'bg-yellow-100 text-yellow-900',
  waitlist: 'bg-blue-100 text-blue-900',
};

export function BookingPanel({
  priceFrom,
  priceLabel,
  spotsLeft,
  dateLabel,
  guestsLabel,
  bookCta,
  bookHref,
  bookCtaNote,
  isExternalPayment = false,
  status, // 'open' | 'almost_full' | 'sold_out' | 'waitlist' | null
  statusLabel,
  nextDateText,
  nextDateLabel,
}) {
  const linkProps = isExternalPayment
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  const ctaDisabled = status === 'sold_out';
  const ctaClass = ctaDisabled
    ? 'block w-full text-center rounded-lg bg-neutral-300 px-4 py-3 font-semibold text-neutral-700 cursor-not-allowed'
    : 'block w-full text-center rounded-lg bg-brand-primary-green px-4 py-3 font-semibold text-white hover:bg-brand-primary-green/90 transition-colors';

  return (
    <aside id="booking" className="sticky top-[var(--quick-facts-height,4rem)] z-10 w-full md:w-80 flex-shrink-0">
      <div className="rounded-radius-card border border-neutral-200 bg-wildher-surface p-5 shadow-lg">
        {status && status !== 'open' && statusLabel && (
          <p
            className={`inline-block rounded-full px-3 py-1 text-caption font-semibold mb-3 ${STATUS_STYLES[status] || 'bg-neutral-100 text-neutral-700'}`}
          >
            {statusLabel}
          </p>
        )}
        <p className="text-h3 font-bold text-wildher-text mb-1">
          {priceFrom != null && priceLabel ? `${priceLabel} ${priceFrom}€` : priceFrom != null ? `${priceFrom}€` : '—'}
        </p>
        {nextDateText && (
          <p className="text-small text-wildher-text-muted mb-1">
            <span className="font-medium">{nextDateLabel}:</span> {nextDateText}
          </p>
        )}
        <p className="text-small text-wildher-text-muted mb-4">{dateLabel}</p>
        <p className="text-small text-wildher-text-muted mb-4">{guestsLabel}</p>
        {spotsLeft != null && (
          <p className="text-small text-brand-primary-green font-medium mb-4">{spotsLeft}</p>
        )}
        {ctaDisabled ? (
          <span className={ctaClass} aria-disabled="true">
            {statusLabel}
          </span>
        ) : (
          <a href={bookHref} {...linkProps} className={ctaClass}>
            {bookCta}
          </a>
        )}
        {bookCtaNote && (
          <p className="text-caption text-wildher-text-muted mt-3 text-center">
            {bookCtaNote}
          </p>
        )}
      </div>
    </aside>
  );
}
