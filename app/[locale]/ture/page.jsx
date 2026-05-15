import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getTours } from '@/lib/tours';
import { getAllTours } from '@/lib/sanity/fetch';
import { mapTourCard } from '@/lib/sanity/adapters';
import { ToursHero, GiftVoucherBanner } from '@/components/tours';
import ToursListingClient from '@/components/tours/ToursListingClient';
import { stripNamespace } from '@/lib/i18nKeys';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tours' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ToursPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('tours');
  const tHome = await getTranslations('home');
  const tAbout = await getTranslations('about');

  const labels = {
    filterType: t('filterType'),
    filterDuration: t('filterDuration'),
    filterDifficulty: t('filterDifficulty'),
    filterPrice: t('filterPrice'),
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
    difficultyDemanding: t('difficultyDemanding'),
    difficultyExpert: t('difficultyExpert'),
  };

  const fallbackDurationLabel = (days) => {
    if (days <= 1) return t('duration1day');
    if (days <= 2) return t('durationWeekend');
    if (days <= 5) return t('duration3to5');
    return t('duration5plus');
  };
  const difficultyLookup = (key) => t(key);

  // Try Sanity first; fall back to mock data when empty/unconfigured.
  const sanityTours = await getAllTours();
  let resolvedTours;
  if (sanityTours && sanityTours.length > 0) {
    resolvedTours = sanityTours.map((tour) =>
      mapTourCard(tour, locale, difficultyLookup, fallbackDurationLabel)
    );
  } else {
    const tours = getTours();
    resolvedTours = tours.map((tour) => {
      const title = tHome(stripNamespace(tour.titleKey));
      const location = tour.locationKey?.startsWith('dest')
        ? tHome(tour.locationKey)
        : tHome(stripNamespace(tour.locationKey));
      const duration = tHome(stripNamespace(tour.durationKey));
      const difficultyLabel = tour.difficultyKey?.startsWith('tours.')
        ? t(tour.difficultyKey.replace('tours.', ''))
        : tHome(stripNamespace(tour.difficultyKey));
      const description = tour.descKey?.startsWith('about.')
        ? tAbout(stripNamespace(tour.descKey))
        : tHome(stripNamespace(tour.descKey));
      return {
        ...tour,
        title,
        location,
        duration,
        difficultyLabel,
        description,
      };
    });
  }

  return (
    <main id="main-content" className="min-h-screen">
      <ToursHero
        heroImageSrc="/hero-mountains.png"
        heroAlt={t('heroTitle')}
        heroTitle={t('heroTitle')}
        heroSubtitle={t('heroSubtitle')}
      />
      <ToursListingClient
        tours={resolvedTours}
        labels={labels}
        ctaLabel={t('ctaDetailsBooking')}
        priceFromLabel={t('priceFrom')}
        soloFriendlyLabel={t('soloFriendly')}
        emptyStateLabel={t('emptyResults')}
        badgeLabels={{
          popular: t('badgePopular'),
          new: t('badgeNew'),
          coming: t('badgeComing'),
        }}
      />
      <GiftVoucherBanner
        title={t('giftVoucherTitle')}
        description={t('giftVoucherDesc')}
        ctaLabel={t('giftVoucherCta')}
        ctaHref="/poklon-vaucer"
      />
    </main>
  );
}
