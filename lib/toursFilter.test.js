import { describe, it, expect } from 'vitest';
import { filterAndSortTours } from './toursFilter';

const mockTours = [
  { id: '1', type: 'via_ferrata', durationCategory: '1day', difficulty: 2, priceFrom: 120, sortOrder: 1 },
  { id: '2', type: 'hiking', durationCategory: '1day', difficulty: 2, priceFrom: 95, sortOrder: 2 },
  { id: '3', type: 'hiking', durationCategory: 'weekend', difficulty: 4, priceFrom: 320, sortOrder: 3 },
  { id: '4', type: 'hiking', durationCategory: '1day', difficulty: 1, priceFrom: 75, sortOrder: 4 },
  { id: '5', type: 'hiking', durationCategory: '3to5', difficulty: 4, priceFrom: 450, sortOrder: 5 },
  { id: '6', type: 'retreat', durationCategory: 'weekend', difficulty: 1, priceFrom: 280, sortOrder: 6 },
];

const defaultFilters = {
  type: '',
  duration: '',
  difficulty: '',
  priceMin: 0,
  priceMax: 500,
  month: '',
  sort: 'popularity',
};

describe('filterAndSortTours', () => {
  it('returns all tours when filters are empty/default', () => {
    const result = filterAndSortTours(mockTours, defaultFilters);
    expect(result).toHaveLength(6);
  });

  it('filters by type when type is set', () => {
    const result = filterAndSortTours(mockTours, { ...defaultFilters, type: 'hiking' });
    expect(result).toHaveLength(4);
    expect(result.every((t) => t.type === 'hiking')).toBe(true);
  });

  it('filters by durationCategory when duration is set', () => {
    const result = filterAndSortTours(mockTours, { ...defaultFilters, duration: '1day' });
    expect(result).toHaveLength(3);
    expect(result.every((t) => t.durationCategory === '1day')).toBe(true);
  });

  it('filters by max difficulty when difficulty is set (tours with difficulty <= selected)', () => {
    const result = filterAndSortTours(mockTours, { ...defaultFilters, difficulty: '2' });
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.every((t) => t.difficulty <= 2)).toBe(true);
  });

  it('filters by priceMax (only tours with priceFrom <= priceMax)', () => {
    const result = filterAndSortTours(mockTours, { ...defaultFilters, priceMax: 100 });
    expect(result.every((t) => t.priceFrom <= 100)).toBe(true);
    expect(result.map((t) => t.id)).toContain('2');
    expect(result.map((t) => t.id)).toContain('4');
  });

  it('when priceMax is 0, shows no tours (filter is applied)', () => {
    const result = filterAndSortTours(mockTours, { ...defaultFilters, priceMax: 0 });
    expect(result).toHaveLength(0);
  });

  it('sorts by price ascending when sort is price', () => {
    const result = filterAndSortTours(mockTours, { ...defaultFilters, sort: 'price' });
    expect(result).toHaveLength(6);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].priceFrom >= result[i - 1].priceFrom).toBe(true);
    }
  });

  it('sorts by popularity (sortOrder) when sort is popularity', () => {
    const result = filterAndSortTours(mockTours, { ...defaultFilters, sort: 'popularity' });
    expect(result).toHaveLength(6);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].sortOrder >= result[i - 1].sortOrder).toBe(true);
    }
  });

  it('sort by date and sort by popularity produce different order', () => {
    const byDate = filterAndSortTours(mockTours, { ...defaultFilters, sort: 'date' });
    const byPopularity = filterAndSortTours(mockTours, { ...defaultFilters, sort: 'popularity' });
    expect(byDate).toHaveLength(6);
    expect(byPopularity).toHaveLength(6);
    expect(byDate[0].id).not.toBe(byPopularity[0].id);
    expect(byDate[0].sortOrder).toBe(6);
    expect(byPopularity[0].sortOrder).toBe(1);
  });

  it('applies multiple filters together', () => {
    const result = filterAndSortTours(mockTours, {
      ...defaultFilters,
      type: 'hiking',
      duration: '1day',
      priceMax: 100,
    });
    expect(result.every((t) => t.type === 'hiking' && t.durationCategory === '1day' && t.priceFrom <= 100)).toBe(true);
    expect(result.map((t) => t.id)).toContain('2');
    expect(result.map((t) => t.id)).toContain('4');
  });
});
