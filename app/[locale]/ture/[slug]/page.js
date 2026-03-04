import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function TourDetailPage({ params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('tours');
  return (
    <main id="main-content" className="min-h-screen py-16 px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-h1 text-wildher-text mb-4">
          {decodeURIComponent(slug || '').replace(/-/g, ' ')}
        </h1>
        <p className="text-body text-wildher-text-muted mb-8">
          Detalji i booking uskoro.
        </p>
        <Link href="/ture" className="text-brand-primary-green font-semibold hover:underline">
          ← {locale === 'bs' ? 'Sve ture' : 'All tours'}
        </Link>
      </div>
    </main>
  );
}
