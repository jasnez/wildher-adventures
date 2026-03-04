'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icon } from '@/components/ui';

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

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="bg-brand-primary-green text-brand-off-white" role="contentinfo">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-6 md:py-16 lg:px-8">
        {/* Lijevo: logo + tagline (kao na primjeru) */}
        <div className="max-w-sm">
          <Link href="/" className="inline-block" aria-label="WildHer Adventures">
            <Image
              src="/logo-dark.svg"
              alt="WildHer Adventures"
              width={220}
              height={70}
              className="h-12 w-auto md:h-14"
              unoptimized
            />
          </Link>
          <p className="mt-4 text-small text-brand-off-white/80">
            {t('tagline')}
          </p>
        </div>

        {/* Desno: glavna navigacija, pravne stranice i social u jednom stubcu */}
        <div className="flex flex-1 flex-col items-start gap-6 text-sm md:items-end md:text-right">
          <nav aria-label="Footer navigacija">
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
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

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-caption text-brand-off-white/80">
            {LEGAL_LINKS.map((link, index) => (
              <React.Fragment key={link.href}>
                {index > 0 && <span>·</span>}
                <Link
                  href={link.href}
                  className="hover:text-brand-gold-beige transition-colors"
                >
                  {t(link.key)}
                </Link>
              </React.Fragment>
            ))}
            <span className="hidden md:inline">·</span>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-off-white/80 hover:text-brand-gold-beige transition-colors"
                  aria-label={s.label}
                >
                  <Icon name={s.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          <p className="text-caption text-brand-off-white/70">
            © {new Date().getFullYear()} WildHer Adventures
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
