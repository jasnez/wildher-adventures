'use client';

import React, { useState, useEffect } from 'react';
import { DEFAULT_FILTERS, PRICE_MIN, PRICE_MAX } from '@/lib/filterDefaults';

function countActiveFilters(filters) {
  let n = 0;
  if (filters.type) n += 1;
  if (filters.duration) n += 1;
  if (filters.difficulty) n += 1;
  if (filters.priceMax !== PRICE_MAX) n += 1;
  return n;
}

export function ToursFilterBar({ labels, onFilterChange }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const update = (patch) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    onFilterChange?.(next);
  };

  const reset = () => {
    setFilters(DEFAULT_FILTERS);
    onFilterChange?.(DEFAULT_FILTERS);
  };

  const activeCount = countActiveFilters(filters);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (isSheetOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [isSheetOpen]);

  // Close sheet on Escape.
  useEffect(() => {
    if (!isSheetOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsSheetOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isSheetOpen]);

  // One container, two layouts:
  //   - default (mobile, sheet closed): `hidden` so nothing shows
  //   - sheet open (mobile): fixed bottom sheet
  //   - lg+: inline filter row regardless of sheet state
  const wrapperClass = isSheetOpen
    ? 'fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white px-4 pt-5 pb-6 shadow-2xl lg:static lg:max-h-none lg:overflow-visible lg:rounded-none lg:px-4 lg:py-4 lg:pt-4 lg:pb-4 lg:shadow-none lg:bg-transparent'
    : 'hidden lg:block px-4 py-4';

  return (
    <div className="bg-white border-b border-neutral-200">
      {/* Mobile trigger row: single "Filteri (N)" button. Sort lives inside the sheet. */}
      <div className="flex lg:hidden items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="inline-flex items-center gap-2 rounded-button border border-neutral-300 bg-white px-4 py-2 text-small font-semibold text-wildher-text min-h-[44px]"
          aria-expanded={isSheetOpen}
          aria-controls="filters-sheet"
        >
          {labels.filtersButton ?? 'Filteri'}
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-brand-primary-green text-white text-caption font-semibold">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile backdrop */}
      {isSheetOpen && (
        <div
          aria-hidden
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSheetOpen(false)}
        />
      )}

      {/* Filter controls — sheet on mobile (when open), inline row on desktop */}
      <div
        id="filters-sheet"
        className={wrapperClass}
        role={isSheetOpen ? 'dialog' : undefined}
        aria-modal={isSheetOpen || undefined}
      >
        {/* Sheet header (mobile only) */}
        <div className="flex items-center justify-between mb-5 lg:hidden">
          <h2 className="text-h3 font-semibold text-wildher-text">
            {labels.filtersButton ?? 'Filteri'}
          </h2>
          <button
            type="button"
            onClick={() => setIsSheetOpen(false)}
            aria-label={labels.closeFilters ?? 'Zatvori'}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-wildher-text text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-6">
            <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:gap-2">
              <label htmlFor="filter-type" className="text-small font-medium text-wildher-text whitespace-nowrap">
                {labels.filterType}
              </label>
              <select
                id="filter-type"
                value={filters.type}
                onChange={(e) => update({ type: e.target.value })}
                className="rounded-button border border-neutral-300 px-3 py-2 text-small bg-white min-h-[44px] lg:min-h-0 lg:min-w-[140px]"
                aria-label={labels.filterType}
              >
                <option value="">—</option>
                <option value="hiking">{labels.typeHiking ?? 'Hiking'}</option>
                <option value="via_ferrata">{labels.typeViaFerrata ?? 'Via ferrata'}</option>
                <option value="canyoning">{labels.typeCanyoning ?? 'Canyoning'}</option>
                <option value="retreat">{labels.typeRetreat ?? 'Retreat'}</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:gap-2">
              <label htmlFor="filter-duration" className="text-small font-medium text-wildher-text whitespace-nowrap">
                {labels.filterDuration}
              </label>
              <select
                id="filter-duration"
                value={filters.duration}
                onChange={(e) => update({ duration: e.target.value })}
                className="rounded-button border border-neutral-300 px-3 py-2 text-small bg-white min-h-[44px] lg:min-h-0 lg:min-w-[140px]"
                aria-label={labels.filterDuration}
              >
                <option value="">—</option>
                <option value="1day">{labels.duration1day ?? '1 day'}</option>
                <option value="weekend">{labels.durationWeekend ?? 'Weekend'}</option>
                <option value="3to5">{labels.duration3to5 ?? '3–5 days'}</option>
                <option value="5plus">{labels.duration5plus ?? '5+ days'}</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:gap-2">
              <label htmlFor="filter-difficulty" className="text-small font-medium text-wildher-text whitespace-nowrap">
                {labels.filterDifficulty}
              </label>
              <select
                id="filter-difficulty"
                value={filters.difficulty}
                onChange={(e) => update({ difficulty: e.target.value })}
                className="rounded-button border border-neutral-300 px-3 py-2 text-small bg-white min-h-[44px] lg:min-h-0 lg:min-w-[140px]"
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

            <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:gap-2">
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
                  className="w-full lg:w-32"
                  aria-label={labels.filterPrice}
                  aria-valuetext={`${filters.priceMax}€`}
                />
                <span className="text-small text-wildher-text-muted shrink-0 w-12 text-right">
                  {filters.priceMax}€
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:gap-2 lg:ml-auto">
              <label htmlFor="filter-sort" className="text-small font-medium text-wildher-text whitespace-nowrap">
                {labels.sortBy}
              </label>
              <select
                id="filter-sort"
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value })}
                className="rounded-button border border-neutral-300 px-3 py-2 text-small bg-white min-h-[44px] lg:min-h-0 lg:min-w-[140px]"
                aria-label={labels.sortBy}
              >
                <option value="date">{labels.sortDate}</option>
                <option value="price">{labels.sortPrice}</option>
                <option value="popularity">{labels.sortPopularity}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sheet actions (mobile only) */}
        <div className="flex flex-col gap-3 mt-6 lg:hidden">
          <button
            type="button"
            onClick={() => setIsSheetOpen(false)}
            className="rounded-button bg-brand-primary-green hover:bg-brand-primary-green-hover transition-colors text-white px-4 py-3 font-semibold min-h-[48px]"
          >
            {labels.applyFilters ?? 'Prikaži rezultate'}
          </button>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={reset}
              className="text-small font-semibold text-brand-primary-green min-h-[44px]"
            >
              {labels.clearFilters ?? 'Obriši filtere'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ToursFilterBar;
