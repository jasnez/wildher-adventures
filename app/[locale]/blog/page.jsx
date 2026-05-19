import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import OptimizedImage from '@/components/OptimizedImage';
import { getAllStories } from '@/lib/sanity/fetch';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('metaTitle'), description: t('metaDescription') };
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

export default async function BlogPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');

  const stories = (await getAllStories()) || [];

  return (
    <main id="main-content" className="min-h-[70vh] px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-wildher-text mb-3">
            {t('title')}
          </h1>
          <p className="text-body text-wildher-text-muted">{t('intro')}</p>
        </header>

        {stories.length === 0 ? (
          <p role="status" className="text-center text-body text-wildher-text-muted py-16">
            {t('empty')}
          </p>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <li key={story._id}>
                <Link
                  href={`/blog/${story.slug.current}`}
                  className="block group rounded-radius-card-lg overflow-hidden shadow-card hover:shadow-xl focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-green transition-all bg-white"
                >
                  {story.coverImage && (
                    <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                      <OptimizedImage
                        src={story.coverImage}
                        alt={pickLocale(story.title, locale)}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    {story.publishedAt && (
                      <p className="text-caption text-wildher-text-muted mb-2">
                        {formatDate(story.publishedAt, locale)}
                      </p>
                    )}
                    <h2 className="text-h3 font-semibold text-wildher-text mb-2 line-clamp-2">
                      {pickLocale(story.title, locale)}
                    </h2>
                    {story.excerpt && (
                      <p className="text-small text-wildher-text-muted line-clamp-3">
                        {pickLocale(story.excerpt, locale)}
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
