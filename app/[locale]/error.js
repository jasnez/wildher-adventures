'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function LocaleError({ error, reset }) {
  const t = useTranslations('errors');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
  }, [error]);

  return (
    <main
      id="main-content"
      className="min-h-[70vh] flex items-center justify-center px-4 py-16"
    >
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-wildher-text mb-3">
          {t('errorTitle')}
        </h1>
        <p className="text-body text-wildher-text-muted mb-6">
          {t('errorText')}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-lg bg-brand-primary-green px-5 py-2.5 font-semibold text-white hover:bg-brand-primary-green/90 transition-colors"
        >
          {t('errorRetry')}
        </button>
      </div>
    </main>
  );
}
