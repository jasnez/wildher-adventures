import React from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import {Icon} from '@/components/ui';
import {Link} from '@/i18n/navigation';

/**
 * HomePopularTours — grid kartica za sekciju "Popularne ture" na homepage-u.
 * Prednja strana zadržava originalni sadržaj i visinu kartica,
 * stražnja pruža više detalja o turi sa naglaskom na destinaciju.
 */
export function HomePopularTours({t, tours}) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {tours.map((tour, i) => (
        <Link
          key={i}
          href="/ture"
          className="group/card block rounded-2xl shadow-card hover:shadow-xl transition-shadow duration-700"
        >
          <div
            data-testid={`popular-tour-card-inner-${i}`}
            className="relative h-full w-full min-h-[420px] rounded-2xl overflow-hidden [transform-style:preserve-3d] transition-[transform] duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/card:[transform:rotateY(180deg)]"
          >
            {/* Prednja strana — identičan sadržaj kao stare kartice */}
            <div
              data-testid={`popular-tour-card-front-${i}`}
              className="absolute inset-0 flex flex-col bg-white [backface-visibility:hidden] [transform:rotateY(0deg)]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <OptimizedImage
                  name={tour.image}
                  alt={t(tour.titleKey)}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-4 md:p-5">
                <p className="text-small text-wildher-text-muted mb-1">
                  {t(tour.locationKey)}
                </p>
                <h3 className="text-h3 font-semibold text-wildher-text mb-3">
                  {t(tour.titleKey)}
                </h3>
                <div className="flex flex-wrap gap-3 text-small text-wildher-text-muted mb-3">
                  <span className="flex items-center gap-1">
                    <Icon name="calendar" size={16} />
                    {t(tour.durationKey)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="mountain" size={16} />
                    {t(tour.difficultyKey)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="users" size={16} />
                    {t(tour.groupKey)}
                  </span>
                </div>
                <p className="text-small text-wildher-text-muted mb-4 line-clamp-2">
                  {t(tour.descKey)}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-semibold text-brand-primary-green">
                    Od {t(tour.priceKey)}€
                  </span>
                  <span className="text-small font-semibold text-brand-primary-green">
                    {t('learnMore')} →
                  </span>
                </div>
              </div>
            </div>

            {/* Stražnja strana — detalji o turi, fokus na destinaciju */}
            <div
              data-testid={`popular-tour-card-back-${i}`}
              className="absolute inset-0 flex flex-col justify-center rounded-2xl bg-[#e3ece4] p-6 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]"
            >
              <p className="text-small font-semibold uppercase tracking-wide text-brand-primary-green">
                {t(tour.locationKey)}
              </p>
              <h3 className="font-display text-h2 font-semibold text-wildher-text mt-1 mb-3">
                {t(tour.titleKey)}
              </h3>
              <p className="text-small text-wildher-text-muted line-clamp-4">
                {t(tour.descKey)}
              </p>
              <p className="mt-4 text-small font-semibold text-brand-primary-green">
                {t('learnMore')} →
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default HomePopularTours;

