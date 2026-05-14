import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { SimplePage } from '@/components/SimplePage';
import { getPrivacyPage } from '@/lib/sanity/fetch';
import { RichText, localiseRichText } from '@/lib/sanity/portableText';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

function localised(value, locale) {
  if (!value || typeof value !== 'object') return '';
  return (locale === 'en' && value.en) || value.bs || '';
}

export default async function PrivacyPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacy');

  const data = await getPrivacyPage();
  const title = localised(data?.title, locale) || t('title');
  const body = data?.body ? localiseRichText(data.body, locale) : null;
  const updated = data?.lastUpdated || null;

  return (
    <SimplePage
      title={title}
      lastUpdatedLabel={updated ? t('lastUpdatedLabel') : null}
      lastUpdatedDate={updated}
    >
      {body ? <RichText value={body} /> : <p>{t('comingSoon')}</p>}
    </SimplePage>
  );
}
