'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import OptimizedImage from '@/components/OptimizedImage';

/**
 * Gift voucher banner — "Pokloni avanturu", CTA za kupovinu vaučera.
 *
 * Pre-footer CTA band that mirrors the home newsletter ("Join the
 * community") treatment: photo background + tinted overlay + centred
 * serif heading on the same vertical rhythm. The overlay keeps the
 * brand earth-tone (rather than the newsletter's charcoal) so the two
 * bands stay distinct, while the photo-on-photo treatment makes the
 * transition into the photo-backed footer below it read smoothly
 * instead of as a flat colour block.
 */
export function GiftVoucherBanner({
  title = 'Pokloni avanturu',
  description,
  ctaLabel = 'Kupi vaučer',
  ctaHref = '/poklon-vaucer',
}) {
  return (
    <section className="relative bg-brand-earth-tone text-white py-20 md:py-28">
      <OptimizedImage
        name="7"
        alt=""
        aria-hidden
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div aria-hidden className="absolute inset-0 bg-brand-earth-tone/85" />
      <div className="relative z-10 mx-auto max-w-2xl px-4 md:px-6 text-center">
        <h2 className="font-display text-h2 md:text-h1 font-semibold mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-body text-white/90 mb-8 max-w-xl mx-auto">
            {description}
          </p>
        )}
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center font-semibold rounded-button px-6 py-3 bg-white text-brand-earth-tone hover:bg-white/95 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-earth-tone"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}

export default GiftVoucherBanner;
