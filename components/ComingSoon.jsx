import React from 'react';
import { Link } from '@/i18n/navigation';

export function ComingSoon({ heading, title, text, ctaLabel, ctaHref = '/ture' }) {
  return (
    <main
      id="main-content"
      className="min-h-[70vh] flex items-center justify-center px-4 py-16"
    >
      <div className="max-w-xl text-center">
        {heading && (
          <p className="text-small uppercase tracking-wide text-brand-primary-green font-semibold mb-2">
            {heading}
          </p>
        )}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-wildher-text mb-4">
          {title}
        </h1>
        <p className="text-body text-wildher-text-muted mb-8">{text}</p>
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-lg bg-brand-primary-green px-6 py-3 font-semibold text-white hover:bg-brand-primary-green/90 transition-colors"
        >
          {ctaLabel}
        </Link>
      </div>
    </main>
  );
}

export default ComingSoon;
