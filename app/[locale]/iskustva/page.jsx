import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import OptimizedImage from '@/components/OptimizedImage';
import { getAllTestimonials } from '@/lib/sanity/fetch';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'iskustva' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

function pickLocale(value, locale) {
  if (!value || typeof value !== 'object') return '';
  return (locale === 'en' && value.en) || value.bs || '';
}

function Stars({ rating, label }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className={i <= rating ? 'text-brand-gold-beige' : 'text-neutral-300'}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default async function IskustvaPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('iskustva');

  const all = (await getAllTestimonials()) || [];

  const average =
    all.length > 0
      ? (all.reduce((sum, x) => sum + x.rating, 0) / all.length).toFixed(1)
      : null;

  return (
    <main id="main-content" className="min-h-[70vh] px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-wildher-text mb-3">
            {t('title')}
          </h1>
          <p className="text-body text-wildher-text-muted mb-4">{t('intro')}</p>
          {average && (
            <p className="text-body font-semibold text-brand-primary-green">
              <Stars rating={Math.round(parseFloat(average))} label={t('ratingLabel', { rating: average })} />{' '}
              {t('averageRating', { rating: average, count: all.length })}
            </p>
          )}
        </header>

        {all.length === 0 ? (
          <p role="status" className="text-center text-body text-wildher-text-muted py-16">
            {t('empty')}
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {all.map((tm) => (
              <li
                key={tm._id}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card flex flex-col"
              >
                <Stars rating={tm.rating} label={t('ratingLabel', { rating: tm.rating })} />
                <blockquote className="mt-3 mb-4 flex-1">
                  <p className="text-body text-wildher-text italic">&ldquo;{pickLocale(tm.quote, locale)}&rdquo;</p>
                </blockquote>
                <footer className="flex items-center gap-3">
                  {tm.authorPhoto && (
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-neutral-100">
                      <OptimizedImage
                        src={tm.authorPhoto}
                        alt={tm.authorName}
                        sizes="48px"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-small font-semibold text-wildher-text">{tm.authorName}</p>
                    {tm.authorCity && (
                      <p className="text-caption text-wildher-text-muted">{tm.authorCity}</p>
                    )}
                  </div>
                  {tm.tour && (
                    <Link
                      href={`/ture/${tm.tour.slug.current}`}
                      className="ml-auto text-caption font-semibold text-brand-primary-green hover:underline"
                    >
                      {pickLocale(tm.tour.title, locale)} →
                    </Link>
                  )}
                </footer>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
