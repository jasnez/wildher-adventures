import type { MetadataRoute } from 'next';
import {
  getAllTours,
  getAllGuides,
  getAllDestinations,
  getAllStories,
} from '@/lib/sanity/fetch';
import { siteBaseUrl } from '@/lib/seo/structuredData';

const STATIC_PATHS = [
  '/',
  '/o-nama',
  '/ture',
  '/ture/ekspedicije',
  '/ture/jednodnevne',
  '/ture/retreat',
  '/ture/vikend',
  '/vodice',
  '/destinacije',
  '/blog',
  '/galerija',
  '/faq',
  '/kontakt',
  '/sigurnost',
  '/uvjeti',
  '/privatnost',
  '/poklon-vaucer',
];

function buildEntry(
  base: string,
  path: string,
  lastModified?: string,
  priority = 0.7
): MetadataRoute.Sitemap[number] {
  const bsUrl = `${base}${path === '/' ? '' : path}` || base;
  const enUrl = `${base}/en${path === '/' ? '' : path}`;
  return {
    url: bsUrl,
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency: 'weekly',
    priority,
    alternates: {
      languages: {
        bs: bsUrl,
        en: enUrl,
        'x-default': bsUrl,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteBaseUrl();

  const [tours, guides, destinations, stories] = await Promise.all([
    getAllTours(),
    getAllGuides(),
    getAllDestinations(),
    getAllStories(),
  ]);

  const tourEntries = (tours || []).map((t) =>
    buildEntry(base, `/ture/${t.slug.current}`, undefined, 0.9)
  );
  const guideEntries = (guides || []).map((g) =>
    buildEntry(base, `/vodice/${g.slug.current}`, undefined, 0.6)
  );
  const destinationEntries = (destinations || []).map((d) =>
    buildEntry(base, `/destinacije/${d.slug.current}`, undefined, 0.6)
  );
  const storyEntries = (stories || []).map((s) =>
    buildEntry(base, `/price/${s.slug.current}`, s.publishedAt, 0.5)
  );

  const staticEntries = STATIC_PATHS.map((p) =>
    buildEntry(base, p, undefined, p === '/' ? 1.0 : 0.7)
  );

  return [
    ...staticEntries,
    ...tourEntries,
    ...guideEntries,
    ...destinationEntries,
    ...storyEntries,
  ];
}
