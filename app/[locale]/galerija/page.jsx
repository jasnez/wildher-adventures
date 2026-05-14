import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { ComingSoon } from '@/components/ComingSoon';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  const tCs = await getTranslations({ locale, namespace: 'comingSoon' });
  return {
    title: `${t('gallery')} — ${tCs('title')}`,
  };
}

export default async function GalleryPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');
  const tCs = await getTranslations('comingSoon');

  return (
    <ComingSoon
      heading={t('gallery')}
      title={tCs('title')}
      text={tCs('text')}
      ctaLabel={tCs('cta')}
    />
  );
}
