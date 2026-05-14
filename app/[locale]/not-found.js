import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('errors');
  return (
    <main
      id="main-content"
      className="min-h-[70vh] flex items-center justify-center px-4 py-16"
    >
      <div className="max-w-md text-center">
        <p className="text-h1 font-bold text-brand-primary-green mb-2">404</p>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-wildher-text mb-3">
          {t('notFoundTitle')}
        </h1>
        <p className="text-body text-wildher-text-muted mb-6">
          {t('notFoundText')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-brand-primary-green px-5 py-2.5 font-semibold text-white hover:bg-brand-primary-green/90 transition-colors"
        >
          {t('notFoundCta')}
        </Link>
      </div>
    </main>
  );
}
