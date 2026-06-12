/**
 * Schema.org structured-data helpers used to inject JSON-LD on the marketing
 * pages. Rich-result targets: TouristTrip (tour detail), TravelAgency (home /
 * about), BreadcrumbList (any page).
 */

const SITE = {
  name: 'WildHer Adventures',
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://wildheradventures.ba',
  email: 'bookings@wildheradventures.ba',
  logo: '/logo-primary.png',
  sameAs: [
    'https://instagram.com/wildheradventures',
    'https://facebook.com/wildheradventures',
  ],
};

/**
 * Escape a JSON-LD payload safely for inline `<script>` injection.
 * Replaces the `<` character so that `</script>` cannot break out of the tag.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function absoluteUrl(path: string): string {
  if (!path) return SITE.baseUrl;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

type TourLike = {
  title: string;
  slug: string;
  shortDescription?: string;
  cover?: string | null;
  durationDays: number;
  difficulty: number;
  price: number;
  currency: string;
  maxGroup: number;
  startingPoint?: string;
  location?: string;
  guide?: { name: string; slug: string } | null;
  availableDates?: Array<{ startDate: string; endDate: string | null; status: string }>;
};

export function tourJsonLd(tour: TourLike, locale: 'bs' | 'en') {
  const url = `${SITE.baseUrl}${locale === 'en' ? '/en' : ''}/ture/${tour.slug}`;
  const validDates = (tour.availableDates || []).filter(
    (d) => !['cancelled', 'sold_out'].includes(d.status)
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.shortDescription || tour.title,
    url,
    image: tour.cover ? absoluteUrl(tour.cover) : undefined,
    touristType: 'Women-only adventure travellers',
    itinerary: tour.location || tour.startingPoint,
    duration: `P${tour.durationDays}D`,
    provider: {
      '@type': 'TravelAgency',
      name: SITE.name,
      url: SITE.baseUrl,
      email: SITE.email,
    },
    offers: {
      '@type': 'Offer',
      price: tour.price,
      priceCurrency: tour.currency,
      url,
      availability: validDates.length > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      validFrom: validDates[0]?.startDate,
    },
    maximumAttendeeCapacity: tour.maxGroup,
  };
}

export function travelAgencyJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE.name,
    url: SITE.baseUrl,
    logo: absoluteUrl(SITE.logo),
    email: SITE.email,
    sameAs: SITE.sameAs,
    areaServed: {
      '@type': 'Country',
      name: 'Bosnia and Herzegovina',
    },
    description:
      'Women-only outdoor adventure operator in Bosnia and Herzegovina. Hiking, via ferrata, expeditions and retreats led by licensed female guides.',
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; href: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.href),
    })),
  };
}

export function siteBaseUrl() {
  return SITE.baseUrl;
}

/**
 * Canonical + hreflang alternates for a bs/en page pair.
 * Routes use Bosnian slugs for both locales; en lives under /en.
 */
export function localeAlternates(path: string, locale: 'bs' | 'en') {
  const base = SITE.baseUrl;
  const bsUrl = `${base}${path}`;
  const enUrl = `${base}/en${path}`;
  return {
    canonical: locale === 'en' ? enUrl : bsUrl,
    languages: { bs: bsUrl, en: enUrl, 'x-default': bsUrl },
  };
}
