/**
 * Sanity environment configuration. Read by the Studio, the client, and Next.js.
 * Required env vars (set in .env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID   (required for content to load)
 *   NEXT_PUBLIC_SANITY_DATASET      (defaults to 'production')
 *   SANITY_API_READ_TOKEN           (optional; only needed for draft preview mode)
 *
 * Build-time behaviour: if NEXT_PUBLIC_SANITY_PROJECT_ID is unset we fall back
 * to a placeholder so the build does not crash. `isSanityConfigured()` lets
 * runtime callers detect the placeholder and gracefully degrade.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-05-01';

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const PLACEHOLDER_PROJECT_ID = 'placeholder';
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || PLACEHOLDER_PROJECT_ID;

export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '/studio';

export function isSanityConfigured(): boolean {
  return projectId !== PLACEHOLDER_PROJECT_ID;
}
