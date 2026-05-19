import React from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import OptimizedImage from '@/components/OptimizedImage';
import { getGuideBySlug } from '@/lib/sanity/fetch';

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: `${guide.name} — WildHer Adventures`,
    description: localised(guide.role, locale) || undefined,
  };
}

function localised(value, locale) {
  if (!value || typeof value !== 'object') return '';
  return (locale === 'en' && value.en) || value.bs || '';
}

function blocksToParagraphs(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b) => b?._type === 'block')
    .map((b) =>
      Array.isArray(b.children)
        ? b.children.map((c) => c.text || '').join('')
        : ''
    )
    .filter(Boolean);
}

export default async function GuideDetailPage({ params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('guides');
  const tToursNs = await getTranslations('tours');

  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  const bio = guide.bio ? localised(guide.bio, locale) : null;
  const bioParagraphs = Array.isArray(bio) ? blocksToParagraphs(bio) : [];

  return (
    <main id="main-content" className="min-h-[70vh] px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/vodice"
          className="text-small text-brand-primary-green hover:underline mb-6 inline-block"
        >
          ← {t('backToGuides')}
        </Link>

        <div className="grid gap-8 md:grid-cols-[1fr_2fr] items-start">
          {guide.photo && (
            <div className="aspect-[4/5] relative overflow-hidden rounded-radius-card-lg">
              <OptimizedImage
                src={guide.photo}
                alt={guide.name}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-wildher-text mb-2">
              {guide.name}
            </h1>
            {guide.role && (
              <p className="text-body text-brand-primary-green font-medium mb-6">
                {localised(guide.role, locale)}
              </p>
            )}

            {bioParagraphs.length > 0 && (
              <div className="space-y-4 mb-8">
                {bioParagraphs.map((p, i) => (
                  <p key={i} className="text-body text-wildher-text-muted">
                    {p}
                  </p>
                ))}
              </div>
            )}

            <dl className="grid gap-4 sm:grid-cols-3">
              {guide.languages && guide.languages.length > 0 && (
                <div>
                  <dt className="text-small font-semibold text-wildher-text mb-1">
                    {t('languagesLabel')}
                  </dt>
                  <dd className="text-small text-wildher-text-muted">
                    {guide.languages.join(', ')}
                  </dd>
                </div>
              )}
              {guide.certifications && guide.certifications.length > 0 && (
                <div>
                  <dt className="text-small font-semibold text-wildher-text mb-1">
                    {t('certificationsLabel')}
                  </dt>
                  <dd className="text-small text-wildher-text-muted">
                    {guide.certifications.map((c, i) => (
                      <div key={i}>{c}</div>
                    ))}
                  </dd>
                </div>
              )}
              {guide.specialties && guide.specialties.length > 0 && (
                <div>
                  <dt className="text-small font-semibold text-wildher-text mb-1">
                    {t('specialtiesLabel')}
                  </dt>
                  <dd className="text-small text-wildher-text-muted">
                    {guide.specialties.join(', ')}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {guide.toursLed && guide.toursLed.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-wildher-text mb-6">
              {t('toursLedLabel')}
            </h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {guide.toursLed.map((tour) => (
                <li key={tour._id}>
                  <Link
                    href={`/ture/${tour.slug.current}`}
                    className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 hover:border-brand-primary-green transition-colors"
                  >
                    {tour.cover && (
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <OptimizedImage
                          src={tour.cover}
                          alt={localised(tour.title, locale)}
                          sizes="64px"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-small font-semibold text-wildher-text">
                        {localised(tour.title, locale)}
                      </p>
                      <p className="text-small text-wildher-text-muted">
                        {tToursNs('priceFrom')} {tour.price}€
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
