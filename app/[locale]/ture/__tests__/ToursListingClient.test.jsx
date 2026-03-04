import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.mock('next/image', () => ({ default: (props) => <img src={props.src} alt={props.alt} /> }));
vi.mock('@/i18n/navigation', () => ({ Link: ({ href, children, ...p }) => <a href={href} {...p}>{children}</a> }));

import { ToursListingClient } from '@/components/tours/ToursListingClient';

const mockTours = [
  { id: '1', slug: 'via-ferrata', type: 'via_ferrata', durationCategory: '1day', difficulty: 2, priceFrom: 120, sortOrder: 1, title: 'Via Ferrata', location: 'Blagaj', duration: '1 dan', difficultyLabel: 'Umjereno', description: 'Opis', image: '5', badge: 'popular' },
  { id: '2', slug: 'hike', type: 'hiking', durationCategory: '1day', difficulty: 2, priceFrom: 95, sortOrder: 2, title: 'Hiking Tour', location: 'Visočica', duration: '1 dan', difficultyLabel: 'Umjereno', description: 'Opis', image: '8', badge: null },
  { id: '3', slug: 'retreat', type: 'retreat', durationCategory: 'weekend', difficulty: 1, priceFrom: 280, sortOrder: 3, title: 'Retreat', location: 'Blidinje', duration: '2 dana', difficultyLabel: 'Lagano', description: 'Opis', image: '6', badge: null },
];

const labels = {
  filterType: 'Tip ture',
  filterDuration: 'Trajanje',
  filterDifficulty: 'Težina',
  filterPrice: 'Cijena',
  filterMonth: 'Mjesec',
  sortBy: 'Sortiraj po',
  sortDate: 'Datum',
  sortPrice: 'Cijena',
  sortPopularity: 'Popularnost',
  typeHiking: 'Hiking',
  typeViaFerrata: 'Via ferrata',
  typeCanyoning: 'Kanjoning',
  typeRetreat: 'Retreat',
  duration1day: '1 dan',
  durationWeekend: 'Vikend',
  duration3to5: '3–5 dana',
  duration5plus: '5+ dana',
  difficultyEasy: 'Lagano',
  difficultyModerate: 'Umjereno',
  difficultyChallenging: 'Zahtjevno',
};

describe('ToursListingClient', () => {
  it('renders filter bar and all tour cards when no filters applied', () => {
    render(<ToursListingClient tours={mockTours} labels={labels} ctaLabel="Detalji" badgeLabels={{}} />);
    expect(screen.getByLabelText(/tip ture/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /via ferrata/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /hiking tour/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /retreat/i })).toBeInTheDocument();
  });

  it('shows only tours matching selected type filter after user selects type', async () => {
    const user = userEvent.setup();
    render(<ToursListingClient tours={mockTours} labels={labels} ctaLabel="Detalji" badgeLabels={{}} />);
    const typeSelect = screen.getByLabelText(/tip ture/i);
    await user.selectOptions(typeSelect, 'hiking');
    expect(screen.getByRole('heading', { name: /hiking tour/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /via ferrata/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /retreat/i })).not.toBeInTheDocument();
  });

  it('shows only tours within price range when user sets price max', async () => {
    render(<ToursListingClient tours={mockTours} labels={labels} ctaLabel="Detalji" badgeLabels={{}} />);
    const priceSlider = screen.getByRole('slider', { name: /cijena/i });
    fireEvent.change(priceSlider, { target: { value: '100' } });
    expect(screen.getByRole('heading', { name: /hiking tour/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /via ferrata/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /retreat/i })).not.toBeInTheDocument();
  });
});
