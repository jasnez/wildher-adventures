import React from 'react';
import { Icon } from '@/components/ui';

const STATUS_STYLES = {
  sold_out: 'bg-neutral-200 text-neutral-800',
  almost_full: 'bg-yellow-100 text-yellow-900',
  waitlist: 'bg-blue-100 text-blue-900',
  by_request: 'bg-primary-50 text-brand-primary-green',
};

export function BookingPanel({
  priceFrom,
  priceLabel,
  spotsLeft,
  nextDateText,
  nextDateLabel,
  dateFallback,
  groupText,
  bookCta,
  bookHref,
  bookCtaNote,
  isExternalPayment = false,
  status, // 'open' | 'almost_full' | 'sold_out' | 'waitlist' | 'by_request' | null
  statusLabel,
  trustItems = [],
}) {
  const linkProps = isExternalPayment
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  const ctaDisabled = status === 'sold_out';
  const ctaClass = ctaDisabled
    ? 'block w-full text-center rounded-lg bg-neutral-300 px-4 py-3 font-semibold text-neutral-700 cursor-not-allowed'
    : 'block w-full text-center rounded-button bg-brand-primary-green px-4 py-3 font-semibold text-white hover:bg-brand-primary-green-hover transition-colors duration-200 motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-green focus-visible:ring-offset-2';

  return (
    <aside id="booking" className="sticky top-[var(--quick-facts-height,4rem)] z-10 w-full md:w-80 flex-shrink-0">
      <div className="rounded-card border border-neutral-200 bg-wildher-surface p-5 shadow-card">
        {status && status !== 'open' && statusLabel && (
          <p
            className={`inline-block rounded-full px-3 py-1 text-caption font-semibold mb-3 ${STATUS_STYLES[status] || 'bg-neutral-100 text-neutral-700'}`}
          >
            {statusLabel}
          </p>
        )}
        <p className="text-h3 font-bold text-wildher-text mb-3">
          {priceFrom != null && priceLabel ? `${priceLabel} ${priceFrom}€` : priceFrom != null ? `${priceFrom}€` : '—'}
        </p>

        <dl className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-small text-wildher-text-muted">
            <Icon name="calendar" size={16} className="text-brand-primary-green shrink-0" />
            <span>
              {nextDateText
                ? `${nextDateLabel ? `${nextDateLabel}: ` : ''}${nextDateText}`
                : dateFallback}
            </span>
          </div>
          {groupText && (
            <div className="flex items-center gap-2 text-small text-wildher-text-muted">
              <Icon name="users" size={16} className="text-brand-primary-green shrink-0" />
              <span>{groupText}</span>
            </div>
          )}
        </dl>

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

        {trustItems.length > 0 && (
          <ul className="mt-5 pt-4 border-t border-neutral-200 space-y-2">
            {trustItems.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-small text-wildher-text">
                <Icon name="check" size={16} className="text-brand-primary-green shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
