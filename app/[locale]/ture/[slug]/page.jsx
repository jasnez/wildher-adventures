import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { notFound } from 'next/navigation';
import { getTourBySlug } from '@/lib/tours';
import { getTourDetail } from '@/lib/tourDetailData';
import {
  TourDetailHero,
  QuickFactsBar,
  ExperienceStory,
  VisualItinerary,
  WhoIsFor,
  GearChecklist,
  MapElevation,
  TestimonialStory,
  SimilarAdventures,
  BookingPanel,
} from '@/components/tour-detail';
import { TourCard } from '@/components/tours/TourCard';

function resolveKey(tHome, tTours, fullKey) {
  if (!fullKey) return '';
  const parts = fullKey.split('.');
  if (parts.length <= 1) return tHome(fullKey);
  const ns = parts[0];
  const key = parts.slice(1).join('.');
  if (ns === 'tours') return tTours(key);
  return tHome(key);
}

export default async function TourDetailPage({ params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tour = getTourBySlug(slug);
  if (!tour) notFound();

  const tTourDetail = await getTranslations('tourDetail');
  const tHome = await getTranslations('home');
  const tTours = await getTranslations('tours');

  const title = resolveKey(tHome, tTours, tour.titleKey) || tHome(tour.titleKey);
  const location = resolveKey(tHome, tTours, tour.locationKey) || tHome(tour.locationKey);
  const duration = resolveKey(tHome, tTours, tour.durationKey) || tHome(tour.durationKey);
  const difficultyLabel = resolveKey(tHome, tTours, tour.difficultyKey) || `${tour.difficulty}/5`;
  const detail = getTourDetail(slug);
  const subtitle = tTourDetail(detail.subtitleKey);
  const experienceStory = tTourDetail(detail.experienceStoryKey);
  const bookCta = tTourDetail('bookCta');
  const bookHref = `#booking`;

  const itinerarySteps = detail.itinerary.map((step) => ({
    label: tTourDetail(step.labelKey),
    image: step.image,
  }));

  const whoIncluded = detail.whoIsForIncludedKeys.map((k) => tTourDetail(k));
  const whoExcluded = detail.whoIsForExcludedKeys.map((k) => tTourDetail(k));

  const gearItems = detail.gearKeys.map((k) => ({ key: k, label: tTourDetail(k) }));

  const spotsLeft = tTourDetail('spotsLeft', { count: 4 });

  const similarTours = (detail.similarSlugs || [])
    .map((s) => getTourBySlug(s))
    .filter(Boolean)
    .map((t) => ({
      title: resolveKey(tHome, tTours, t.titleKey) || tHome(t.titleKey),
      location: resolveKey(tHome, tTours, t.locationKey) || tHome(t.locationKey),
      duration: resolveKey(tHome, tTours, t.durationKey) || tHome(t.durationKey),
      difficulty: t.difficulty,
      difficultyLabel: resolveKey(tHome, tTours, t.difficultyKey) || tTours(t.difficultyKey),
      priceFrom: t.priceFrom,
      description: t.descKey ? resolveKey(tHome, tTours, t.descKey) : '',
      image: t.image,
      badge: t.badge,
      slug: t.slug,
    }));

  const quickFactsLabels = {
    duration: tTourDetail('quickFacts.duration'),
    difficulty: tTourDetail('quickFacts.difficulty'),
    ascent: tTourDetail('quickFacts.ascent'),
    length: tTourDetail('quickFacts.length'),
    group: tTourDetail('quickFacts.group'),
    price: tTourDetail('quickFacts.price'),
    priceFrom: tTourDetail('priceFrom'),
  };

  return (
    <main id="main-content" className="min-h-screen">
      <TourDetailHero
        title={title}
        subtitle={subtitle}
        location={location}
        duration={duration}
        difficultyLabel={difficultyLabel}
        maxGroup={tour.maxGroup ?? tour.maxGroup}
        imageName={tour.image}
        bookCta={bookCta}
        bookHref={bookHref}
      />

      <QuickFactsBar
        duration={duration}
        difficultyLabel={difficultyLabel}
        ascent={tour.ascent}
        length={tour.length}
        group={tour.maxGroup}
        priceFrom={tour.priceFrom}
        labels={quickFactsLabels}
      />

      <div className="flex flex-col lg:flex-row lg:items-start gap-8 max-w-6xl mx-auto px-4 py-8">
        <div className="flex-1 min-w-0">
          <ExperienceStory
            title={tTourDetail('experienceTitle')}
            storyText={experienceStory}
            imageName={detail.experienceImage}
            ctaLabel={tTourDetail('experienceCta')}
            ctaHref={bookHref}
          />

          <VisualItinerary steps={itinerarySteps} />

          <WhoIsFor
            title={tTourDetail('whoIsForTitle')}
            included={whoIncluded}
            excluded={whoExcluded}
            imageName={tour.image}
          />

          <GearChecklist title={tTourDetail('gearTitle')} items={gearItems} />

          <MapElevation
            title={tTourDetail('mapElevationTitle')}
            showDetailsLabel={tTourDetail('mapShowDetails')}
          />

          <TestimonialStory
            quote={tTourDetail(detail.testimonialQuoteKey)}
            author={tTourDetail(detail.testimonialAuthorKey)}
            imageName={detail.testimonialImage}
          />

          <SimilarAdventures
            title={tTourDetail('similarTitle')}
            tours={similarTours}
            ctaDetailsLabel={tTours('ctaDetailsBooking')}
          />
        </div>

        <BookingPanel
          priceFrom={tour.priceFrom}
          priceLabel={tTourDetail('priceFrom')}
          spotsLeft={spotsLeft}
          dateLabel={tTourDetail('date')}
          guestsLabel={tTourDetail('guests')}
          bookCta={bookCta}
          bookHref={bookHref}
        />
      </div>
    </main>
  );
}
