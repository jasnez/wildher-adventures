import React from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import OptimizedImage from '@/components/OptimizedImage';
import { TourCard } from '@/components/tours/TourCard';
import { mapTourCard } from '@/lib/sanity/adapters';
import { getDestinationBySlug } from '@/lib/sanity/fetch';
import { RichText, localiseRichText } from '@/lib/sanity/portableText';

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const dest = await getDestinationBySlug(slug);
  if (!dest) return {};
  const name = pickLocale(dest.name, locale);
  return {
    title: `${name} — WildHer Adventures`,
    description: pickLocale(dest.shortDescription, locale) || undefined,
  };
}

function pickLocale(value, locale) {
  if (!value || typeof value !== 'object') return '';
  return (locale === 'en' && value.en) || value.bs || '';
}

export default async function DestinationDetailPage({ params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('destinations');
  const tTours = await getTranslations('tours');

  const dest = await getDestinationBySlug(slug);
  if (!dest) notFound();

  const description = localiseRichText(dest.description, locale);
  const tours = Array.isArray(dest.tours) ? dest.tours : [];

  const fallbackDuration = (days) => {
    if (days <= 1) return tTours('duration1day');
    if (days <= 2) return tTours('durationWeekend');
    if (days <= 5) return tTours('duration3to5');
    return tTours('duration5plus');
  };
  const difficultyLookup = (key) => tTours(key);
  const cardTours = tours.map((tour) =>
    mapTourCard(tour, locale === 'en' ? 'en' : 'bs', difficultyLookup, fallbackDuration)
  );

  return (
    <main id="main-content" className="min-h-[70vh]">
      {dest.heroImage && (
        <section className="relative h-[50vh] min-h-[300px]">
          <OptimizedImage
            src={dest.heroImage}
            alt={pickLocale(dest.name, locale)}
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
          <div className="relative z-10 mx-auto max-w-5xl px-4 h-full flex items-end pb-10">
            <div className="text-white">
              <Link
                href="/destinacije"
                className="text-small text-white/80 hover:text-white inline-block mb-3"
              >
                ← {t('backToDestinations')}
              </Link>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-2">
                {pickLocale(dest.name, locale)}
              </h1>
              {dest.region && (
                <p className="text-body text-white/90">{t(`regions.${dest.region}`)}</p>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          {dest.shortDescription && (
            <p className="text-body-lg text-wildher-text mb-8">
              {pickLocale(dest.shortDescription, locale)}
            </p>
          )}

          <dl className="grid sm:grid-cols-3 gap-4 mb-8 not-prose">
            {dest.elevationM && (
              <div className="rounded-lg border border-neutral-200 p-4 bg-white">
                <dt className="text-small font-semibold text-wildher-text-muted mb-1">
                  {t('elevationLabel')}
                </dt>
                <dd className="text-body font-medium text-wildher-text">{dest.elevationM}m</dd>
              </div>
            )}
            {dest.region && (
              <div className="rounded-lg border border-neutral-200 p-4 bg-white">
                <dt className="text-small font-semibold text-wildher-text-muted mb-1">
                  {t('regionLabel')}
                </dt>
                <dd className="text-body font-medium text-wildher-text">
                  {t(`regions.${dest.region}`)}
                </dd>
              </div>
            )}
            {Array.isArray(dest.bestSeason) && dest.bestSeason.length > 0 && (
              <div className="rounded-lg border border-neutral-200 p-4 bg-white">
                <dt className="text-small font-semibold text-wildher-text-muted mb-1">
                  {t('bestSeasonLabel')}
                </dt>
                <dd className="text-body font-medium text-wildher-text">
                  {dest.bestSeason.map((s) => t(`seasons.${s}`)).join(', ')}
                </dd>
              </div>
            )}
          </dl>

          {description && (
            <div className="prose max-w-none text-body text-wildher-text space-y-4">
              <RichText value={description} />
            </div>
          )}
        </div>
      </section>

      {cardTours.length > 0 && (
        <section className="py-12 md:py-16 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-wildher-text mb-8 text-center">
              {t('toursHereLabel')}
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cardTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  ctaLabel={tTours('ctaDetailsBooking')}
                  priceFromLabel={tTours('priceFrom')}
                  soloFriendlyLabel={tTours('soloFriendly')}
                  badgeLabels={{
                    popular: tTours('badgePopular'),
                    new: tTours('badgeNew'),
                    coming: tTours('badgeComing'),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {Array.isArray(dest.gallery) && dest.gallery.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {dest.gallery.map((url, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg">
                  <OptimizedImage
                    src={url}
                    alt=""
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
