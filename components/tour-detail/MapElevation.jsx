import React from 'react';

export function MapElevation({ title, placeholder, showDetailsLabel }) {
  return (
    <section className="py-12 md:py-16 px-4" aria-labelledby="map-elevation-heading">
      <h2 id="map-elevation-heading" className="font-display text-2xl md:text-3xl font-bold text-wildher-text mb-6 text-center">
        {title}
      </h2>
      <div className="mx-auto max-w-6xl rounded-card overflow-hidden bg-neutral-100 border border-neutral-200 min-h-[320px] flex flex-col items-center justify-center gap-4 p-6">
        {placeholder && <p className="text-wildher-text-muted">{placeholder}</p>}
        {showDetailsLabel && (
          <button type="button" className="text-brand-primary-green font-semibold hover:underline">
            {showDetailsLabel}
          </button>
        )}
      </div>
    </section>
  );
}
