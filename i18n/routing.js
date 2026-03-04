import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['bs', 'en'],
  defaultLocale: 'bs',
  localePrefix: 'as-needed',
});
