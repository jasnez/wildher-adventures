import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getTours } from '@/lib/tours';
import { ToursHero, TourCard, GiftVoucherBanner } from '@/components/tours';
import ToursFilterBarClient from '@/components/tours/ToursFilterBar';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const title =
    locale === 'bs'
      ? 'Ture i iskustva — WildHer Adventures'
      : 'Tours and experiences — WildHer Adventures';
  const description =
    locale === 'bs'
      ? 'Od jednodnevnih hiking tura do višednevnih ekspedicija. Filtriraj po tipu, trajanju, težini i cijeni.'
      : 'From one-day hiking trips to multi-day expeditions. Filter by type, duration, difficulty and price.';
  return { title, description };
}

function stripNamespace(key) {
  if (typeof key !== 'string') return key;
  const i = key.indexOf('.');
  return i > 0 ? key.slice(i + 1) : key;
}

export default async function ToursPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('tours');
  const tHome = await getTranslations('home');
  const tAbout = await getTranslations('about');
  const tours = getTours();

  const labels = {
    filterType: t('filterType'),
    filterDuration: t('filterDuration'),
    filterDifficulty: t('filterDifficulty'),
    filterPrice: t('filterPrice'),
    filterMonth: t('filterMonth'),
    sortBy: t('sortBy'),
    sortDate: t('sortDate'),
    sortPrice: t('sortPrice'),
    sortPopularity: t('sortPopularity'),
    typeHiking: t('typeHiking'),
    typeViaFerrata: t('typeViaFerrata'),
    typeCanyoning: t('typeCanyoning'),
    typeRetreat: t('typeRetreat'),
    duration1day: t('duration1day'),
    durationWeekend: t('durationWeekend'),
    duration3to5: t('duration3to5'),
    duration5plus: t('duration5plus'),
    difficultyEasy: t('difficultyEasy'),
    difficultyModerate: t('difficultyModerate'),
    difficultyChallenging: t('difficultyChallenging'),
  };

  const resolvedTours = tours.map((tour) => {
    const title = tHome(stripNamespace(tour.titleKey));
    const location = tour.locationKey?.startsWith('dest') ? tHome(tour.locationKey) : tHome(stripNamespace(tour.locationKey));
    const duration = tHome(stripNamespace(tour.durationKey));
    const difficultyLabel = tour.difficultyKey?.startsWith('tours.') ? t(tour.difficultyKey.replace('tours.', '')) : tHome(stripNamespace(tour.difficultyKey));
    const description = tour.descKey?.startsWith('about.') ? tAbout(stripNamespace(tour.descKey)) : tHome(stripNamespace(tour.descKey));
    return {
      ...tour,
      title,
      location,
      duration,
      difficultyLabel,
      description,
    };
  });

  return (
    <main id="main-content" className="min-h-screen">
      <ToursHero
        heroImageSrc="/hero-mountains.png"
        heroAlt={t('heroTitle')}
        heroTitle={t('heroTitle')}
        heroSubtitle={t('heroSubtitle')}
      />
      <ToursFilterBarClient labels={labels} />
      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {resolvedTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                ctaLabel={t('ctaDetailsBooking')}
                badgeLabels={{
                  popular: t('badgePopular'),
                  new: t('badgeNew'),
                  coming: t('badgeComing'),
                }}
              />
            ))}
          </div>
        </div>
      </section>
      <GiftVoucherBanner
        title={t('giftVoucherTitle')}
        description={t('giftVoucherDesc')}
        ctaLabel={t('giftVoucherCta')}
        ctaHref="/poklon-vaucer"
      />
    </main>
  );
}
