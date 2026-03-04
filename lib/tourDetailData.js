/**
 * Tour detail content (story, itinerary, who is for, gear, testimonial, similar).
 * Keys reference messages (tourDetail.*). In production replace with API/CMS.
 */

const DETAIL_BY_SLUG = {
  'via-ferrata-blagaj': {
    subtitleKey: 'viaFerrataSubtitle',
    experienceStoryKey: 'viaFerrataStory',
    experienceImage: '5',
    itinerary: [
      { icon: 'meet', image: '1', labelKey: 'stepMeet' },
      { icon: 'hike', image: '2', labelKey: 'stepStart' },
      { icon: 'climb', image: '3', labelKey: 'stepClimb' },
      { icon: 'lunch', image: '4', labelKey: 'stepLunch' },
      { icon: 'descent', image: '5', labelKey: 'stepReturn' },
    ],
    whoIsForIncludedKeys: ['forNature', 'forViaFerrata', 'forFitness', 'forGroup'],
    whoIsForExcludedKeys: ['notHeights', 'notKids'],
    gearKeys: ['gearBoots', 'gearBackpack', 'gearWater', 'gearCap', 'gearJacket'],
    testimonialQuoteKey: 'testimonialQuote',
    testimonialAuthorKey: 'testimonialAuthor',
    testimonialImage: '7',
    similarSlugs: ['visocica-summit-hike', 'prenj-weekend-expedition'],
    elevationProfileImage: 'elevation-blagaj',
    mapGeoJsonKey: 'mapBlagaj',
  },
  'visocica-summit-hike': {
    subtitleKey: 'visocicaSubtitle',
    experienceStoryKey: 'visocicaStory',
    experienceImage: '8',
    itinerary: [
      { icon: 'meet', image: '1', labelKey: 'stepMeet' },
      { icon: 'hike', image: '2', labelKey: 'stepStart' },
      { icon: 'summit', image: '8', labelKey: 'stepSummit' },
      { icon: 'lunch', image: '4', labelKey: 'stepLunch' },
      { icon: 'descent', image: '5', labelKey: 'stepReturn' },
    ],
    whoIsForIncludedKeys: ['forNature', 'forHiking', 'forFitness', 'forGroup'],
    whoIsForExcludedKeys: ['notKids'],
    gearKeys: ['gearBoots', 'gearBackpack', 'gearWater', 'gearCap', 'gearJacket'],
    testimonialQuoteKey: 'testimonialQuote2',
    testimonialAuthorKey: 'testimonialAuthor2',
    testimonialImage: '8',
    similarSlugs: ['via-ferrata-blagaj', 'blidinje-day-hike'],
    elevationProfileImage: 'elevation-visocica',
    mapGeoJsonKey: 'mapVisocica',
  },
  'prenj-weekend-expedition': {
    subtitleKey: 'prenjSubtitle',
    experienceStoryKey: 'prenjStory',
    experienceImage: '10',
    itinerary: [
      { icon: 'meet', image: '1', labelKey: 'stepMeet' },
      { icon: 'hike', image: '2', labelKey: 'stepStart' },
      { icon: 'camp', image: '10', labelKey: 'stepCamp' },
      { icon: 'summit', image: '8', labelKey: 'stepSummit' },
      { icon: 'descent', image: '5', labelKey: 'stepReturn' },
    ],
    whoIsForIncludedKeys: ['forNature', 'forExpedition', 'forFitness', 'forGroup'],
    whoIsForExcludedKeys: ['notBeginners'],
    gearKeys: ['gearBoots', 'gearBackpack', 'gearWater', 'gearCap', 'gearJacket', 'gearSleeping'],
    testimonialQuoteKey: 'testimonialQuote3',
    testimonialAuthorKey: 'testimonialAuthor3',
    testimonialImage: '10',
    similarSlugs: ['via-ferrata-blagaj', 'zelengora-expedition'],
    elevationProfileImage: 'elevation-prenj',
    mapGeoJsonKey: 'mapPrenj',
  },
};

const DEFAULT_DETAIL = {
  subtitleKey: 'subtitleDefault',
  experienceStoryKey: 'storyDefault',
  experienceImage: '5',
  itinerary: [
    { icon: 'meet', image: '1', labelKey: 'stepMeet' },
    { icon: 'hike', image: '2', labelKey: 'stepStart' },
    { icon: 'climb', image: '3', labelKey: 'stepClimb' },
    { icon: 'lunch', image: '4', labelKey: 'stepLunch' },
    { icon: 'descent', image: '5', labelKey: 'stepReturn' },
  ],
  whoIsForIncludedKeys: ['forNature', 'forGroup'],
  whoIsForExcludedKeys: [],
  gearKeys: ['gearBoots', 'gearBackpack', 'gearWater', 'gearCap', 'gearJacket'],
  testimonialQuoteKey: 'testimonialQuote',
  testimonialAuthorKey: 'testimonialAuthor',
  testimonialImage: '5',
  similarSlugs: [],
  elevationProfileImage: null,
  mapGeoJsonKey: null,
};

/**
 * @param {string} slug
 * @returns {typeof DEFAULT_DETAIL}
 */
export function getTourDetail(slug) {
  return DETAIL_BY_SLUG[slug] ? { ...DEFAULT_DETAIL, ...DETAIL_BY_SLUG[slug] } : { ...DEFAULT_DETAIL };
}
