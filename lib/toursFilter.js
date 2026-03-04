/**
 * Pure filter/sort for tours. Used by ToursListingClient.
 * @param {Array} tours - list of tour objects (must have type, durationCategory, difficulty, priceFrom, sortOrder)
 * @param {Object} filters - { type, duration, difficulty, priceMin, priceMax, month, sort }
 */
export function filterAndSortTours(tours, filters) {
  if (!Array.isArray(tours)) return [];
  const { type, duration, difficulty, priceMin, priceMax, month, sort } = filters || {};

  let result = [...tours];

  if (type) {
    result = result.filter((t) => t.type === type);
  }
  if (duration) {
    result = result.filter((t) => t.durationCategory === duration);
  }
  if (difficulty) {
    const maxDiff = Number(difficulty);
    if (!Number.isNaN(maxDiff)) {
      result = result.filter((t) => t.difficulty <= maxDiff);
    }
  }
  const maxPrice = Number(priceMax);
  if (!Number.isNaN(maxPrice)) {
    result = result.filter((t) => t.priceFrom <= maxPrice);
  }
  const minPrice = Number(priceMin);
  if (!Number.isNaN(minPrice) && minPrice > 0) {
    result = result.filter((t) => t.priceFrom >= minPrice);
  }
  // month: could filter by tour date if we had dates; skip for now

  if (sort === 'price') {
    result.sort((a, b) => (a.priceFrom ?? 0) - (b.priceFrom ?? 0));
  } else if (sort === 'date') {
    // Descending: higher sortOrder first (stand-in for "newest" until we have tour dates)
    result.sort((a, b) => (b.sortOrder ?? 0) - (a.sortOrder ?? 0));
  } else {
    // popularity: ascending by sortOrder (featured / most popular first)
    result.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  return result;
}
