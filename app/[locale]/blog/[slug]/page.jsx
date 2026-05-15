import React from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import OptimizedImage from '@/components/OptimizedImage';
import { TourCard } from '@/components/tours/TourCard';
import { mapTourCard } from '@/lib/sanity/adapters';
import { getStoryBySlug } from '@/lib/sanity/fetch';
import { RichText, localiseRichText } from '@/lib/sanity/portableText';

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return {};
  return {
    title: `${pickLocale(story.title, locale)} — WildHer Journal`,
    description: pickLocale(story.excerpt, locale) || undefined,
    openGraph: {
      type: 'article',
      title: pickLocale(story.title, locale),
      description: pickLocale(story.excerpt, locale) || undefined,
      images: story.coverImage ? [{ url: story.coverImage }] : undefined,
    },
  };
}

function pickLocale(value, locale) {
  if (!value || typeof value !== 'object') return '';
  return (locale === 'en' && value.en) || value.bs || '';
}

function formatDate(iso, locale) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : 'bs-BA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default async function BlogPostPage({ params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const tTours = await getTranslations('tours');

  const story = await getStoryBySlug(slug);
  if (!story) notFound();

  const body = localiseRichText(story.body, locale);
  const relatedTours = Array.isArray(story.relatedTours) ? story.relatedTours : [];
  const author = story.author && typeof story.author === 'object' ? story.author : null;

  const fallbackDuration = (days) => {
    if (days <= 1) return tTours('duration1day');
    if (days <= 2) return tTours('durationWeekend');
    if (days <= 5) return tTours('duration3to5');
    return tTours('duration5plus');
  };
  const difficultyLookup = (key) => tTours(key);
  const cardTours = relatedTours.map((tour) =>
    mapTourCard(tour, locale === 'en' ? 'en' : 'bs', difficultyLookup, fallbackDuration)
  );

  return (
    <main id="main-content" className="min-h-[70vh]">
      <article className="mx-auto max-w-3xl px-4 py-16">
        <Link
          href="/blog"
          className="text-small text-brand-primary-green hover:underline mb-6 inline-block"
        >
          ← {t('backToBlog')}
        </Link>

        {story.publishedAt && (
          <p className="text-caption text-wildher-text-muted mb-2">
            {t('publishedOn')}: {formatDate(story.publishedAt, locale)}
          </p>
        )}
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-wildher-text mb-6 leading-tight">
          {pickLocale(story.title, locale)}
        </h1>

        {story.excerpt && (
          <p className="text-body-lg text-wildher-text-muted mb-8">
            {pickLocale(story.excerpt, locale)}
          </p>
        )}

        {story.coverImage && (
          <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-8 bg-neutral-100">
            <OptimizedImage
              src={story.coverImage}
              alt={pickLocale(story.title, locale)}
              sizes="(max-width: 768px) 100vw, 768px"
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        {body && (
          <div className="prose max-w-none text-body text-wildher-text space-y-4">
            <RichText value={body} />
          </div>
        )}

        {author && author.name && (
          <footer className="mt-12 pt-8 border-t border-neutral-200 flex items-center gap-4">
            {author.photo && (
              <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-100">
                <OptimizedImage
                  src={author.photo}
                  alt={author.name}
                  sizes="56px"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-caption text-wildher-text-muted">{t('by')}</p>
              {author.slug?.current ? (
                <Link
                  href={`/vodice/${author.slug.current}`}
                  className="text-small font-semibold text-wildher-text hover:text-brand-primary-green"
                >
                  {author.name}
                </Link>
              ) : (
                <p className="text-small font-semibold text-wildher-text">{author.name}</p>
              )}
            </div>
          </footer>
        )}
      </article>

      {cardTours.length > 0 && (
        <section className="py-12 md:py-16 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-wildher-text mb-8 text-center">
              {t('relatedTours')}
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
    </main>
  );
}
