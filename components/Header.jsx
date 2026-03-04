'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { ButtonLink } from '@/components/ui';

const NAV_LINKS = [
  { href: '/ture', key: 'tours' },
  { href: '/destinacije', key: 'destinations' },
  { href: '/o-nama', key: 'about' },
  { href: '/blog', key: 'blog' },
  { href: '/galerija', key: 'gallery' },
  { href: '/kontakt', key: 'contact' },
];

export function LanguageToggle({ className = '' }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  const handleLocale = (newLocale) => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div
      className={`inline-flex rounded-radius-button border border-neutral-300 bg-white p-0.5 ${className}`}
      role="group"
      aria-label={t('language')}
    >
      <button
        type="button"
        onClick={() => handleLocale('bs')}
        className={`rounded-md px-2.5 py-1 text-small font-medium transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center md:min-h-0 md:min-w-0 md:py-1.5 ${
          locale === 'bs' ? 'bg-brand-primary-green text-white' : 'text-wildher-text-muted hover:text-wildher-text'
        }`}
        aria-pressed={locale === 'bs'}
      >
        BS
      </button>
      <button
        type="button"
        onClick={() => handleLocale('en')}
        className={`rounded-md px-2.5 py-1 text-small font-medium transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center md:min-h-0 md:min-w-0 md:py-1.5 ${
          locale === 'en' ? 'bg-brand-primary-green text-white' : 'text-wildher-text-muted hover:text-wildher-text'
        }`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  );
}

function HamburgerIcon({ open, className = '' }) {
  return (
    <span className={`block w-6 h-5 relative ${className}`} aria-hidden="true">
      <span
        className={`absolute left-0 top-1/2 w-full h-0.5 bg-current transition-all duration-200 -translate-y-1/2 ${
          open ? 'rotate-45' : '-translate-y-1.5'
        }`}
      />
      <span
        className={`absolute left-0 top-1/2 w-full h-0.5 bg-current transition-all duration-200 -translate-y-1/2 ${
          open ? 'opacity-0' : ''
        }`}
      />
      <span
        className={`absolute left-0 top-1/2 w-full h-0.5 bg-current transition-all duration-200 -translate-y-1/2 ${
          open ? '-rotate-45' : 'translate-y-1.5'
        }`}
      />
    </span>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef(null);
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();

  const isActive = (href) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen && mobileMenuRef.current) {
      const firstLink = mobileMenuRef.current.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          scrolled ? 'bg-white/95 shadow-card backdrop-blur-sm' : 'bg-white'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center" aria-label={`WildHer Adventures — ${tCommon('home')}`}>
            <Image
              src="/logo-primary.png"
              alt="WildHer Adventures"
              width={160}
              height={48}
              className="h-9 w-auto md:h-10"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label={t('mainNavAria')}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`text-body font-medium transition-colors border-b-2 border-transparent hover:text-brand-primary-green ${
                  isActive(link.href)
                    ? 'text-brand-primary-green border-brand-primary-green'
                    : 'text-wildher-text'
                }`}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <LanguageToggle />
            <ButtonLink href="/prijava" variant="primary" size="md">
              {tCommon('book')}
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-wildher-text lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        data-testid="mobile-overlay"
        className={`fixed inset-0 z-40 bg-white lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex min-h-full flex-col pt-20 pb-8 px-6">
          <nav className="flex flex-col gap-2" aria-label={t('mobileNavAria')}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-body-lg font-medium text-wildher-text hover:text-brand-primary-green border-b border-neutral-200"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-small text-wildher-text-muted">
                {tCommon('language')}
              </span>
              <LanguageToggle />
            </div>
            <ButtonLink
              href="/prijava"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              onClick={() => setMobileOpen(false)}
            >
              {tCommon('book')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
