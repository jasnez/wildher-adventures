'use client';

import React from 'react';
import { Card, CardImage, CardContent } from '@/components/ui';
import OptimizedImage from '@/components/OptimizedImage';
import { Icon } from '@/components/ui';
import { Link } from '@/i18n/navigation';

const BADGE_KEYS = { popular: 'popular', new: 'new', coming: 'coming' };

/**
 * Težina 1–5: prikaz kao ikone (puni krugovi).
 */
function DifficultyIcons({ level, label }) {
  const n = Math.min(5, Math.max(1, Number(level) || 1));
  return (
    <span className="flex items-center gap-0.5" title={label} data-difficulty={n}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${i <= n ? 'bg-brand-primary-green' : 'bg-neutral-300'}`}
          aria-hidden
        />
      ))}
    </span>
  );
}

/**
 * TourCard — kartica ture: slika, badge, naziv, lokacija, trajanje, težina (1–5), cijena, opis (2 reda), CTA.
 * tour: { title, location, duration, difficulty, difficultyLabel, priceFrom, description, image, badge, slug }
 */
export function TourCard({
  tour,
  ctaLabel = 'Detalji & Booking',
  badgeLabels = {},
}) {
  const {
    title,
    location,
    duration,
    difficulty,
    difficultyLabel,
    priceFrom,
    description,
    image,
    badge,
    slug,
  } = tour;

  const badgeText =
    badge && (badgeLabels[badge] ?? (BADGE_KEYS[badge] ? badge : null));

  return (
    <Card className="group rounded-2xl shadow-card hover:shadow-xl transition-all duration-700 hover:-translate-y-1 overflow-hidden">
      <CardImage className="relative">
        <OptimizedImage
          name={image}
          alt={title}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {badgeText && (
          <span
            className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-small font-semibold text-wildher-text shadow-sm"
            data-badge={badge}
          >
            {badgeText}
          </span>
        )}
      </CardImage>
      <CardContent>
        <p className="text-small text-wildher-text-muted mb-1">{location}</p>
        <h3 className="text-h3 font-semibold text-wildher-text mb-2">
          {title}
        </h3>
        <div className="flex flex-wrap gap-3 text-small text-wildher-text-muted mb-2">
          <span className="flex items-center gap-1">
            <Icon name="calendar" size={16} />
            {duration}
          </span>
          <span className="flex items-center gap-1.5" aria-label={difficultyLabel}>
            <DifficultyIcons level={difficulty} label={difficultyLabel} />
            <span className="text-small text-wildher-text-muted">{difficultyLabel}</span>
          </span>
        </div>
        <p className="text-small text-wildher-text-muted mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="font-semibold text-brand-primary-green">
            Od {priceFrom}€
          </span>
          <Link
            href={slug ? `/ture/${slug}` : '/ture'}
            className="text-small font-semibold text-brand-primary-green hover:underline"
          >
            {ctaLabel} →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default TourCard;
