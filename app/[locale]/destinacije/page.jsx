import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import OptimizedImage from '@/components/OptimizedImage';
import { getAllDestinations } from '@/lib/sanity/fetch';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'destinations' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

function pickLocale(value, locale) {
  if (!value || typeof value !== 'object') return '';
  return (locale === 'en' && value.en) || value.bs || '';
}

export default async function DestinationsPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('destinations');

  const destinations = (await getAllDestinations()) || [];

  return (
    <main id="main-content" className="min-h-[70vh] px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-wildher-text mb-3">
            {t('title')}
          </h1>
          <p className="text-body text-wildher-text-muted">{t('intro')}</p>
        </header>

        {destinations.length === 0 ? (
          <p role="status" className="text-center text-body text-wildher-text-muted py-16">
            {t('comingSoon')}
          </p>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <li key={d._id}>
                <Link
                  href={`/destinacije/${d.slug.current}`}
                  className="block group rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-neutral-100">
                    {d.heroImage && (
                      <OptimizedImage
                        src={d.heroImage}
                        alt={pickLocale(d.name, locale)}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h2 className="font-display text-xl font-bold">
                        {pickLocale(d.name, locale)}
                      </h2>
                      {d.elevationM && (
                        <p className="text-small text-white/90">{d.elevationM}m</p>
                      )}
                    </div>
                  </div>
                  {d.shortDescription && (
                    <div className="p-5 bg-white">
                      <p className="text-small text-wildher-text-muted line-clamp-3">
                        {pickLocale(d.shortDescription, locale)}
                      </p>
                      {d.region && (
                        <p className="text-caption mt-2 text-brand-primary-green font-medium">
                          {t(`regions.${d.region}`)}
                        </p>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
