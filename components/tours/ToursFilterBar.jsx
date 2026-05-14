'use client';

import React, { useState } from 'react';
import { DEFAULT_FILTERS, PRICE_MIN, PRICE_MAX } from '@/lib/filterDefaults';

export function ToursFilterBar({ labels, onFilterChange }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const update = (patch) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    onFilterChange?.(next);
  };

  return (
    <div className="bg-white border-b border-neutral-200 py-4 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <label htmlFor="filter-type" className="text-small font-medium text-wildher-text whitespace-nowrap">
              {labels.filterType}
            </label>
            <select
              id="filter-type"
              value={filters.type}
              onChange={(e) => update({ type: e.target.value })}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-small bg-white min-w-[120px]"
              aria-label={labels.filterType}
            >
              <option value="">—</option>
              <option value="hiking">{labels.typeHiking ?? 'Hiking'}</option>
              <option value="via_ferrata">{labels.typeViaFerrata ?? 'Via ferrata'}</option>
              <option value="canyoning">{labels.typeCanyoning ?? 'Canyoning'}</option>
              <option value="retreat">{labels.typeRetreat ?? 'Retreat'}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter-duration" className="text-small font-medium text-wildher-text whitespace-nowrap">
              {labels.filterDuration}
            </label>
            <select
              id="filter-duration"
              value={filters.duration}
              onChange={(e) => update({ duration: e.target.value })}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-small bg-white min-w-[120px]"
              aria-label={labels.filterDuration}
            >
              <option value="">—</option>
              <option value="1day">{labels.duration1day ?? '1 day'}</option>
              <option value="weekend">{labels.durationWeekend ?? 'Weekend'}</option>
              <option value="3to5">{labels.duration3to5 ?? '3–5 days'}</option>
              <option value="5plus">{labels.duration5plus ?? '5+ days'}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter-difficulty" className="text-small font-medium text-wildher-text whitespace-nowrap">
              {labels.filterDifficulty}
            </label>
            <select
              id="filter-difficulty"
              value={filters.difficulty}
              onChange={(e) => update({ difficulty: e.target.value })}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-small bg-white min-w-[120px]"
              aria-label={labels.filterDifficulty}
            >
              <option value="">—</option>
              <option value="1">{labels.difficultyEasy ?? 'Easy'}</option>
              <option value="2">{labels.difficultyModerate ?? 'Moderate'}</option>
              <option value="3">{labels.difficultyChallenging ?? 'Challenging'}</option>
              <option value="4">{labels.difficultyDemanding ?? 'Demanding'}</option>
              <option value="5">{labels.difficultyExpert ?? 'Expert'}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-small font-medium text-wildher-text whitespace-nowrap">
              {labels.filterPrice}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={filters.priceMax}
                onChange={(e) => update({ priceMax: Number(e.target.value) })}
                className="w-24"
                aria-label={`${labels.filterPrice} ${filters.priceMax}€`}
              />
              <span className="text-small text-wildher-text-muted">{filters.priceMax}€</span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-small font-medium text-wildher-text whitespace-nowrap">
              {labels.sortBy}
            </span>
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-small bg-white min-w-[120px]"
              aria-label={labels.sortBy}
            >
              <option value="date">{labels.sortDate}</option>
              <option value="price">{labels.sortPrice}</option>
              <option value="popularity">{labels.sortPopularity}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToursFilterBar;
