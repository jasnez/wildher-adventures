import type { SchemaTypeDefinition } from 'sanity';

import { localeString, localeText, localeRichText } from './objects/localeString';
import { guide } from './guide';
import { destination } from './destination';
import { tour } from './tour';
import { story } from './story';
import { testimonial } from './testimonial';
import { faq } from './faq';
import { homePage } from './pages/homePage';
import { aboutPage } from './pages/aboutPage';
import {
  safetyPage,
  termsPage,
  privacyPage,
  contactPage,
  giftVoucherPage,
} from './pages/safetyPage';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  localeString,
  localeText,
  localeRichText,
  // Documents
  guide,
  destination,
  tour,
  story,
  testimonial,
  faq,
  // Singletons
  homePage,
  aboutPage,
  safetyPage,
  termsPage,
  privacyPage,
  contactPage,
  giftVoucherPage,
];

export const singletonTypes = new Set([
  'homePage',
  'aboutPage',
  'safetyPage',
  'termsPage',
  'privacyPage',
  'contactPage',
  'giftVoucherPage',
]);
