import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToursFilterBar } from '@/components/tours/ToursFilterBar';

const defaultLabels = {
  filterType: 'Tip ture',
  filterDuration: 'Trajanje',
  filterDifficulty: 'Težina',
  filterPrice: 'Cijena',
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
  difficultyDemanding: 'Zahtjevno+',
  difficultyExpert: 'Ekspertno',
};

describe('ToursFilterBar', () => {
  it('renders filter for tip ture (type)', () => {
    render(<ToursFilterBar labels={defaultLabels} onFilterChange={() => {}} />);
    expect(screen.getByText(/tip ture/i)).toBeInTheDocument();
  });

  it('renders filter for trajanje (duration)', () => {
    render(<ToursFilterBar labels={defaultLabels} onFilterChange={() => {}} />);
    expect(screen.getByText(/trajanje/i)).toBeInTheDocument();
  });

  it('renders filter for težina (difficulty) with 5 distinct labels', () => {
    render(<ToursFilterBar labels={defaultLabels} onFilterChange={() => {}} />);
    expect(screen.getByText(/težina/i)).toBeInTheDocument();
    const difficultySelect = screen.getByRole('combobox', { name: /težina/i });
    expect(difficultySelect).toHaveTextContent('Lagano');
    expect(difficultySelect).toHaveTextContent('Umjereno');
    expect(difficultySelect).toHaveTextContent('Zahtjevno');
    expect(difficultySelect).toHaveTextContent('Zahtjevno+');
    expect(difficultySelect).toHaveTextContent('Ekspertno');
  });

  it('renders filter for cijena (price range)', () => {
    render(<ToursFilterBar labels={defaultLabels} onFilterChange={() => {}} />);
    expect(screen.getByRole('slider', { name: /cijena/i })).toBeInTheDocument();
  });

  it('does not render a dead month filter (removed)', () => {
    render(<ToursFilterBar labels={defaultLabels} onFilterChange={() => {}} />);
    expect(screen.queryByText(/mjesec/i)).not.toBeInTheDocument();
  });

  it('renders sort by: datum, cijena, popularnost', () => {
    render(<ToursFilterBar labels={defaultLabels} onFilterChange={() => {}} />);
    expect(screen.getByText(/sortiraj po/i)).toBeInTheDocument();
    const sortSelect = screen.getByRole('combobox', { name: /sortiraj po/i });
    expect(sortSelect).toBeInTheDocument();
    expect(sortSelect).toHaveTextContent(/datum/i);
    expect(sortSelect).toHaveTextContent(/cijena/i);
    expect(sortSelect).toHaveTextContent(/popularnost/i);
  });

  it('calls onFilterChange with merged state when a filter changes', () => {
    const onFilterChange = vi.fn();
    render(<ToursFilterBar labels={defaultLabels} onFilterChange={onFilterChange} />);
    const typeSelect = screen.getByRole('combobox', { name: /tip ture/i });
    fireEvent.change(typeSelect, { target: { value: 'hiking' } });
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'hiking', sort: 'popularity' })
    );
  });
});
