import React from 'react';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {vi} from 'vitest';

// Mocks for next-intl and navigation
vi.mock('next-intl', () => {
  return {
    useLocale: () => 'bs',
    useTranslations: (ns) => {
      const nav = {
        tours: 'Ture',
        destinations: 'Destinacije',
        about: 'O nama',
        blog: 'Blog',
        gallery: 'Galerija',
        contact: 'Kontakt',
        mainNavAria: 'Glavna navigacija',
        mobileNavAria: 'Mobilna navigacija',
        openMenu: 'Otvori meni',
        closeMenu: 'Zatvori meni',
      };
      const common = {
        book: 'Rezerviši turu',
        language: 'Jezik',
        home: 'Početna',
      };
      return (key) => {
        if (ns === 'nav') return nav[key] ?? key;
        if (ns === 'common') return common[key] ?? key;
        return key;
      };
    },
  };
});

let currentPathname = '/';

vi.mock('@/i18n/navigation', () => {
  return {
    Link: ({href, children, ...rest}) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
    usePathname: () => currentPathname,
    useRouter: () => ({replace: () => {}}),
    __setPathname: (value) => {
      currentPathname = value;
    },
  };
});

import {Header} from '../Header';
import {__setPathname as setMockPathname} from '@/i18n/navigation';

describe('Header', () => {
  it('označi aktivni link u navigaciji prema trenutnom pathu', () => {
    setMockPathname('/ture');
    render(<Header />);

    const nav = screen.getByRole('navigation', {name: /glavna navigacija/i});
    const {getByRole} = within(nav);
    const activeLink = getByRole('link', {name: /ture/i});

    expect(nav).toBeInTheDocument();
    expect(activeLink).toHaveAttribute('aria-current', 'page');
    expect(activeLink.className).toMatch(/text-brand-primary-green/);
  });

  it('otvara i zatvara mobilni meni te reaguje na Escape', async () => {
    const user = userEvent.setup();
    setMockPathname('/');
    render(<Header />);

    const toggle = screen.getByRole('button', {name: /otvori meni/i});
    await user.click(toggle);

    const overlay = screen.getByTestId('mobile-overlay');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(overlay).toHaveAttribute('aria-hidden', 'false');

    await user.keyboard('{Escape}');

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  it('prikazuje booking CTA s prevedenim labelom', () => {
    setMockPathname('/');
    render(<Header />);

    const booking = screen.getAllByRole('link', {name: /rezerviši turu/i})[0];
    expect(booking).toBeInTheDocument();
  });
});

