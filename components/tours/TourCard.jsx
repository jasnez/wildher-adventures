'use client';

import React from 'react';
import { Card, CardImage, CardContent } from '@/components/ui';
import OptimizedImage from '@/components/OptimizedImage';
import { Icon } from '@/components/ui';
import { Link } from '@/i18n/navigation';

const BADGE_KEYS = { popular: 'popular', new: 'new', coming: 'coming', inaugural: 'inaugural' };

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

function RatingPill({ rating, count, ariaLabel }) {
  if (rating == null || !count) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-caption font-semibold text-wildher-text shadow-sm"
      aria-label={ariaLabel}
    >
      <span className="text-brand-gold-beige" aria-hidden="true">
        ★
      </span>
      <span>{rating.toFixed(1)}</span>
      <span className="text-wildher-text-muted">({count})</span>
    </span>
  );
}

export function TourCard({
  tour,
  ctaLabel,
  priceFromLabel,
  soloFriendlyLabel,
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
    soloFriendly,
    averageRating,
    reviewCount,
  } = tour;

  const badgeText =
    badge && (badgeLabels[badge] ?? (BADGE_KEYS[badge] ? badge : null));

  return (
    <Card className="group rounded-radius-card-lg shadow-card hover:shadow-xl focus-within:shadow-xl transition-all duration-300 hover:-translate-y-1 focus-within:-translate-y-1 overflow-hidden">
      <CardImage className="relative">
        <OptimizedImage
          {...(typeof image === 'string' && /^https?:\/\//.test(image)
            ? { src: image }
            : { name: image })}
          alt={title}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex flex-col gap-1.5 items-start">
            {badgeText && (
              <span
                className="rounded-full bg-white/95 px-3 py-1 text-small font-semibold text-wildher-text shadow-sm"
                data-badge={badge}
              >
                {badgeText}
              </span>
            )}
            {soloFriendly && soloFriendlyLabel && (
              <span className="rounded-full bg-brand-primary-green/95 text-white px-3 py-1 text-caption font-semibold shadow-sm">
                {soloFriendlyLabel}
              </span>
            )}
          </div>
          {averageRating != null && reviewCount > 0 && (
            <RatingPill
              rating={averageRating}
              count={reviewCount}
              ariaLabel={`${averageRating} stars, ${reviewCount} reviews`}
            />
          )}
        </div>
      </CardImage>
      <CardContent>
        {location && (
          <p className="text-small text-wildher-text-muted mb-1">{location}</p>
        )}
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
            {priceFromLabel} {priceFrom}€
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
