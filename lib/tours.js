/**
 * Tour types and duration categories for filtering.
 * type: hiking | via_ferrata | canyoning | retreat
 * durationCategory: 1day | weekend | 3to5 | 5plus
 * difficulty: 1 (lagano) .. 5 (zahtjevno)
 * badge: null | 'popular' | 'new' | 'coming'
 */

export const TOUR_TYPES = ['hiking', 'via_ferrata', 'canyoning', 'retreat'];
export const DURATION_CATEGORIES = ['1day', 'weekend', '3to5', '5plus'];
export const SORT_OPTIONS = ['date', 'price', 'popularity'];

/** All tours (mock data). In production replace with API/CMS. */
export const TOURS = [
  {
    id: '1',
    slug: 'via-ferrata-blagaj',
    titleKey: 'home.tour1Title',
    locationKey: 'home.tour1Location',
    durationKey: 'home.tour1Duration',
    durationCategory: '1day',
    difficulty: 2,
    difficultyKey: 'home.tour1Difficulty',
    type: 'via_ferrata',
    priceFrom: 120,
    descKey: 'home.tour1Desc',
    image: '5',
    badge: 'popular',
    sortOrder: 1,
  },
  {
    id: '2',
    slug: 'visocica-summit-hike',
    titleKey: 'home.tour2Title',
    locationKey: 'home.tour2Location',
    durationKey: 'home.tour2Duration',
    durationCategory: '1day',
    difficulty: 2,
    difficultyKey: 'home.tour2Difficulty',
    type: 'hiking',
    priceFrom: 95,
    descKey: 'home.tour2Desc',
    image: '8',
    badge: null,
    sortOrder: 2,
  },
  {
    id: '3',
    slug: 'prenj-weekend-expedition',
    titleKey: 'home.tour3Title',
    locationKey: 'home.tour3Location',
    durationKey: 'home.tour3Duration',
    durationCategory: 'weekend',
    difficulty: 4,
    difficultyKey: 'home.tour3Difficulty',
    type: 'hiking',
    priceFrom: 320,
    descKey: 'home.tour3Desc',
    image: '10',
    badge: null,
    sortOrder: 3,
  },
  {
    id: '4',
    slug: 'blidinje-day-hike',
    titleKey: 'home.tour1Title',
    locationKey: 'dest6Name',
    durationKey: 'home.tour1Duration',
    durationCategory: '1day',
    difficulty: 1,
    difficultyKey: 'tours.difficultyEasy',
    type: 'hiking',
    priceFrom: 75,
    descKey: 'home.tour1Desc',
    image: '11',
    badge: 'new',
    sortOrder: 4,
  },
  {
    id: '5',
    slug: 'zelengora-expedition',
    titleKey: 'dest5Name',
    locationKey: 'dest5Name',
    durationKey: 'home.tour3Duration',
    durationCategory: '3to5',
    difficulty: 4,
    difficultyKey: 'home.tour3Difficulty',
    type: 'hiking',
    priceFrom: 450,
    descKey: 'home.tour3Desc',
    image: '15',
    badge: null,
    sortOrder: 5,
  },
  {
    id: '6',
    slug: 'mindfulness-retreat',
    titleKey: 'home.tour1Title',
    locationKey: 'home.tour1Location',
    durationKey: 'home.tour3Duration',
    durationCategory: 'weekend',
    difficulty: 1,
    difficultyKey: 'tours.difficultyEasy',
    type: 'retreat',
    priceFrom: 280,
    descKey: 'about.communityP2',
    image: '6',
    badge: 'coming',
    sortOrder: 6,
  },
];

/**
 * Get all tours (optionally filter by category).
 * @param {string} [durationCategory] - 1day | weekend | 3to5 | 5plus
 */
export function getTours(durationCategory = null) {
  let list = [...TOURS];
  if (durationCategory) {
    list = list.filter((t) => t.durationCategory === durationCategory);
  }
  return list.sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Category slug -> durationCategory or type filter */
export const CATEGORY_TO_DURATION = {
  jednodnevne: '1day',
  vikend: 'weekend',
  ekspedicije: ['3to5', '5plus'],
  retreat: null,
};

/**
 * Get tours for a category subpage.
 * retreat = filter by type 'retreat'; ekspedicije = 3to5 or 5plus; others = single durationCategory.
 */
export function getToursByCategory(categorySlug) {
  if (categorySlug === 'retreat') {
    return getTours().filter((t) => t.type === 'retreat');
  }
  const duration = CATEGORY_TO_DURATION[categorySlug];
  if (Array.isArray(duration)) {
    return getTours().filter((t) => duration.includes(t.durationCategory));
  }
  return duration ? getTours(duration) : getTours();
}
