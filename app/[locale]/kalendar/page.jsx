import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import OptimizedImage from '@/components/OptimizedImage';
import { sanityClient } from '@/lib/sanity/client';
import { isSanityConfigured } from '@/sanity/env';
import { groq } from 'next-sanity';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'kalendar' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

function pickLocale(value, locale) {
  if (!value || typeof value !== 'object') return '';
  return (locale === 'en' && value.en) || value.bs || '';
}

const STATUS_CLASS = {
  open: 'bg-green-100 text-green-800',
  almost_full: 'bg-yellow-100 text-yellow-800',
  sold_out: 'bg-neutral-200 text-neutral-700',
  waitlist: 'bg-blue-100 text-blue-800',
};

// Fetch each tour with its available dates so we can flatten by month.
const calendarQuery = groq`
  *[_type == "tour" && count(availableDates) > 0]{
    _id,
    title,
    slug,
    "cover": cover.asset->url,
    durationDays,
    durationLabel,
    difficulty,
    price,
    currency,
    availableDates[]{
      startDate,
      endDate,
      spotsLeft,
      status
    }
  }
`;

async function getCalendarEntries() {
  if (!isSanityConfigured()) return [];
  try {
    const tours = await sanityClient.fetch(calendarQuery, {}, {
      next: { tags: ['sanity', 'tour'], revalidate: 60 },
    });
    if (!Array.isArray(tours)) return [];
    const entries = [];
    for (const tour of tours) {
      for (const date of tour.availableDates || []) {
        if (!date.startDate) continue;
        entries.push({ ...date, tour });
      }
    }
    entries.sort((a, b) => a.startDate.localeCompare(b.startDate));
    return entries;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[kalendar] fetch failed', err);
    }
    return [];
  }
}

function formatDateRange(start, end, locale, monthNames) {
  const startDate = new Date(start);
  const startDay = startDate.getDate();
  const startMonth = monthNames[startDate.getMonth()];
  if (!end || end === start) {
    return `${startDay}. ${startMonth} ${startDate.getFullYear()}`;
  }
  const endDate = new Date(end);
  const endDay = endDate.getDate();
  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startDay}.–${endDay}. ${startMonth} ${startDate.getFullYear()}`;
  }
  const endMonth = monthNames[endDate.getMonth()];
  return `${startDay}. ${startMonth} – ${endDay}. ${endMonth} ${endDate.getFullYear()}`;
}

export default async function KalendarPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('kalendar');
  const tTours = await getTranslations('tours');

  const entries = await getCalendarEntries();
  const today = new Date();
  const upcoming = entries.filter((e) => new Date(e.startDate) >= new Date(today.toDateString()));

  const monthNames = t('monthsBs').split(',');

  // Group by year-month string
  const groups = new Map();
  for (const entry of upcoming) {
    const d = new Date(entry.startDate);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!groups.has(key)) {
      groups.set(key, {
        label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
        entries: [],
      });
    }
    groups.get(key).entries.push(entry);
  }

  return (
    <main id="main-content" className="min-h-[70vh] px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-wildher-text mb-3">
            {t('title')}
          </h1>
          <p className="text-body text-wildher-text-muted">{t('intro')}</p>
        </header>

        {upcoming.length === 0 ? (
          <p role="status" className="text-center text-body text-wildher-text-muted py-16">
            {t('empty')}
          </p>
        ) : (
          <div className="space-y-12">
            {[...groups.values()].map((group, gi) => (
              <section key={gi}>
                <h2 className="font-display text-xl font-semibold text-wildher-text mb-4 border-b border-neutral-200 pb-2">
                  {group.label}
                </h2>
                <ul className="space-y-3">
                  {group.entries.map((entry, i) => {
                    const title = pickLocale(entry.tour.title, locale);
                    const dateRange = formatDateRange(
                      entry.startDate,
                      entry.endDate,
                      locale,
                      monthNames
                    );
                    const statusKey =
                      entry.status === 'open'
                        ? 'statusOpen'
                        : entry.status === 'almost_full'
                          ? 'statusAlmostFull'
                          : entry.status === 'sold_out'
                            ? 'statusSoldOut'
                            : 'statusWaitlist';
                    return (
                      <li key={`${entry.tour._id}-${i}`}>
                        <Link
                          href={`/ture/${entry.tour.slug.current}`}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-radius-card border border-neutral-200 bg-white p-4 hover:border-brand-primary-green transition-colors"
                        >
                          {entry.tour.cover && (
                            <div className="sm:w-32 w-full aspect-[4/3] sm:aspect-square rounded-lg overflow-hidden flex-shrink-0">
                              <OptimizedImage
                                src={entry.tour.cover}
                                alt={title}
                                sizes="128px"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-small text-brand-primary-green font-semibold mb-1">
                              {dateRange}
                            </p>
                            <h3 className="text-h3 font-semibold text-wildher-text mb-1">
                              {title}
                            </h3>
                            <div className="flex flex-wrap gap-2 items-center text-small text-wildher-text-muted">
                              <span
                                className={`px-2 py-0.5 rounded-full text-caption font-semibold ${STATUS_CLASS[entry.status] || ''}`}
                              >
                                {t(statusKey)}
                              </span>
                              {entry.spotsLeft != null && entry.status !== 'sold_out' && (
                                <span>{t('spotsLeft', { count: entry.spotsLeft })}</span>
                              )}
                              <span>·</span>
                              <span>
                                {tTours('priceFrom')} {entry.tour.price}€
                              </span>
                            </div>
                          </div>
                          <span className="text-small font-semibold text-brand-primary-green hidden sm:inline-block">
                            {t('viewTour')} →
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
