'use client';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';

export function AboutCta() {
  const t = useTranslations('about');
  return (
    <Button as={Link} href="/ture" variant="primary" size="lg">
      {t('ctaButton')}
    </Button>
  );
}
