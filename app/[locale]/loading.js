import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('errors');
  return (
    <main
      id="main-content"
      className="min-h-[60vh] flex items-center justify-center px-4 py-16"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="text-body text-wildher-text-muted">{t('loading')}</p>
    </main>
  );
}
