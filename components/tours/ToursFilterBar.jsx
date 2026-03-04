'use client';

import React, { useState } from 'react';

/**
 * Filter bar: Tip ture, Trajanje, Težina, Cijena (range), Mjesec/datum, Sortiraj po (datum, cijena, popularnost).
 */
export function ToursFilterBar({ labels, onFilterChange }) {
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500);
  const [month, setMonth] = useState('');
  const [sort, setSort] = useState('popularity');

  const notify = () => onFilterChange?.({ type, duration, difficulty, priceMin, priceMax, month, sort });

  return (
    <div className="bg-white border-b border-neutral-200 py-4 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          {/* Tip ture */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter-type" className="text-small font-medium text-wildher-text whitespace-nowrap">
              {labels.filterType}
            </label>
            <select
              id="filter-type"
              value={type}
              onChange={(e) => { setType(e.target.value); notify(); }}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-small bg-white min-w-[120px]"
              aria-label={labels.filterType}
            >
              <option value="">—</option>
              <option value="hiking">{labels.typeHiking ?? 'Hiking'}</option>
              <option value="via_ferrata">{labels.typeViaFerrata ?? 'Via ferrata'}</option>
              <option value="canyoning">{labels.typeCanyoning ?? 'Kanjoning'}</option>
              <option value="retreat">{labels.typeRetreat ?? 'Retreat'}</option>
            </select>
          </div>

          {/* Trajanje */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter-duration" className="text-small font-medium text-wildher-text whitespace-nowrap">
              {labels.filterDuration}
            </label>
            <select
              id="filter-duration"
              value={duration}
              onChange={(e) => { setDuration(e.target.value); notify(); }}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-small bg-white min-w-[120px]"
              aria-label={labels.filterDuration}
            >
              <option value="">—</option>
              <option value="1day">{labels.duration1day ?? '1 dan'}</option>
              <option value="weekend">{labels.durationWeekend ?? 'Vikend'}</option>
              <option value="3to5">{labels.duration3to5 ?? '3–5 dana'}</option>
              <option value="5plus">{labels.duration5plus ?? '5+ dana'}</option>
            </select>
          </div>

          {/* Težina */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter-difficulty" className="text-small font-medium text-wildher-text whitespace-nowrap">
              {labels.filterDifficulty}
            </label>
            <select
              id="filter-difficulty"
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); notify(); }}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-small bg-white min-w-[120px]"
              aria-label={labels.filterDifficulty}
            >
              <option value="">—</option>
              <option value="1">{labels.difficultyEasy ?? 'Lagano'}</option>
              <option value="2">{labels.difficultyModerate ?? 'Umjereno'}</option>
              <option value="3">{labels.difficultyModerate ?? 'Umjereno'}</option>
              <option value="4">{labels.difficultyChallenging ?? 'Zahtjevno'}</option>
              <option value="5">{labels.difficultyChallenging ?? 'Zahtjevno'}</option>
            </select>
          </div>

          {/* Cijena */}
          <div className="flex items-center gap-2">
            <span className="text-small font-medium text-wildher-text whitespace-nowrap">
              {labels.filterPrice}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="500"
                value={priceMax}
                onChange={(e) => { setPriceMax(Number(e.target.value)); notify(); }}
                className="w-24"
                aria-label={`${labels.filterPrice} do ${priceMax}€`}
              />
              <span className="text-small text-wildher-text-muted">{priceMax}€</span>
            </div>
          </div>

          {/* Mjesec / datum */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter-month" className="text-small font-medium text-wildher-text whitespace-nowrap">
              {labels.filterMonth}
            </label>
            <input
              id="filter-month"
              type="month"
              value={month}
              onChange={(e) => { setMonth(e.target.value); notify(); }}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-small bg-white"
              aria-label={labels.filterMonth}
            />
          </div>

          {/* Sortiraj po */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-small font-medium text-wildher-text whitespace-nowrap">
              {labels.sortBy}
            </span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); notify(); }}
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
