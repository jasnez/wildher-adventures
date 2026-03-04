'use client';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';

export function HomeHeroCTAs() {
  const t = useTranslations('home');
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Button as={Link} href="/ture" variant="primary" size="lg">
        {t('ctaTours')}
      </Button>
      <Button as={Link} href="/o-nama" variant="outline" size="lg" className="border-white text-white hover:bg-white/10 hover:text-white">
        {t('ctaLearnMore')}
      </Button>
    </div>
  );
}

export function ScrollIndicator() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
      <span className="block w-6 h-10 rounded-full border-2 border-white/80 flex items-start justify-center pt-2">
        <span className="w-1 h-2 rounded-full bg-white/80" />
      </span>
    </div>
  );
}
