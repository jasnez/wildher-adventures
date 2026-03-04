'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';

export function HomeNewsletter() {
  const t = useTranslations('home');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="vas@email.com"
        disabled={status === 'loading'}
        className="flex-1 rounded-radius-button border border-neutral-500 bg-white/10 px-4 py-3 text-body text-white placeholder:text-neutral-400 focus:border-brand-gold-beige focus:outline-none focus:ring-2 focus:ring-brand-gold-beige/30"
        aria-label="Email"
      />
      <Button
        type="submit"
        variant="dark"
        size="md"
        disabled={status === 'loading'}
        className="shrink-0 bg-brand-primary-green hover:bg-primary-700 border-0"
      >
        {status === 'loading' ? '...' : status === 'success' ? '✓' : t('newsletterButton')}
      </Button>
      {status === 'success' && (
        <p className="text-small text-brand-gold-beige w-full text-center sm:col-span-2" role="status">
          Hvala!
        </p>
      )}
    </form>
  );
}
