import React from 'react';
import { TourCard } from '@/components/tours/TourCard';

export function SimilarAdventures({ title, tours, ctaDetailsLabel }) {
  if (!tours?.length) return null;
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-wildher-text mb-8">{title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <TourCard
              key={tour.slug}
              tour={tour}
              ctaLabel={ctaDetailsLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
