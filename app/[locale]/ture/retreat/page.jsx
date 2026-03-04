import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getToursByCategory } from '@/lib/tours';
import { TourCard, GiftVoucherBanner } from '@/components/tours';
import ToursFilterBarClient from '@/components/tours/ToursFilterBar';

function stripNamespace(key) {
  if (typeof key !== 'string') return key;
  const i = key.indexOf('.');
  return i > 0 ? key.slice(i + 1) : key;
}

async function resolveTours(tours, t, tHome, tAbout) {
  return tours.map((tour) => ({
    ...tour,
    title: tHome(stripNamespace(tour.titleKey)),
    location: tour.locationKey?.startsWith('dest') ? tHome(tour.locationKey) : tHome(stripNamespace(tour.locationKey)),
    duration: tHome(stripNamespace(tour.durationKey)),
    difficultyLabel: tour.difficultyKey?.startsWith('tours.') ? t(tour.difficultyKey.replace('tours.', '')) : tHome(stripNamespace(tour.difficultyKey)),
    description: tour.descKey?.startsWith('about.') ? tAbout(stripNamespace(tour.descKey)) : tHome(stripNamespace(tour.descKey)),
  }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const title = locale === 'bs' ? 'Retreat — WildHer' : 'Retreat — WildHer';
  return { title };
}

export default async function RetreatPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('tours');
  const tHome = await getTranslations('home');
  const tAbout = await getTranslations('about');
  const tours = getToursByCategory('retreat');
  const resolvedTours = await resolveTours(tours, t, tHome, tAbout);

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

  return (
    <main id="main-content" className="min-h-screen">
      <section className="bg-[#f6f1e7] py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
          <h1 className="font-display text-h1 md:text-3xl font-semibold text-wildher-text mb-4">
            Retreat
          </h1>
          <p className="text-body text-wildher-text-muted">
            {t('categoryRetreatIntro')}
          </p>
        </div>
      </section>
      <ToursFilterBarClient labels={labels} onFilterChange={() => {}} />
      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {resolvedTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                ctaLabel={t('ctaDetailsBooking')}
                badgeLabels={{ popular: t('badgePopular'), new: t('badgeNew'), coming: t('badgeComing') }}
              />
            ))}
          </div>
        </div>
      </section>
      <GiftVoucherBanner title={t('giftVoucherTitle')} description={t('giftVoucherDesc')} ctaLabel={t('giftVoucherCta')} ctaHref="/poklon-vaucer" />
    </main>
  );
}
