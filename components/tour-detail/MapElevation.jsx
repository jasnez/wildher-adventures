import React from 'react';

export function MapElevation({ title, showDetailsLabel }) {
  return (
    <section className="py-12 md:py-16 px-4" aria-labelledby="map-elevation-heading">
      <h2 id="map-elevation-heading" className="font-display text-2xl md:text-3xl font-bold text-wildher-text mb-6 text-center">
        {title}
      </h2>
      <div className="mx-auto max-w-6xl rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 min-h-[320px] flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-wildher-text-muted">Mapa i profil uspona — u izradi</p>
        {showDetailsLabel && (
          <button type="button" className="text-brand-primary-green font-semibold hover:underline">
            {showDetailsLabel}
          </button>
        )}
      </div>
    </section>
  );
}
