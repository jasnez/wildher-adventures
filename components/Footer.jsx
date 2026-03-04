'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button, Icon } from '@/components/ui';

const FOOTER_NAV = [
  { href: '/ture', key: 'tours' },
  { href: '/destinacije', key: 'destinations' },
  { href: '/o-nama', key: 'about' },
  { href: '/blog', key: 'blog' },
  { href: '/galerija', key: 'gallery' },
  { href: '/kontakt', key: 'contact' },
];

const LEGAL_LINKS = [
  { href: '/faq', key: 'faq' },
  { href: '/privatnost', key: 'privacy' },
  { href: '/uslovi', key: 'terms' },
];

const SOCIAL_LINKS = [
  { href: 'https://instagram.com', label: 'Instagram', icon: 'instagram' },
  { href: 'https://facebook.com', label: 'Facebook', icon: 'facebook' },
];

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const t = useTranslations('footer');

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1">
        <label htmlFor="footer-newsletter-email" className="sr-only">
          E-mail
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vas@email.com"
          disabled={status === 'loading'}
          className="w-full rounded-radius-button border border-neutral-500 bg-neutral-800/50 px-4 py-2.5 text-body text-brand-off-white placeholder:text-neutral-500 focus:border-brand-gold-beige focus:outline-none focus:ring-2 focus:ring-brand-gold-beige/30 disabled:opacity-60"
          aria-describedby={status === 'success' ? 'newsletter-success' : undefined}
        />
      </div>
      <Button
        type="submit"
        variant="dark"
        size="md"
        disabled={status === 'loading'}
        className="shrink-0"
      >
        {status === 'loading' ? '...' : status === 'success' ? '✓' : t('submit')}
      </Button>
      {status === 'success' && (
        <p id="newsletter-success" className="text-small text-brand-gold-beige sm:col-span-2" role="status">
          {t('thanks')}
        </p>
      )}
    </form>
  );
}

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="bg-brand-charcoal text-brand-off-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
        {/* Glavni blok: logo, nav, newsletter */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Logo + tagline */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block" aria-label="WildHer Adventures">
              <Image
                src="/logo-dark.svg"
                alt="WildHer Adventures"
                width={180}
                height={54}
                className="h-10 w-auto md:h-11"
                unoptimized
              />
            </Link>
            <p className="mt-4 text-small text-neutral-400 max-w-xs">
              {t('tagline')}
            </p>
          </div>

          <nav className="lg:col-span-4" aria-label="Footer navigacija">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-small font-medium text-brand-off-white/90 hover:text-brand-gold-beige transition-colors"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h3 className="text-body font-semibold text-brand-off-white mb-3">
              {t('newsletter')}
            </h3>
            <p className="text-small text-neutral-400 mb-4">
              {t('newsletterDesc')}
            </p>
            <NewsletterSignup />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-neutral-700 pt-8 md:flex-row">
          <nav aria-label="Pravne stranice">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-caption text-neutral-400 hover:text-brand-off-white transition-colors"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-caption text-neutral-500">
            © {new Date().getFullYear()} WildHer Adventures
          </p>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-brand-gold-beige transition-colors"
                aria-label={s.label}
              >
                <Icon name={s.icon} size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
