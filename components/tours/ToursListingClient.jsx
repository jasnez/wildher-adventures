'use client';

import React, { useState, useCallback } from 'react';
import { ToursFilterBar } from '@/components/tours/ToursFilterBar';
import { TourCard } from '@/components/tours/TourCard';
import { filterAndSortTours } from '@/lib/toursFilter';

const DEFAULT_FILTERS = {
  type: '',
  duration: '',
  difficulty: '',
  priceMin: 0,
  priceMax: 500,
  month: '',
  sort: 'popularity',
};

/**
 * Client wrapper: filter bar + grid. Holds filter state, filters/sorts tours, passes onFilterChange to the bar.
 */
export function ToursListingClient({ tours = [], labels = {}, ctaLabel = 'Detalji & Booking', badgeLabels = {} }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);
  const filteredTours = filterAndSortTours(tours, filters);

  return (
    <>
      <ToursFilterBar labels={labels} onFilterChange={handleFilterChange} />
      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                ctaLabel={ctaLabel}
                badgeLabels={badgeLabels}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ToursListingClient;
