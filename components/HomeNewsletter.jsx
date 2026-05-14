import { getTranslations } from 'next-intl/server';

const NEWSLETTER_EMAIL = 'hello@wildheradventures.ba';

export async function HomeNewsletter() {
  const t = await getTranslations('home');
  const tCommon = await getTranslations('newsletter');

  const subject = encodeURIComponent(tCommon('subject'));
  const href = `mailto:${NEWSLETTER_EMAIL}?subject=${subject}`;

  return (
    <div className="flex flex-col items-center gap-3 max-w-md mx-auto text-center">
      <a
        href={href}
        className="inline-flex items-center justify-center rounded-lg bg-brand-primary-green px-6 py-3 font-semibold text-white hover:bg-primary-700 transition-colors"
      >
        {t('newsletterButton')}
      </a>
      <p className="text-small text-white/70">{tCommon('comingSoonNote')}</p>
    </div>
  );
}

export default HomeNewsletter;
