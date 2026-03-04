import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

// Static imports so Vercel/serverless bundle includes both message files
import messagesBs from '../messages/bs.json';
import messagesEn from '../messages/en.json';

const messagesMap = { bs: messagesBs, en: messagesEn };

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messagesMap[locale] ?? messagesMap[routing.defaultLocale],
  };
});
