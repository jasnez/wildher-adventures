'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';

/**
 * Gift voucher banner — "Pokloni avanturu", CTA za kupovinu vaučera.
 */
export function GiftVoucherBanner({
  title = 'Pokloni avanturu',
  description,
  ctaLabel = 'Kupi vaučer',
  ctaHref = '/poklon-vaucer',
}) {
  return (
    <section className="bg-brand-earth-tone text-white py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 md:px-6 text-center">
        <h2 className="font-display text-h2 md:text-h1 font-semibold mb-3">
          {title}
        </h2>
        {description && (
          <p className="text-body text-white/95 mb-6 max-w-xl mx-auto">
            {description}
          </p>
        )}
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center font-semibold rounded-radius-button px-6 py-3 bg-white text-brand-earth-tone hover:bg-white/95 transition-colors"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}

export default GiftVoucherBanner;
