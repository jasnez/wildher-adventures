import { z } from 'zod';
import { isSanityConfigured } from '@/sanity/env';
import { sanityClient } from './client';
import {
  allToursQuery,
  tourBySlugQuery,
  featuredToursQuery,
  allGuidesQuery,
  guideBySlugQuery,
  allDestinationsQuery,
  destinationBySlugQuery,
  allStoriesQuery,
  storyBySlugQuery,
  allFaqsQuery,
  featuredTestimonialsQuery,
  homePageQuery,
  aboutPageQuery,
  contactPageQuery,
  safetyPageQuery,
  termsPageQuery,
  privacyPageQuery,
} from './queries';
import {
  tourCardSchema,
  tourFullSchema,
  guideRefSchema,
  destinationRefSchema,
  testimonialSchema,
  faqSchema,
  storyCardSchema,
} from './schemas';

const DEFAULT_TAGS = ['sanity'];

async function fetchAndParse<T>(
  query: string,
  schema: z.ZodType<T>,
  params: Record<string, unknown> = {},
  tags: string[] = DEFAULT_TAGS
): Promise<T | null> {
  if (!isSanityConfigured()) return null;
  try {
    const data = await sanityClient.fetch(query, params, {
      next: { tags, revalidate: 60 },
    });
    if (data == null) return null;
    return schema.parse(data);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[sanity] fetch/parse failed', { query, err });
    }
    return null;
  }
}

// ---- Tours ----

export const getAllTours = () =>
  fetchAndParse(allToursQuery, z.array(tourCardSchema), {}, ['sanity', 'tour']);

export const getFeaturedTours = () =>
  fetchAndParse(featuredToursQuery, z.array(tourCardSchema), {}, ['sanity', 'tour']);

export const getTourBySlugFromCms = (slug: string) =>
  fetchAndParse(tourBySlugQuery, tourFullSchema, { slug }, ['sanity', 'tour', `tour:${slug}`]);

// ---- Guides ----

export const getAllGuides = () =>
  fetchAndParse(
    allGuidesQuery,
    z.array(guideRefSchema.extend({ shortBio: z.unknown().optional() })),
    {},
    ['sanity', 'guide']
  );

export const getGuideBySlug = (slug: string) =>
  fetchAndParse(
    guideBySlugQuery,
    guideRefSchema.extend({
      shortBio: z.unknown().optional(),
      bio: z.unknown().optional(),
      specialties: z.array(z.string()).nullable().optional(),
      instagram: z.string().nullable().optional(),
      toursLed: z.array(tourCardSchema).nullable().optional(),
    }),
    { slug },
    ['sanity', 'guide', `guide:${slug}`]
  );

// ---- Destinations ----

export const getAllDestinations = () =>
  fetchAndParse(
    allDestinationsQuery,
    z.array(
      destinationRefSchema.extend({
        shortDescription: z.unknown().optional(),
        elevationM: z.number().nullable().optional(),
        bestSeason: z.array(z.string()).nullable().optional(),
      })
    ),
    {},
    ['sanity', 'destination']
  );

export const getDestinationBySlug = (slug: string) =>
  fetchAndParse(
    destinationBySlugQuery,
    destinationRefSchema.extend({
      shortDescription: z.unknown().optional(),
      description: z.unknown().optional(),
      elevationM: z.number().nullable().optional(),
      bestSeason: z.array(z.string()).nullable().optional(),
      gallery: z.array(z.string()).nullable().optional(),
      tours: z.array(tourCardSchema).nullable().optional(),
    }),
    { slug },
    ['sanity', 'destination', `destination:${slug}`]
  );

// ---- Stories ----

export const getAllStories = () =>
  fetchAndParse(allStoriesQuery, z.array(storyCardSchema), {}, ['sanity', 'story']);

export const getStoryBySlug = (slug: string) =>
  fetchAndParse(
    storyBySlugQuery,
    storyCardSchema.extend({
      body: z.unknown().optional(),
      author: z.unknown().optional(),
      relatedTours: z.array(tourCardSchema).nullable().optional(),
    }),
    { slug },
    ['sanity', 'story', `story:${slug}`]
  );

// ---- FAQ + testimonials ----

export const getAllFaqs = () =>
  fetchAndParse(allFaqsQuery, z.array(faqSchema), {}, ['sanity', 'faq']);

export const getFeaturedTestimonials = () =>
  fetchAndParse(featuredTestimonialsQuery, z.array(testimonialSchema), {}, [
    'sanity',
    'testimonial',
  ]);

// ---- Singletons ----

export const getHomePage = () =>
  fetchAndParse(homePageQuery, z.unknown(), {}, ['sanity', 'home']);

export const getAboutPage = () =>
  fetchAndParse(aboutPageQuery, z.unknown(), {}, ['sanity', 'about']);

export const getContactPage = () =>
  fetchAndParse(contactPageQuery, z.unknown(), {}, ['sanity', 'contact']);

export const getSafetyPage = () =>
  fetchAndParse(safetyPageQuery, z.unknown(), {}, ['sanity', 'safety']);

export const getTermsPage = () =>
  fetchAndParse(termsPageQuery, z.unknown(), {}, ['sanity', 'terms']);

export const getPrivacyPage = () =>
  fetchAndParse(privacyPageQuery, z.unknown(), {}, ['sanity', 'privacy']);
