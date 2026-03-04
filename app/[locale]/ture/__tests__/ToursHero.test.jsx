import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next/image', () => ({
  default: (props) => <img src={props.src} alt={props.alt} />,
}));

import { ToursHero } from '@/components/tours/ToursHero';

describe('ToursHero', () => {
  it('renders hero title and subtitle', () => {
    render(
      <ToursHero
        heroImageSrc="/tours-hero.png"
        heroAlt="Ture i iskustva"
        heroTitle="Ture i iskustva"
        heroSubtitle="Od jednodnevnih hiking tura do višednevnih ekspedicija — pronađi svoju avanturu"
      />
    );
    expect(screen.getByRole('heading', { name: /ture i iskustva/i })).toBeInTheDocument();
    expect(
      screen.getByText(/od jednodnevnih hiking tura do višednevnih ekspedicija/i)
    ).toBeInTheDocument();
  });

  it('uses hero image with correct src', () => {
    render(
      <ToursHero
        heroImageSrc="/tours-hero.png"
        heroAlt="Ture"
        heroTitle="Ture"
        heroSubtitle="Intro"
      />
    );
    const img = screen.getByRole('img', { name: /ture/i });
    expect(img.getAttribute('src')).toContain('tours-hero');
  });
});
