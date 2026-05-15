'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';

export function HomeNewsletter() {
  const t = useTranslations('home');
  const tNewsletter = useTranslations('newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorKey, setErrorKey] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'loading') return;
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus('error');
      setErrorKey('emptyEmail');
      return;
    }
    setStatus('loading');
    setErrorKey(null);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus('error');
        setErrorKey(data.error === 'invalid_email' ? 'invalidEmail' : 'providerError');
        return;
      }
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorKey('providerError');
    }
  }

  if (status === 'success') {
    return (
      <p
        role="status"
        className="text-body font-medium text-brand-gold-beige max-w-md mx-auto text-center"
      >
        {tNewsletter('successMessage')}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-md mx-auto"
      noValidate
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={tNewsletter('emailPlaceholder')}
          required
          disabled={status === 'loading'}
          className="flex-1 rounded-lg border border-neutral-500 bg-white/10 px-4 py-3 text-body text-white placeholder:text-neutral-400 focus:border-brand-gold-beige focus:outline-none focus:ring-2 focus:ring-brand-gold-beige/30 disabled:opacity-60"
          aria-label={tNewsletter('emailPlaceholder')}
        />
        <Button
          type="submit"
          variant="dark"
          size="md"
          disabled={status === 'loading'}
          className="shrink-0 bg-brand-primary-green hover:bg-primary-700 border-0"
        >
          {status === 'loading' ? tNewsletter('submitting') : t('newsletterButton')}
        </Button>
      </div>
      {status === 'error' && errorKey && (
        <p role="alert" className="text-caption text-red-300 text-center">
          {tNewsletter(errorKey)}
        </p>
      )}
    </form>
  );
}

export default HomeNewsletter;
