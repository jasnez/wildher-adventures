'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icon } from '@/components/ui';
import OptimizedImage from '@/components/OptimizedImage';

const EXPLORE_LINKS = [
  { href: '/ture', key: 'tours' },
  { href: '/kalendar', key: 'kalendar' },
  { href: '/destinacije', key: 'destinations' },
];

const BRAND_LINKS = [
  { href: '/o-nama', key: 'about' },
  { href: '/vodice', key: 'guides' },
  { href: '/blog', key: 'blog' },
  { href: '/iskustva', key: 'iskustva' },
  { href: '/kontakt', key: 'contact' },
];

const LEGAL_LINKS = [
  { href: '/faq', key: 'faq' },
  { href: '/sigurnost', key: 'safety' },
  { href: '/privatnost', key: 'privacy' },
  { href: '/uvjeti', key: 'terms' },
];

const SOCIAL_LINKS = [
  { href: 'https://instagram.com', label: 'Instagram', icon: 'instagram' },
  { href: 'https://facebook.com', label: 'Facebook', icon: 'facebook' },
];

function FooterColumn({ title, links, tNav }) {
  return (
    <div>
      <h3 className="text-caption uppercase tracking-wide font-semibold text-brand-off-white/70 mb-4">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
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
    </div>
  );
}

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="relative bg-brand-primary-green text-brand-off-white" role="contentinfo">
      {/* Atmospheric mountain photo bleeds through at 15% under the
          brand-green overlay — gives the footer depth without merging
          visually into the charcoal newsletter section that sits
          directly above it. */}
      <OptimizedImage
        name="9"
        alt=""
        aria-hidden
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-brand-primary-green/85" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {/* Brand column — intentionally outside <nav> so the logo's
             "WildHer Adventures" aria-label isn't surfaced as a nav link
             ("Adventures" substring would otherwise match nav queries). */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center bg-brand-off-white rounded-radius-card-lg px-5 py-4 md:px-6 md:py-5 shadow-lg"
              aria-label="WildHer Adventures"
            >
              <Image
                src="/logo-primary.png"
                alt="WildHer Adventures"
                width={160}
                height={48}
                className="h-12 w-auto md:h-14"
                priority
              />
            </Link>
            <p className="mt-4 text-small text-brand-off-white/80 max-w-xs">
              {t('tagline')}
            </p>
            <ul className="mt-6 flex items-center gap-4">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-off-white/10 text-brand-off-white/90 hover:bg-brand-off-white/20 hover:text-brand-gold-beige transition-colors"
                    aria-label={s.label}
                  >
                    <Icon name={s.icon} size={20} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav columns wrapped in one nav landmark */}
          <nav aria-label="Footer navigacija" className="md:col-span-2 grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-12">
            <FooterColumn
              title={t('exploreTitle')}
              links={EXPLORE_LINKS}
              tNav={tNav}
            />
            <FooterColumn
              title={t('brandTitle')}
              links={BRAND_LINKS}
              tNav={tNav}
            />
          </nav>
        </div>

        {/* Bottom row: legal + copyright */}
        <div className="mt-12 pt-8 border-t border-brand-off-white/15 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-brand-off-white/70">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-brand-gold-beige transition-colors"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-caption text-brand-off-white/60">
            © {new Date().getFullYear()} WildHer Adventures
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
