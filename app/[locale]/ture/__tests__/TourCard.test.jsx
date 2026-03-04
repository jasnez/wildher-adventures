import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next/image', () => ({
  default: (props) => <img src={props.src} alt={props.alt} />,
}));
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...p }) => <a href={href} {...p}>{children}</a>,
}));

import { TourCard } from '@/components/tours/TourCard';

const defaultTour = {
  id: '1',
  slug: 'via-ferrata-blagaj',
  title: 'Via Ferrata Blagaj',
  location: 'Buna, Blagaj',
  duration: '1 dan',
  durationCategory: '1day',
  difficulty: 2,
  difficultyLabel: 'Umjereno',
  priceFrom: 120,
  description: 'Via ferrata avantura iznad rijeke Bune uz spektakularne poglede.',
  image: '5',
  badge: null,
};

describe('TourCard', () => {
  it('renders main image, title, location, duration, difficulty, price, description and CTA', () => {
    render(<TourCard tour={defaultTour} ctaLabel="Detalji & Booking" />);
    expect(screen.getByRole('img', { name: /via ferrata blagaj/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /via ferrata blagaj/i })).toBeInTheDocument();
    expect(screen.getByText(/buna, blagaj/i)).toBeInTheDocument();
    expect(screen.getByText(/1 dan/i)).toBeInTheDocument();
    expect(screen.getByText(/umjereno/i)).toBeInTheDocument();
    expect(screen.getByText(/120€/i)).toBeInTheDocument();
    expect(screen.getByText(/via ferrata avantura iznad rijeke bune/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /detalji.*booking/i })).toBeInTheDocument();
  });

  it('renders difficulty as 1–5 icons when difficulty level 1–5', () => {
    const { container } = render(
      <TourCard tour={{ ...defaultTour, difficulty: 3 }} ctaLabel="Detalji & Booking" />
    );
    const difficultyIcons = container.querySelectorAll('[aria-label*="težina"], [data-difficulty]');
    expect(difficultyIcons.length).toBeGreaterThanOrEqual(1);
  });

  it('shows badge when tour has badge "Najpopularnije"', () => {
    render(
      <TourCard tour={{ ...defaultTour, badge: 'popular' }} ctaLabel="Detalji" badgeLabels={{ popular: 'Najpopularnije' }} />
    );
    expect(screen.getByText(/najpopularnije/i)).toBeInTheDocument();
  });

  it('shows badge "Novo" when badge is "new"', () => {
    render(
      <TourCard tour={{ ...defaultTour, badge: 'new' }} ctaLabel="Detalji" badgeLabels={{ new: 'Novo' }} />
    );
    expect(screen.getByText(/novo/i)).toBeInTheDocument();
  });

  it('shows badge "Uskoro" when badge is "coming"', () => {
    render(
      <TourCard tour={{ ...defaultTour, badge: 'coming' }} ctaLabel="Detalji" badgeLabels={{ coming: 'Uskoro' }} />
    );
    expect(screen.getByText(/uskoro/i)).toBeInTheDocument();
  });

  it('description is limited to 2 lines (line-clamp-2)', () => {
    const { container } = render(<TourCard tour={defaultTour} ctaLabel="Detalji" />);
    const desc = container.querySelector('.line-clamp-2');
    expect(desc).toBeInTheDocument();
  });
});
