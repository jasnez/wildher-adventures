import React from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import { Link } from '@/i18n/navigation';

export function TourDetailHero({ title, subtitle, location, duration, difficultyLabel, maxGroup, imageName, bookCta, bookHref }) {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-end">
      <OptimizedImage
        name={imageName}
        alt={title}
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 flex flex-col justify-end px-4 pb-12 pt-24 md:pb-16">
        <div className="mx-auto w-full max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{title}</h1>
          <p className="text-lg md:text-xl text-white/95 mb-6">{subtitle}</p>
          <div className="flex flex-wrap gap-4 text-sm text-white/90 mb-6">
            {location && <span>📍 {location}</span>}
            {duration && <span>⏱ {duration}</span>}
            {difficultyLabel && <span>🥾 Težina: {difficultyLabel}</span>}
            {maxGroup != null && <span>👩‍👩‍👧 max {maxGroup} žena</span>}
          </div>
          <Link
            href={bookHref}
            className="inline-flex items-center justify-center rounded-lg bg-brand-primary-green px-6 py-3 font-semibold text-white hover:bg-brand-primary-green/90 transition-colors"
          >
            {bookCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
