import { z } from 'zod';

/**
 * Zod schemas mirroring the GROQ projections in queries.ts.
 * Parse every Sanity response through these at the boundary so a stale
 * schema or partially-published draft can't crash a server component.
 */

export const localeStringSchema = z
  .object({
    bs: z.string(),
    en: z.string().nullable().optional(),
  })
  .passthrough();

export const localeTextSchema = localeStringSchema;
export const localeRichTextSchema = z
  .object({
    bs: z.array(z.unknown()).optional().nullable(),
    en: z.array(z.unknown()).optional().nullable(),
  })
  .passthrough();

export const slugSchema = z.object({ current: z.string() });

export const guideRefSchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: slugSchema,
  role: localeStringSchema.nullable().optional(),
  photo: z.string().nullable().optional(),
  languages: z.array(z.string()).nullable().optional(),
  certifications: z.array(z.string()).nullable().optional(),
});

export const destinationRefSchema = z.object({
  _id: z.string(),
  name: localeStringSchema,
  slug: slugSchema,
  region: z.string(),
  heroImage: z.string().nullable().optional(),
});

export const testimonialSchema = z.object({
  _id: z.string(),
  quote: localeTextSchema,
  authorName: z.string(),
  authorCity: z.string().nullable().optional(),
  authorPhoto: z.string().nullable().optional(),
  rating: z.number().min(1).max(5),
  publishedAt: z.string(),
});

export const faqSchema = z.object({
  _id: z.string(),
  question: localeStringSchema,
  answer: localeRichTextSchema,
  category: z.string(),
});

export const tourCardSchema = z.object({
  _id: z.string(),
  title: localeStringSchema,
  slug: slugSchema,
  category: z.enum(['one-day', 'weekend', 'expedition', 'retreat']),
  type: z.string(),
  shortDescription: localeTextSchema,
  cover: z.string().nullable().optional(),
  durationDays: z.number(),
  durationLabel: localeStringSchema.nullable().optional(),
  difficulty: z.number().min(1).max(5),
  price: z.number(),
  currency: z.string(),
  maxGroupSize: z.number(),
  badge: z.string().nullable().optional(),
  featured: z.boolean().nullable().optional(),
  sortOrder: z.number().nullable().optional(),
});

export const itineraryStepSchema = z.object({
  label: localeStringSchema,
  description: localeTextSchema.nullable().optional(),
  time: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
});

export const tourDateSchema = z.object({
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  spotsLeft: z.number().nullable().optional(),
  status: z.enum(['open', 'almost_full', 'sold_out', 'waitlist', 'cancelled']),
});

export const tourFullSchema = tourCardSchema.extend({
  subtitle: localeStringSchema.nullable().optional(),
  experienceStory: localeRichTextSchema.nullable().optional(),
  gallery: z.array(z.string()).nullable().optional(),
  lengthKm: z.number().nullable().optional(),
  elevationM: z.number().nullable().optional(),
  minAge: z.number().nullable().optional(),
  startingPoint: localeStringSchema.nullable().optional(),
  deposit: z.number().nullable().optional(),
  itinerary: z.array(itineraryStepSchema).nullable().optional(),
  included: z.array(localeStringSchema).nullable().optional(),
  excluded: z.array(localeStringSchema).nullable().optional(),
  whatToBring: z.array(localeStringSchema).nullable().optional(),
  whoIsForIncluded: z.array(localeStringSchema).nullable().optional(),
  whoIsForExcluded: z.array(localeStringSchema).nullable().optional(),
  physicalPrep: localeRichTextSchema.nullable().optional(),
  guide: guideRefSchema.nullable().optional(),
  destination: destinationRefSchema.nullable().optional(),
  availableDates: z.array(tourDateSchema).nullable().optional(),
  testimonials: z.array(testimonialSchema).nullable().optional(),
  faqs: z.array(faqSchema).nullable().optional(),
  similarTours: z.array(tourCardSchema).nullable().optional(),
  gpxFile: z.string().nullable().optional(),
  mapImage: z.string().nullable().optional(),
});

export type LocaleString = z.infer<typeof localeStringSchema>;
export type TourCard = z.infer<typeof tourCardSchema>;
export type TourFull = z.infer<typeof tourFullSchema>;
export type Guide = z.infer<typeof guideRefSchema>;
export type Destination = z.infer<typeof destinationRefSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type Story = z.infer<typeof tourCardSchema>; // placeholder; full story schema below

export const storyCardSchema = z.object({
  _id: z.string(),
  title: localeStringSchema,
  slug: slugSchema,
  excerpt: localeTextSchema.nullable().optional(),
  coverImage: z.string().nullable().optional(),
  publishedAt: z.string(),
  tags: z.array(z.string()).nullable().optional(),
  author: guideRefSchema.partial().nullable().optional(),
});

export type StoryCard = z.infer<typeof storyCardSchema>;
