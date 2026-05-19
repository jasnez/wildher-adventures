import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import OptimizedImage from '@/components/OptimizedImage';
import { getAllGuides } from '@/lib/sanity/fetch';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'guides' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

function localised(value, locale) {
  if (!value || typeof value !== 'object') return '';
  return (locale === 'en' && value.en) || value.bs || '';
}

export default async function GuidesPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('guides');

  const guides = (await getAllGuides()) || [];

  return (
    <main id="main-content" className="min-h-[70vh] px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-wildher-text mb-3">
            {t('title')}
          </h1>
          <p className="text-body text-wildher-text-muted">{t('intro')}</p>
        </header>

        {guides.length === 0 ? (
          <p role="status" className="text-center text-body text-wildher-text-muted py-16">
            {t('comingSoon')}
          </p>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <li key={guide._id}>
                <Link
                  href={`/vodice/${guide.slug.current}`}
                  className="block group rounded-radius-card-lg overflow-hidden shadow-card hover:shadow-xl transition-all"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-neutral-100">
                    {guide.photo && (
                      <OptimizedImage
                        src={guide.photo}
                        alt={guide.name}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-5 bg-white">
                    <h2 className="text-h3 font-semibold text-wildher-text mb-1">
                      {guide.name}
                    </h2>
                    {guide.role && (
                      <p className="text-small text-brand-primary-green font-medium mb-2">
                        {localised(guide.role, locale)}
                      </p>
                    )}
                    {guide.shortBio && (
                      <p className="text-small text-wildher-text-muted line-clamp-3">
                        {localised(guide.shortBio, locale)}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
