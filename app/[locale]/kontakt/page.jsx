import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

const CONTACT_EMAIL = 'bookings@wildheradventures.ba';
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/wildheradventures';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <main id="main-content" className="min-h-[70vh] px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-wildher-text mb-4">
          {t('title')}
        </h1>
        <p className="text-body text-wildher-text-muted mb-10">{t('intro')}</p>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
            <h2 className="text-h3 font-semibold text-wildher-text mb-2">
              {t('scheduleTitle')}
            </h2>
            <p className="text-small text-wildher-text-muted mb-4">
              {t('scheduleText')}
            </p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-brand-primary-green px-5 py-2.5 font-semibold text-white hover:bg-brand-primary-green/90 transition-colors"
            >
              {t('scheduleCta')}
            </a>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
            <h2 className="text-h3 font-semibold text-wildher-text mb-2">
              {t('emailTitle')}
            </h2>
            <p className="text-small text-wildher-text-muted mb-2">
              {t('emailText')}{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-brand-primary-green hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center justify-center rounded-lg border border-brand-primary-green bg-white px-5 py-2.5 font-semibold text-brand-primary-green hover:bg-brand-primary-green hover:text-white transition-colors mt-2"
            >
              {t('emailCta')}
            </a>
          </section>
        </div>

        <p className="text-small text-wildher-text-muted mt-8 text-center">
          {t('responseTime')}
        </p>
      </div>
    </main>
  );
}
