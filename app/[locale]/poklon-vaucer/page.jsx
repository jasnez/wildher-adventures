import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import OptimizedImage from '@/components/OptimizedImage';
import { getGiftVoucherPage } from '@/lib/sanity/fetch';
import { RichText, localiseRichText } from '@/lib/sanity/portableText';

const CONTACT_EMAIL = 'bookings@wildheradventures.ba';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'giftVoucher' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

function localised(value, locale) {
  if (!value || typeof value !== 'object') return '';
  return (locale === 'en' && value.en) || value.bs || '';
}

export default async function GiftVoucherPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('giftVoucher');

  const data = await getGiftVoucherPage();
  const title = localised(data?.title, locale) || t('title');
  const descriptionRich = localiseRichText(data?.description, locale);
  const tiers = Array.isArray(data?.tiers) ? data.tiers : [];
  const heroImage = data?.heroImage || null;

  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `${t('title')} — upit`
  )}`;

  return (
    <main id="main-content" className="min-h-[70vh]">
      <section className="relative bg-neutral-100 py-16 md:py-24 overflow-hidden">
        {heroImage && (
          <>
            <OptimizedImage
              src={heroImage}
              alt=""
              sizes="100vw"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-neutral-100/60" />
          </>
        )}
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-wildher-text mb-4">
            {title}
          </h1>
          {descriptionRich ? (
            <div className="text-body text-wildher-text-muted mx-auto max-w-2xl">
              <RichText value={descriptionRich} />
            </div>
          ) : (
            <p className="text-body text-wildher-text-muted mx-auto max-w-2xl">
              {t('introFallback')}
            </p>
          )}
        </div>
      </section>

      {tiers.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-wildher-text text-center mb-10">
              {t('tiersTitle')}
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tiers.map((tier, i) => (
                <li
                  key={i}
                  className="rounded-radius-card-lg border border-neutral-200 bg-white p-6 text-center shadow-card"
                >
                  <p className="text-3xl md:text-4xl font-bold text-brand-primary-green mb-1">
                    {tier.amount}
                    {tier.currency === 'EUR' ? '€' : ` ${tier.currency}`}
                  </p>
                  {tier.label && (
                    <p className="text-small text-wildher-text-muted">
                      {localised(tier.label, locale)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <a
            href={mailHref}
            className="inline-flex items-center justify-center rounded-lg bg-brand-primary-green px-8 py-4 font-semibold text-white hover:bg-brand-primary-green/90 transition-colors"
          >
            {t('cta')}
          </a>
          <p className="text-small text-wildher-text-muted mt-4">{t('ctaNote')}</p>
        </div>
      </section>
    </main>
  );
}
