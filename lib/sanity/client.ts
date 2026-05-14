import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

/**
 * Public read-only Sanity client used by Next.js server components.
 * Use `useCdn: true` for cached, fast reads. Mutations go through Studio.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

/**
 * Drafts-aware client. Used only by preview / draft-mode routes
 * (gated on SANITY_API_READ_TOKEN being set).
 */
export const sanityDraftClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_READ_TOKEN,
});
