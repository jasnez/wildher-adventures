import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: (ns) => (key) => {
    const tours = {
      heroTitle: 'Ture i iskustva',
      heroSubtitle: 'Od jednodnevnih hiking tura do višednevnih ekspedicija — pronađi svoju avanturu',
      filterType: 'Tip ture',
      filterDuration: 'Trajanje',
      filterDifficulty: 'Težina',
      filterPrice: 'Cijena',
      filterMonth: 'Mjesec / datum',
      sortBy: 'Sortiraj po',
      sortDate: 'Datum',
      sortPrice: 'Cijena',
      sortPopularity: 'Popularnost',
      ctaDetailsBooking: 'Detalji & Booking',
      giftVoucherTitle: 'Pokloni avanturu',
      giftVoucherCta: 'Kupi vaučer',
    };
    const home = { tour1Title: 'Via Ferrata Blagaj', tour1Location: 'Buna, Blagaj', tour1Duration: '1 dan', tour1Difficulty: 'Umjereno', tour1Desc: 'Via ferrata avantura...', tour2Title: 'Visočica', tour2Location: 'Visočica', tour2Duration: '1 dan', tour2Difficulty: 'Umjereno', tour2Desc: '...', tour3Title: 'Prenj', tour3Location: 'Prenj', tour3Duration: '3 dana', tour3Difficulty: 'Zahtjevno', tour3Desc: '...', dest5Name: 'Zelengora', dest6Name: 'Blidinje' };
    const about = { communityP2: 'To je zajednica...' };
    const maps = { tours, home, about };
    const m = maps[ns] || {};
    return m[key] ?? key;
  },
}));

vi.mock('next/image', () => ({
  default: (props) => <img src={props.src} alt={props.alt} />,
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...p }) => <a href={href} {...p}>{children}</a>,
}));

import ToursPage from '../page';

describe('Tours listing page', () => {
  it('has hero with title "Ture i iskustva" and intro text', async () => {
    const Page = await ToursPage({ params: Promise.resolve({ locale: 'bs' }) });
    render(Page);
    expect(screen.getByRole('heading', { name: /ture i iskustva/i })).toBeInTheDocument();
    expect(
      screen.getByText(/od jednodnevnih hiking tura do višednevnih ekspedicija/i)
    ).toBeInTheDocument();
  });

  it('has filter bar with tip ture, trajanje, težina, cijena, mjesec, sortiraj', async () => {
    const Page = await ToursPage({ params: Promise.resolve({ locale: 'bs' }) });
    render(Page);
    expect(screen.getByText(/tip ture/i)).toBeInTheDocument();
    expect(screen.getByText(/trajanje/i)).toBeInTheDocument();
    expect(screen.getByText(/težina/i)).toBeInTheDocument();
    expect(screen.getByText(/sortiraj po/i)).toBeInTheDocument();
  });

  it('has grid of tour cards with CTA "Detalji & Booking"', async () => {
    const Page = await ToursPage({ params: Promise.resolve({ locale: 'bs' }) });
    render(Page);
    const ctas = screen.getAllByRole('link', { name: /detalji.*booking/i });
    expect(ctas.length).toBeGreaterThanOrEqual(1);
  });

  it('has gift voucher banner "Pokloni avanturu"', async () => {
    const Page = await ToursPage({ params: Promise.resolve({ locale: 'bs' }) });
    render(Page);
    expect(screen.getByText(/pokloni avanturu/i)).toBeInTheDocument();
  });
});
