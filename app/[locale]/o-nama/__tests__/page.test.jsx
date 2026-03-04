import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next/image', () => ({
  default: (props) => <img src={props.src} alt={props.alt} />,
}));

import { AboutHero } from '@/components/AboutHero';

describe('O nama — hero sekcija', () => {
  it('hero sekcija koristi sliku about-hero (vodopad/priroda)', () => {
    render(
      <AboutHero
        heroImageSrc="/about-hero.png"
        heroAlt="WildHer Adventures — rijeka u zelenoj šumi"
        heroTitle="Naša priča"
        heroSubtitle="WildHer Adventures je nastao iz ljubavi prema planinama."
      />
    );

    const img = screen.getByRole('img', { name: /wildher adventures.*rijeka u zelenoj šumi/i });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toContain('about-hero');
  });
});
