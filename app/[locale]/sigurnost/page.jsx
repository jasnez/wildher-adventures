import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { SimplePage } from '@/components/SimplePage';
import { getSafetyPage } from '@/lib/sanity/fetch';
import { RichText, localiseRichText } from '@/lib/sanity/portableText';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'safety' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

function localised(value, locale) {
  if (!value || typeof value !== 'object') return '';
  return (locale === 'en' && value.en) || value.bs || '';
}

export default async function SafetyPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('safety');

  const data = await getSafetyPage();
  const intro = data?.intro ? localiseRichText(data.intro, locale) : null;
  const standards = Array.isArray(data?.standards) ? data.standards : [];
  const certifications = Array.isArray(data?.certifications) ? data.certifications : [];

  const title = localised(data?.title, locale) || t('title');

  if (!data) {
    return (
      <SimplePage title={title}>
        <p>{t('introFallback')}</p>
        <p>{t('comingSoon')}</p>
      </SimplePage>
    );
  }

  return (
    <SimplePage title={title}>
      <RichText value={intro} />

      {standards.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 not-prose">
          {standards.map((s, i) => (
            <li key={i} className="rounded-lg border border-neutral-200 p-4 bg-white">
              <h3 className="text-h3 font-semibold text-wildher-text mb-1">
                {localised(s.heading, locale)}
              </h3>
              <p className="text-small text-wildher-text-muted">
                {localised(s.description, locale)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {certifications.length > 0 && (
        <>
          <h2 className="font-display text-xl font-semibold text-wildher-text mt-8">
            {t('title')}
          </h2>
          <ul className="list-disc list-inside text-body text-wildher-text-muted">
            {certifications.map((c, i) => (
              <li key={i}>{localised(c, locale)}</li>
            ))}
          </ul>
        </>
      )}

      {data?.emergencyProcedures && (
        <RichText
          value={localiseRichText(data.emergencyProcedures, locale)}
          className="mt-8"
        />
      )}
    </SimplePage>
  );
}
