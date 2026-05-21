'use client';

import React from 'react';
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

/**
 * Brand logo inlined as SVG so className sizing always applies.
 * Visual content is the light-on-dark variant from
 * /public/logo-dark.svg — kept in sync if that asset changes.
 */
function FooterLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 64"
      fill="none"
      aria-hidden="true"
      className="w-64 md:w-80 h-auto"
    >
      <g transform="translate(0, 8) scale(0.5)">
        <circle cx="92" cy="22" r="10" fill="#c9a227" />
        <g stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round">
          <line x1="92" y1="10" x2="92" y2="6" />
          <line x1="92" y1="34" x2="92" y2="38" />
          <line x1="80" y1="22" x2="76" y2="22" />
          <line x1="104" y1="22" x2="108" y2="22" />
          <line x1="84" y1="14" x2="81" y2="11" />
          <line x1="100" y1="14" x2="103" y2="11" />
          <line x1="84" y1="30" x2="81" y2="33" />
          <line x1="100" y1="30" x2="103" y2="33" />
        </g>
        <path d="M0 80 L0 35 L35 80 Z" fill="#b8d4c4" />
        <path d="M28 80 L28 28 L55 80 Z" fill="#c8e0d0" />
        <path
          d="M22 80 Q30 55 38 45 Q45 38 52 50 Q58 65 65 80"
          stroke="#8b7355"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="48" cy="32" r="3" fill="#f7f5f2" />
        <path d="M48 35 L48 48 L45 56 L51 56 L48 48" fill="#f7f5f2" />
        <path d="M48 38 L42 45" stroke="#f7f5f2" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M48 42 L52 48" stroke="#f7f5f2" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50 40 L52 46" stroke="#a08060" strokeWidth="1" strokeLinecap="round" />
      </g>
      <text
        x="72"
        y="38"
        fontFamily="var(--font-playfair), ui-serif, Georgia, serif"
        fontSize="26"
        fontWeight="700"
        fill="#f7f5f2"
      >
        WildHer
      </text>
      <text
        x="72"
        y="54"
        fontFamily="var(--font-plus-jakarta), ui-sans-serif, system-ui, sans-serif"
        fontSize="14"
        fontWeight="500"
        fill="#a08060"
      >
        Adventures
      </text>
    </svg>
  );
}

function FooterColumn({ title, links, tNav }) {
  return (
    <div>
      <h3 className="text-caption uppercase tracking-wide font-semibold text-brand-off-white/70 mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-body font-medium text-brand-off-white/90 hover:text-brand-gold-beige transition-colors"
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
              className="inline-block"
              aria-label="WildHer Adventures"
            >
              {/*
                Inline SVG, not <img>. Two earlier attempts to render
                /logo-dark.svg through next/Image and plain <img> both
                ended up with the logo rendering far smaller than the
                className width — likely a Tailwind v4 + browser
                interaction with external SVGs that I can't reliably
                debug in this codebase. Embedding the SVG directly in
                JSX makes the className apply to the <svg> element
                itself, so sizing is guaranteed.
              */}
              <FooterLogo />
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
