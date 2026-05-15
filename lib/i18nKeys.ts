/**
 * Helpers for legacy mock-data translation keys.
 *
 * Mock tours in lib/tours.js store i18n keys like "home.tour1Title" or
 * "dest5Name" or "about.communityP2". They must be resolved against the
 * right next-intl namespace before rendering. This module unifies the
 * two previous resolvers (`resolveKey` in tour-detail + `stripNamespace`
 * in the tour listing) into one consistent API.
 *
 * Sanity-driven content does NOT use these — it carries already-localized
 * strings. Once mock data is fully retired (lib/tours.js deleted), this
 * file can be removed too.
 */

type Translator = (key: string, params?: Record<string, unknown>) => string;

/**
 * Strip the leading "namespace." prefix from a key, leaving the rest intact.
 * "home.tour1Title" -> "tour1Title"
 * "dest5Name"       -> "dest5Name"
 */
export function stripNamespace(key: string | null | undefined): string {
  if (typeof key !== 'string') return '';
  const i = key.indexOf('.');
  return i > 0 ? key.slice(i + 1) : key;
}

/**
 * Resolve a namespaced key by dispatching to the right translator.
 * Falls back to tHome when:
 *   - key has no namespace prefix (e.g. "dest5Name")
 *   - namespace is "home"
 * Routes to tTours when namespace is "tours", to tAbout when "about".
 * Returns "" for null/undefined input.
 */
export function resolveKey(
  translators: { home: Translator; tours: Translator; about?: Translator },
  fullKey: string | null | undefined
): string {
  if (!fullKey) return '';
  const parts = fullKey.split('.');
  if (parts.length <= 1) return translators.home(fullKey);
  const [ns, ...rest] = parts;
  const key = rest.join('.');
  if (ns === 'tours') return translators.tours(key);
  if (ns === 'about' && translators.about) return translators.about(key);
  return translators.home(key);
}
