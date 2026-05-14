/**
 * Single source of truth for tour filter defaults.
 * Consumed by both ToursListingClient and ToursFilterBar.
 */

export const PRICE_MIN = 0;
export const PRICE_MAX = 500;

export const DEFAULT_FILTERS = Object.freeze({
  type: '',
  duration: '',
  difficulty: '',
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
  sort: 'popularity',
});
