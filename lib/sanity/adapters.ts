/**
 * Translate Sanity tour payloads to the prop shapes used by existing components.
 * Keeps the legacy lib/tours.js mock format compatible so we can flip the source
 * without rewriting every component.
 */
import type { TourCard, TourFull, LocaleString } from './schemas';

type Locale = 'bs' | 'en';

function pickLocale(value: LocaleString | null | undefined, locale: Locale): string {
  if (!value) return '';
  if (locale === 'en' && value.en) return value.en;
  return value.bs || '';
}

function pickLocaleOptional(
  value: { bs?: string | null; en?: string | null } | null | undefined,
  locale: Locale
): string {
  if (!value) return '';
  if (locale === 'en' && value.en) return value.en;
  return value.bs || '';
}

function difficultyLabelKey(level: number): string {
  switch (level) {
    case 1:
      return 'difficultyEasy';
    case 2:
      return 'difficultyModerate';
    case 3:
      return 'difficultyChallenging';
    case 4:
      return 'difficultyDemanding';
    case 5:
      return 'difficultyExpert';
    default:
      return 'difficultyModerate';
  }
}

function durationCategory(durationDays: number, category: string): string {
  if (category === 'one-day') return '1day';
  if (category === 'weekend') return 'weekend';
  if (durationDays >= 6) return '5plus';
  if (durationDays >= 3) return '3to5';
  return '1day';
}

/**
 * Card-level shape consumed by TourCard.jsx and toursFilter.js.
 */
export type CardTour = {
  id: string;
  slug: string;
  title: string;
  location: string;
  duration: string;
  difficulty: number;
  difficultyKey: string;
  difficultyLabel: string;
  durationCategory: string;
  type: string;
  priceFrom: number;
  currency: string;
  maxGroup: number;
  description: string;
  image: string;
  badge: string | null;
  sortOrder: number;
  soloFriendly: boolean;
  averageRating: number | null;
  reviewCount: number;
};

export function mapTourCard(
  tour: TourCard,
  locale: Locale,
  difficultyLabelLookup: (key: string) => string,
  fallbackDurationLabel: (days: number) => string
): CardTour {
  const difficultyKey = difficultyLabelKey(tour.difficulty);
  return {
    id: tour._id,
    slug: tour.slug.current,
    title: pickLocale(tour.title, locale),
    location: '',
    duration: tour.durationLabel
      ? pickLocale(tour.durationLabel, locale)
      : fallbackDurationLabel(tour.durationDays),
    difficulty: tour.difficulty,
    difficultyKey,
    difficultyLabel: difficultyLabelLookup(difficultyKey),
    durationCategory: durationCategory(tour.durationDays, tour.category),
    type: tour.type,
    priceFrom: tour.price,
    currency: tour.currency,
    maxGroup: tour.maxGroupSize,
    description: pickLocaleOptional(tour.shortDescription, locale),
    image: tour.cover || '',
    badge: tour.badge || null,
    sortOrder: tour.sortOrder ?? 100,
    soloFriendly: tour.soloFriendly ?? false,
    averageRating:
      tour.averageRating != null
        ? Math.round(tour.averageRating * 10) / 10
        : null,
    reviewCount: tour.reviewCount ?? 0,
  };
}

/**
 * Detail shape consumed by [slug]/page.jsx + tour-detail components.
 */
export type DetailTour = CardTour & {
  subtitle: string;
  experienceStory: unknown;
  lengthKm: number | null;
  elevationM: number | null;
  minAge: number | null;
  deposit: number | null;
  startingPoint: string;
  itinerary: Array<{ label: string; description: string; time: string | null; image: string | null }>;
  included: string[];
  excluded: string[];
  whatToBring: string[];
  whoIsForIncluded: string[];
  whoIsForExcluded: string[];
  gallery: string[];
  guide: {
    name: string;
    slug: string;
    photo: string | null;
    role: string;
  } | null;
  destination: {
    name: string;
    slug: string;
    region: string;
  } | null;
  availableDates: Array<{
    startDate: string;
    endDate: string | null;
    spotsLeft: number | null;
    status: string;
  }>;
  testimonials: Array<{
    quote: string;
    author: string;
    city: string | null;
    rating: number;
    photo: string | null;
  }>;
  similarTours: CardTour[];
  mapImage: string | null;
  gpxFile: string | null;
};

export function mapTourDetail(
  tour: TourFull,
  locale: Locale,
  difficultyLabelLookup: (key: string) => string,
  fallbackDurationLabel: (days: number) => string
): DetailTour {
  const base = mapTourCard(tour, locale, difficultyLabelLookup, fallbackDurationLabel);
  base.location = tour.destination
    ? pickLocale(tour.destination.name, locale)
    : pickLocale(tour.startingPoint, locale);

  return {
    ...base,
    subtitle: pickLocale(tour.subtitle, locale),
    experienceStory: pickRichText(tour.experienceStory, locale),
    lengthKm: tour.lengthKm ?? null,
    elevationM: tour.elevationM ?? null,
    minAge: tour.minAge ?? null,
    deposit: tour.deposit ?? null,
    startingPoint: pickLocale(tour.startingPoint, locale),
    itinerary: (tour.itinerary || []).map((step) => ({
      label: pickLocale(step.label, locale),
      description: pickLocaleOptional(step.description, locale),
      time: step.time ?? null,
      image: step.image ?? null,
    })),
    included: (tour.included || []).map((v) => pickLocale(v, locale)),
    excluded: (tour.excluded || []).map((v) => pickLocale(v, locale)),
    whatToBring: (tour.whatToBring || []).map((v) => pickLocale(v, locale)),
    whoIsForIncluded: (tour.whoIsForIncluded || []).map((v) => pickLocale(v, locale)),
    whoIsForExcluded: (tour.whoIsForExcluded || []).map((v) => pickLocale(v, locale)),
    gallery: tour.gallery || [],
    guide: tour.guide
      ? {
          name: tour.guide.name,
          slug: tour.guide.slug.current,
          photo: tour.guide.photo ?? null,
          role: pickLocale(tour.guide.role, locale),
        }
      : null,
    destination: tour.destination
      ? {
          name: pickLocale(tour.destination.name, locale),
          slug: tour.destination.slug.current,
          region: tour.destination.region,
        }
      : null,
    availableDates: (tour.availableDates || []).map((d) => ({
      startDate: d.startDate,
      endDate: d.endDate ?? null,
      spotsLeft: d.spotsLeft ?? null,
      status: d.status,
    })),
    testimonials: (tour.testimonials || []).map((t) => ({
      quote: pickLocale(t.quote, locale),
      author: t.authorName,
      city: t.authorCity ?? null,
      rating: t.rating,
      photo: t.authorPhoto ?? null,
    })),
    similarTours: (tour.similarTours || []).map((t) =>
      mapTourCard(t, locale, difficultyLabelLookup, fallbackDurationLabel)
    ),
    mapImage: tour.mapImage ?? null,
    gpxFile: tour.gpxFile ?? null,
  };
}

function pickRichText(
  value: { bs?: unknown; en?: unknown } | null | undefined,
  locale: Locale
): unknown {
  if (!value) return null;
  if (locale === 'en' && value.en) return value.en;
  return value.bs || null;
}
