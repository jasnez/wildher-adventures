'use client';

import React, { useState, useCallback } from 'react';
import { ToursFilterBar } from '@/components/tours/ToursFilterBar';
import { TourCard } from '@/components/tours/TourCard';
import { filterAndSortTours } from '@/lib/toursFilter';
import { DEFAULT_FILTERS } from '@/lib/filterDefaults';

export function ToursListingClient({
  tours = [],
  labels = {},
  ctaLabel,
  priceFromLabel,
  emptyStateLabel,
  badgeLabels = {},
}) {
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
          {filteredTours.length === 0 ? (
            <p
              role="status"
              className="text-center text-body text-wildher-text-muted py-16"
            >
              {emptyStateLabel}
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  ctaLabel={ctaLabel}
                  priceFromLabel={priceFromLabel}
                  badgeLabels={badgeLabels}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default ToursListingClient;
