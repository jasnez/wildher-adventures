import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getAllFaqs } from '@/lib/sanity/fetch';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faqPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
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

export default async function FaqPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('faqPage');

  const faqs = (await getAllFaqs()) || [];

  // Group by category, preserving order.
  const groups = new Map();
  for (const faq of faqs) {
    if (!groups.has(faq.category)) groups.set(faq.category, []);
    groups.get(faq.category).push(faq);
  }

  return (
    <main id="main-content" className="min-h-[70vh] px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-wildher-text mb-3 text-center">
          {t('title')}
        </h1>
        <p className="text-body text-wildher-text-muted text-center mb-12">{t('intro')}</p>

        {faqs.length === 0 ? (
          <p role="status" className="text-center text-body text-wildher-text-muted py-16">
            {t('empty')}
          </p>
        ) : (
          <div className="space-y-12">
            {[...groups.entries()].map(([category, items]) => (
              <section key={category}>
                <h2 className="font-display text-xl font-semibold text-wildher-text mb-4">
                  {t(`categories.${category}`)}
                </h2>
                <div className="space-y-3">
                  {items.map((faq) => {
                    const answerLocale = localised(faq.answer, locale);
                    const paragraphs = Array.isArray(answerLocale)
                      ? blocksToParagraphs(answerLocale)
                      : [];
                    return (
                      <details
                        key={faq._id}
                        className="group rounded-lg border border-neutral-200 bg-white p-5"
                      >
                        <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-semibold text-wildher-text">
                          <span>{localised(faq.question, locale)}</span>
                          <span
                            className="text-brand-primary-green text-xl leading-none transition-transform group-open:rotate-45"
                            aria-hidden="true"
                          >
                            +
                          </span>
                        </summary>
                        <div className="mt-3 space-y-2 text-body text-wildher-text-muted">
                          {paragraphs.length > 0
                            ? paragraphs.map((p, i) => <p key={i}>{p}</p>)
                            : null}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        <section className="mt-16 text-center bg-neutral-50 rounded-card-lg p-8">
          <h2 className="font-display text-xl font-semibold text-wildher-text mb-2">
            {t('ctaTitle')}
          </h2>
          <p className="text-body text-wildher-text-muted mb-6">{t('ctaText')}</p>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center rounded-lg bg-brand-primary-green px-6 py-3 font-semibold text-white hover:bg-brand-primary-green/90 transition-colors"
          >
            {t('ctaButton')}
          </Link>
        </section>
      </div>
    </main>
  );
}
