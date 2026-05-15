/**
 * Sentry client config — runs in the browser.
 * No-op when NEXT_PUBLIC_SENTRY_DSN is empty (e.g. local dev without a Sentry account).
 */
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Sample 10 % of regular sessions in production; 100 % in dev.
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Replays are off by default — opt in later if needed.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.5,
    environment: process.env.NODE_ENV,
    // Drop noisy "ResizeObserver loop" and "Hydration mismatch" if they appear.
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
    ],
  });
}
