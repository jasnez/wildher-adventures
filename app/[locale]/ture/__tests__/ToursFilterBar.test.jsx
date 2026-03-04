import React from 'react';
import { render, screen } from '@testing-library/react';
import { ToursFilterBar } from '@/components/tours/ToursFilterBar';

const defaultLabels = {
  filterType: 'Tip ture',
  filterDuration: 'Trajanje',
  filterDifficulty: 'Težina',
  filterPrice: 'Cijena',
  filterMonth: 'Mjesec / datum',
  sortBy: 'Sortiraj po',
  sortDate: 'Datum',
  sortPrice: 'Cijena',
  sortPopularity: 'Popularnost',
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

  it('renders filter for težina (difficulty)', () => {
    render(<ToursFilterBar labels={defaultLabels} onFilterChange={() => {}} />);
    expect(screen.getByText(/težina/i)).toBeInTheDocument();
  });

  it('renders filter for cijena (price range)', () => {
    render(<ToursFilterBar labels={defaultLabels} onFilterChange={() => {}} />);
    expect(screen.getByRole('slider', { name: /cijena/i })).toBeInTheDocument();
  });

  it('renders filter for mjesec / datum', () => {
    render(<ToursFilterBar labels={defaultLabels} onFilterChange={() => {}} />);
    expect(screen.getByText(/mjesec.*datum|datum.*mjesec/i)).toBeInTheDocument();
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
});
