import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: (ns) => {
    const tours = (key) => {
      const map = {
        heroTitle: 'Ture i iskustva',
        heroSubtitle: 'Intro',
        categoryJednodnevneIntro:
          'Jednodnevne ture — savršen izbor za one koji žele jedan dan u prirodi.',
        categoryVikendIntro: 'Vikend paketi — dva dana avanture.',
        categoryEkspedicijeIntro: 'Višednevne ekspedicije — za istinske avanturiste.',
        categoryRetreatIntro: 'Wellness i mindfulness programi.',
        filterType: 'Tip ture',
        filterDuration: 'Trajanje',
        ctaDetailsBooking: 'Detalji & Booking',
        giftVoucherTitle: 'Pokloni avanturu',
      };
      return map[key] ?? key;
    };
    const home = (key) => key;
    const about = (key) => key;
    if (ns === 'tours') return tours;
    if (ns === 'home') return home;
    if (ns === 'about') return about;
    return (key) => key;
  },
}));

vi.mock('next/image', () => ({
  default: (props) => <img src={props.src} alt={props.alt} />,
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...p }) => <a href={href} {...p}>{children}</a>,
}));

describe('Tours category subpages', () => {
  it('jednodnevne page shows intro text for one-day tours', async () => {
    const { default: Page } = await import('../jednodnevne/page.jsx');
    const Rendered = await Page({ params: Promise.resolve({ locale: 'bs' }) });
    render(Rendered);
    expect(
      screen.getByText(/jednodnevne ture.*jedan dan u prirodi|savršen izbor/i)
    ).toBeInTheDocument();
  });

  it('vikend page shows intro for weekend packages', async () => {
    const { default: Page } = await import('../vikend/page.jsx');
    const Rendered = await Page({ params: Promise.resolve({ locale: 'bs' }) });
    render(Rendered);
    expect(screen.getByText(/vikend paketi — dva dana avanture/i)).toBeInTheDocument();
  });

  it('ekspedicije page shows intro for multi-day expeditions', async () => {
    const { default: Page } = await import('../ekspedicije/page.jsx');
    const Rendered = await Page({ params: Promise.resolve({ locale: 'bs' }) });
    render(Rendered);
    expect(screen.getByText(/višednevne ekspedicije — za istinske avanturiste/i)).toBeInTheDocument();
  });

  it('retreat page shows intro for wellness/mindfulness', async () => {
    const { default: Page } = await import('../retreat/page.jsx');
    const Rendered = await Page({ params: Promise.resolve({ locale: 'bs' }) });
    render(Rendered);
    expect(screen.getByText(/wellness i mindfulness programi/i)).toBeInTheDocument();
  });
});
