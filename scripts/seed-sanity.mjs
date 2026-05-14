#!/usr/bin/env node
/**
 * Seed Sanity with realistic dummy content for WildHer Adventures.
 *
 * Requirements:
 *   - .env.local contains NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 *   - .env.local contains SANITY_API_WRITE_TOKEN (Editor scope)
 *
 * Run: npm run seed:sanity
 * Idempotent: uses deterministic _id values, re-runs update existing docs.
 *
 * To reset: clear documents in Studio first (or use sanity dataset import --replace).
 */
import { createClient } from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

// ---- Load .env.local ------------------------------------------------------
function loadEnvLocal() {
  const envPath = path.join(REPO_ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || projectId === 'FILL_IN_SANITY_PROJECT_ID') {
  console.error('[seed] NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local. Aborting.');
  process.exit(1);
}
if (!token) {
  console.error('[seed] SANITY_API_WRITE_TOKEN is not set in .env.local. Aborting.');
  console.error('[seed] Create one at https://sanity.io/manage -> Project -> API -> Tokens');
  console.error('[seed] Select role: Editor. Paste the value into .env.local then re-run.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-05-01',
  token,
  useCdn: false,
});

// ---- Helpers --------------------------------------------------------------
function bs(text) {
  return { _type: 'localeString', bs: text, en: '' };
}
function bilingual(bsText, enText) {
  return { _type: 'localeString', bs: bsText, en: enText };
}
function bilingualText(bsText, enText) {
  return { _type: 'localeText', bs: bsText, en: enText };
}
function richText(bsParagraphs, enParagraphs) {
  return {
    _type: 'localeRichText',
    bs: bsParagraphs.map(toBlock),
    en: (enParagraphs || []).map(toBlock),
  };
}
function toBlock(text) {
  return {
    _type: 'block',
    _key: cryptoKey(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: cryptoKey(), text, marks: [] }],
  };
}
function cryptoKey() {
  return Math.random().toString(36).slice(2, 12);
}

async function uploadImage(filePath, name) {
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload('image', buffer, {
    filename: name,
    contentType: 'image/webp',
  });
  console.log(`  [image] uploaded ${name} -> ${asset._id}`);
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  };
}

async function findExistingAsset(filename) {
  const result = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $name][0]._id`,
    { name: filename }
  );
  return result || null;
}

async function uploadOrReuseImage(relativePath) {
  const abs = path.join(REPO_ROOT, 'public', 'images', relativePath);
  if (!fs.existsSync(abs)) {
    console.warn(`  [image] skip: ${relativePath} not found`);
    return null;
  }
  const existing = await findExistingAsset(relativePath);
  if (existing) {
    console.log(`  [image] reuse ${relativePath} -> ${existing}`);
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: existing },
    };
  }
  return uploadImage(abs, relativePath);
}

async function createOrReplace(id, doc) {
  await client.createOrReplace({ _id: id, ...doc });
  console.log(`  [doc] ${doc._type}:${id}`);
}

// ---- Seed plan ------------------------------------------------------------
async function seed() {
  console.log(`[seed] Connected to project ${projectId} dataset ${dataset}\n`);

  console.log('[seed] Uploading / reusing images…');
  const imgViaFerrata = await uploadOrReuseImage('5-1280w.webp');
  const imgLukomir = await uploadOrReuseImage('8-1280w.webp');
  const imgPrenj = await uploadOrReuseImage('10-1280w.webp');
  const imgGuidePortrait = await uploadOrReuseImage('7-1280w.webp');
  const imgDestBlagaj = await uploadOrReuseImage('5-1280w.webp');
  const imgDestSarajevo = await uploadOrReuseImage('11-1280w.webp');
  const imgHero = await uploadOrReuseImage('1-1280w.webp');
  const fallback = imgViaFerrata;

  console.log('\n[seed] Creating destinations…');
  await createOrReplace('destination-blagaj', {
    _type: 'destination',
    name: bilingual('Blagaj & Buna kanjon', 'Blagaj & Buna canyon'),
    slug: { _type: 'slug', current: 'blagaj' },
    region: 'herzegovina',
    heroImage: imgDestBlagaj || fallback,
    shortDescription: bilingualText(
      'Selo Blagaj uz izvor rijeke Bune i tekiju iz 16. stoljeća. Visoke krečnjačke stijene iznad rijeke idealne za via ferrata stazu.',
      'Blagaj village by the source of the Buna river and a 16th-century dervish lodge. Limestone cliffs above the river make it ideal for via ferrata.'
    ),
    elevationM: 100,
    bestSeason: ['spring', 'summer', 'autumn'],
    mapCoordinates: '43.2575,17.8990',
  });

  await createOrReplace('destination-bjelasnica', {
    _type: 'destination',
    name: bilingual('Bjelašnica & Visočica', 'Bjelašnica & Visočica'),
    slug: { _type: 'slug', current: 'bjelasnica-visocica' },
    region: 'sarajevo',
    heroImage: imgDestSarajevo || fallback,
    shortDescription: bilingualText(
      'Olimpijska planina iznad Sarajeva i susjedna Visočica sa selom Lukomir — najvišim stalno naseljenim selom u BiH (1495m).',
      "Olympic mountain above Sarajevo and the neighbouring Visočica, home to Lukomir — BiH's highest permanently inhabited village (1495m)."
    ),
    elevationM: 2067,
    bestSeason: ['summer', 'autumn'],
    mapCoordinates: '43.7,18.25',
  });

  console.log('\n[seed] Creating guide…');
  await createOrReplace('guide-amra', {
    _type: 'guide',
    name: 'Amra Halilović',
    slug: { _type: 'slug', current: 'amra-halilovic' },
    role: bilingual('Osnivačica i glavna vodičica', 'Founder & lead guide'),
    photo: imgGuidePortrait || fallback,
    shortBio: bilingualText(
      'Licencirana planinarska vodičica i profesorica tjelesnog odgoja. Više od 12 godina vodi grupe kroz planine BiH.',
      'Licensed mountain guide and physical-education teacher. Over 12 years of guiding groups through the mountains of BiH.'
    ),
    bio: richText(
      [
        'Amra je osnovala WildHer Adventures 2024. godine, vodjena idejom da ženama u BiH i regionu pruži siguran prostor za avanturu, izazov i lični rast.',
        'Prije nego što se okrenula vodjenju, godinama je bila aktivna alpinistkinja i instruktorica planinarstva. Specijalizovana je za via ferrata, multi-day ekspedicije i ženske retreat programe.',
        'Kada nije u planinama, predaje tjelesni odgoj u srednjoj školi i vodi ženski planinarski klub u Sarajevu.',
      ],
      [
        'Amra founded WildHer Adventures in 2024, driven by a desire to give women in BiH and the wider region a safe space for adventure, challenge, and personal growth.',
        'Before turning to guiding, she spent years as an active alpinist and mountaineering instructor. She specialises in via ferrata, multi-day expeditions, and women-only retreat programmes.',
        'When she is not in the mountains, she teaches physical education at a high school in Sarajevo and leads a local women\'s hiking club.',
      ]
    ),
    languages: ['Bosnian', 'English', 'German'],
    certifications: [
      'Licenced mountain guide (BiH)',
      'Wilderness First Responder (16 days)',
      'Via Ferrata Instructor — Italy',
    ],
    specialties: ['hiking', 'via_ferrata', 'mountaineering', 'first_aid', 'retreat'],
    instagram: '@amra.halilovic',
  });

  const guideRef = { _type: 'reference', _ref: 'guide-amra' };

  console.log('\n[seed] Creating tours…');
  await createOrReplace('tour-via-ferrata-blagaj', {
    _type: 'tour',
    title: bilingual('Via Ferrata Blagaj', 'Via Ferrata Blagaj'),
    slug: { _type: 'slug', current: 'via-ferrata-blagaj' },
    category: 'one-day',
    type: 'via_ferrata',
    shortDescription: bilingualText(
      'Početnička via ferrata iznad rijeke Bune. Čelične sajle, eksponirane sekcije i dramatični pogledi na kanjon — bez prethodnog penjačkog iskustva.',
      'Beginner-friendly via ferrata above the Buna river. Steel cables, exposed sections and dramatic canyon views — no prior climbing experience needed.'
    ),
    subtitle: bilingual('Ženska avantura iznad kanjona Bune', "Women's adventure above the Buna canyon"),
    experienceStory: richText(
      [
        'Jutro počinje u Blagaju dok sunce tek obasjava stijene iznad Neretve. Staza se lagano penje kroz borovu šumu, a pogled na kanjon postaje sve dramatičniji.',
        'Nakon kratke pauze stižemo do via ferrata staze — metalni klinovi vode nas uz stijenu, a svaki korak otvara sve veći pogled na rijeku ispod. Penjanje traje oko 2 sata.',
        'Vraćamo se nazad kroz selo Blagaj, gdje nas čeka tradicionalna večera uz izvor Bune.',
      ],
      [
        "The morning starts in Blagaj as the sun lights up the cliffs above the Neretva. The path climbs gently through pine forest, and the canyon view becomes more dramatic by the step.",
        'After a short break we reach the via ferrata — steel rungs lead us up the rock, and each move opens a wider view of the river below. The climb takes about 2 hours.',
        'We descend through Blagaj village, where a traditional dinner waits by the Buna spring.',
      ]
    ),
    cover: imgViaFerrata || fallback,
    destination: { _type: 'reference', _ref: 'destination-blagaj' },
    durationDays: 1,
    durationLabel: bilingual('1 dan', '1 day'),
    difficulty: 2,
    lengthKm: 8,
    elevationM: 450,
    maxGroupSize: 8,
    minAge: 14,
    startingPoint: bilingual('Blagaj, kod tekije', 'Blagaj, by the dervish lodge'),
    price: 95,
    deposit: 30,
    currency: 'EUR',
    itinerary: [
      {
        _key: cryptoKey(),
        _type: 'itineraryStep',
        label: bilingual('Polazna tačka', 'Meeting point'),
        time: '08:30',
        description: bilingualText(
          'Susret kod tekije u Blagaju, kratak uvod i podjela opreme.',
          'Meet at the dervish lodge in Blagaj, briefing and gear handover.'
        ),
      },
      {
        _key: cryptoKey(),
        _type: 'itineraryStep',
        label: bilingual('Pristupna staza', 'Approach trail'),
        time: '09:00–10:00',
        description: bilingualText(
          'Lagani uspon kroz borovu šumu do baze stijene.',
          'Gentle climb through pine forest to the base of the cliff.'
        ),
      },
      {
        _key: cryptoKey(),
        _type: 'itineraryStep',
        label: bilingual('Via Ferrata uspon', 'Via Ferrata climb'),
        time: '10:00–12:00',
        description: bilingualText(
          'Penjanje uz čelične sajle, sa pauzama na izloženim mjestima za fotografije.',
          'Climbing the steel cables, with breaks at exposed viewpoints for photos.'
        ),
      },
      {
        _key: cryptoKey(),
        _type: 'itineraryStep',
        label: bilingual('Pauza i ručak', 'Break and lunch'),
        time: '12:00–13:30',
        description: bilingualText(
          'Tradicionalni ručak u restoranu uz izvor Bune.',
          'Traditional lunch at a restaurant by the Buna source.'
        ),
      },
      {
        _key: cryptoKey(),
        _type: 'itineraryStep',
        label: bilingual('Povratak', 'Return'),
        time: '14:00',
        description: bilingualText('Povratak u Sarajevo/Mostar.', 'Return to Sarajevo/Mostar.'),
      },
    ],
    included: [
      bilingual('Sertifikovan vodič', 'Certified guide'),
      bilingual('Cjelokupna via ferrata oprema (kaciga, pojas, set)', 'Full via ferrata gear (helmet, harness, lanyard)'),
      bilingual('Osiguranje', 'Insurance'),
      bilingual('Tradicionalni ručak', 'Traditional lunch'),
    ],
    excluded: [
      bilingual('Prevoz do Blagaja', 'Transport to Blagaj'),
      bilingual('Lična oprema (cipele, ruksak)', 'Personal gear (shoes, backpack)'),
    ],
    whatToBring: [
      bilingual('Planinarske cipele sa dobrim đonom', 'Hiking shoes with good grip'),
      bilingual('Ruksak 20-30L', 'Backpack 20-30L'),
      bilingual('1.5L vode', '1.5L of water'),
      bilingual('Slojevita odjeća', 'Layered clothing'),
      bilingual('Krema za sunce i kapa', 'Sunscreen and a cap'),
    ],
    whoIsForIncluded: [
      bilingual('žene koje vole prirodu i izazov', 'women who love nature and a challenge'),
      bilingual('početnice za via ferrata', 'beginners to via ferrata'),
      bilingual('osnovna fizička kondicija', 'basic physical fitness'),
      bilingual('grupna ili solo putnica', 'group or solo travellers'),
    ],
    whoIsForExcluded: [
      bilingual('nije za osobe sa jakim strahom od visine', 'not for those with strong fear of heights'),
      bilingual('nije za djecu mlađu od 14 godina', 'not for children under 14'),
    ],
    guide: guideRef,
    availableDates: [
      {
        _key: cryptoKey(),
        _type: 'tourDate',
        startDate: '2026-06-14',
        endDate: '2026-06-14',
        spotsLeft: 5,
        status: 'open',
      },
      {
        _key: cryptoKey(),
        _type: 'tourDate',
        startDate: '2026-07-12',
        endDate: '2026-07-12',
        spotsLeft: 2,
        status: 'almost_full',
      },
      {
        _key: cryptoKey(),
        _type: 'tourDate',
        startDate: '2026-09-06',
        endDate: '2026-09-06',
        spotsLeft: 8,
        status: 'open',
      },
    ],
    badge: 'popular',
    featured: true,
    sortOrder: 10,
  });

  await createOrReplace('tour-lukomir-hike', {
    _type: 'tour',
    title: bilingual('Lukomir — najviše selo BiH', 'Lukomir — highest village in BiH'),
    slug: { _type: 'slug', current: 'lukomir-hike' },
    category: 'one-day',
    type: 'hiking',
    shortDescription: bilingualText(
      'Hiking kroz Bjelašnicu do Lukomira (1495m) — najvišeg stalno naseljenog sela u BiH. Tradicionalni ručak u selu i pogled na kanjon Rakitnice.',
      "Hike across Bjelašnica to Lukomir (1495m) — BiH's highest permanently inhabited village. Traditional lunch in the village and Rakitnica canyon views."
    ),
    subtitle: bilingual('Tradicija, krš i nebo iznad Sarajeva', 'Tradition, karst and sky above Sarajevo'),
    experienceStory: richText(
      [
        'Polazimo iz Šabića i lagano se penjemo kroz Bjelašnicu. Staza je markirana i prolazi kroz nekoliko ljetnih katuna sa stadima ovaca.',
        'Stigavši u Lukomir, vrijeme se zaustavlja. Kamene kuće sa krovovima od ploča, žene koje pletu i kanjon Rakitnice koji se prosijeca 800 metara ispod nas.',
        'Tradicionalni ručak u selu — pita, kajmak, sir — i vraćamo se istom stazom, sa dovoljno vremena za fotografije.',
      ],
      [
        'We start from Šabići and climb gently across Bjelašnica. The trail is well marked and passes a few summer settlements with sheep herds.',
        'Arriving in Lukomir, time slows down. Stone houses with slate roofs, women knitting, and the Rakitnica canyon cutting 800 metres below.',
        'Traditional lunch in the village — pita, kajmak, cheese — and we return on the same trail, with plenty of time for photos.',
      ]
    ),
    cover: imgLukomir || fallback,
    destination: { _type: 'reference', _ref: 'destination-bjelasnica' },
    durationDays: 1,
    durationLabel: bilingual('1 dan', '1 day'),
    difficulty: 2,
    lengthKm: 14,
    elevationM: 550,
    maxGroupSize: 10,
    minAge: 12,
    startingPoint: bilingual('Šabići, Bjelašnica', 'Šabići, Bjelašnica'),
    price: 75,
    deposit: 25,
    currency: 'EUR',
    itinerary: [
      {
        _key: cryptoKey(),
        _type: 'itineraryStep',
        label: bilingual('Polazak iz Sarajeva', 'Departure from Sarajevo'),
        time: '07:30',
      },
      {
        _key: cryptoKey(),
        _type: 'itineraryStep',
        label: bilingual('Polazna tačka, Šabići', 'Trailhead, Šabići'),
        time: '08:30',
      },
      {
        _key: cryptoKey(),
        _type: 'itineraryStep',
        label: bilingual('Hiking do Lukomira', 'Hike to Lukomir'),
        time: '08:45–11:30',
      },
      {
        _key: cryptoKey(),
        _type: 'itineraryStep',
        label: bilingual('Selo i tradicionalni ručak', 'Village and traditional lunch'),
        time: '11:30–14:00',
      },
      {
        _key: cryptoKey(),
        _type: 'itineraryStep',
        label: bilingual('Povratak', 'Return'),
        time: '14:00–17:00',
      },
    ],
    included: [
      bilingual('Vodič', 'Guide'),
      bilingual('Tradicionalni ručak u Lukomiru', 'Traditional lunch in Lukomir'),
      bilingual('Prevoz Sarajevo ↔ Šabići', 'Transfer Sarajevo ↔ Šabići'),
    ],
    excluded: [bilingual('Lična oprema', 'Personal gear')],
    whatToBring: [
      bilingual('Planinarske cipele', 'Hiking shoes'),
      bilingual('Ruksak 20-30L', 'Backpack 20-30L'),
      bilingual('Voda i grickalica', 'Water and a snack'),
      bilingual('Slojevita odjeća, vjetrovka', 'Layered clothing, windbreaker'),
    ],
    whoIsForIncluded: [
      bilingual('žene koje vole sporiji ritam u prirodi', 'women who enjoy a slower pace in nature'),
      bilingual('one koje cijene autentičnu tradiciju', 'those who value authentic tradition'),
      bilingual('osnovna kondicija za 14 km i 550 m uspona', 'basic fitness for 14 km and 550 m ascent'),
    ],
    whoIsForExcluded: [
      bilingual('nije za potpune početnice bez ikakve kondicije', 'not for complete beginners with no fitness'),
    ],
    guide: guideRef,
    availableDates: [
      {
        _key: cryptoKey(),
        _type: 'tourDate',
        startDate: '2026-05-30',
        endDate: '2026-05-30',
        spotsLeft: 6,
        status: 'open',
      },
      {
        _key: cryptoKey(),
        _type: 'tourDate',
        startDate: '2026-06-28',
        endDate: '2026-06-28',
        spotsLeft: 10,
        status: 'open',
      },
      {
        _key: cryptoKey(),
        _type: 'tourDate',
        startDate: '2026-08-23',
        endDate: '2026-08-23',
        spotsLeft: 0,
        status: 'sold_out',
      },
    ],
    badge: 'new',
    featured: true,
    sortOrder: 20,
  });

  await createOrReplace('tour-prenj-weekend', {
    _type: 'tour',
    title: bilingual('Prenj — vikend ekspedicija', 'Prenj — weekend expedition'),
    slug: { _type: 'slug', current: 'prenj-weekend' },
    category: 'weekend',
    type: 'hiking',
    shortDescription: bilingualText(
      'Dvodnevna ekspedicija kroz "bosanski Himalaj" — gusta šuma, otvoreni grebeni, noćenje u planinskoj kući i vrh Otiš (2098m).',
      'Two-day expedition across the "Bosnian Himalayas" — dense forest, open ridges, a night in a mountain hut and the Otiš summit (2098m).'
    ),
    subtitle: bilingual('Hercegovacki greben i noć pod zvijezdama', 'Herzegovinian ridge and a night under the stars'),
    experienceStory: richText(
      [
        'Prvi dan: penjemo se kroz crnogoričnu šumu do planinske kuće (1750m). Popodne lagani hike do bližeg vidikovca i vraćamo se na večeru.',
        'Drugi dan: rani start na vrh Otiš (2098m), na povratku obilazimo greben i spuštamo se drugom stazom.',
        'Prenj se osjeća veći nego što jest — divlja planina sa malim brojem ljudi i panoramama koje pamtiš godinama.',
      ],
      [
        'Day 1: we climb through conifer forest to the mountain hut (1750m). In the afternoon a short hike to a nearby viewpoint, then back for dinner.',
        'Day 2: early start to the Otiš summit (2098m). On the way back we follow the ridge and descend on a different trail.',
        'Prenj feels larger than it is — a wild mountain with few people and panoramas you remember for years.',
      ]
    ),
    cover: imgPrenj || fallback,
    destination: { _type: 'reference', _ref: 'destination-bjelasnica' },
    durationDays: 2,
    durationLabel: bilingual('Vikend (2 dana)', 'Weekend (2 days)'),
    difficulty: 4,
    lengthKm: 22,
    elevationM: 1400,
    maxGroupSize: 6,
    minAge: 18,
    startingPoint: bilingual('Konjic, parking Tisovica', 'Konjic, Tisovica trailhead'),
    price: 320,
    deposit: 100,
    currency: 'EUR',
    included: [
      bilingual('Vodič (oba dana)', 'Guide (both days)'),
      bilingual('Smještaj u planinskoj kući', 'Mountain-hut accommodation'),
      bilingual('Doručak i večera u kući', 'Breakfast and dinner at the hut'),
      bilingual('Osiguranje', 'Insurance'),
    ],
    excluded: [
      bilingual('Prevoz do polazne tačke', 'Transport to the trailhead'),
      bilingual('Ručak u terenu (paket sandwich)', 'Trail lunch (pack a sandwich)'),
    ],
    whatToBring: [
      bilingual('Planinarske cipele B/C kategorije', 'B/C category hiking boots'),
      bilingual('Ruksak 35-45L', 'Backpack 35-45L'),
      bilingual('Spavaća vreća (komfort 5°C)', 'Sleeping bag (comfort 5°C)'),
      bilingual('Slojeviti komplet odjeće, vjetrovka, kapa', 'Layered clothing, windbreaker, cap'),
      bilingual('Štapovi za hodanje (preporuka)', 'Trekking poles (recommended)'),
    ],
    whoIsForIncluded: [
      bilingual('iskusnije planinarke', 'experienced hikers'),
      bilingual('spremne za 8h hoda dnevno', 'ready for 8h hiking per day'),
      bilingual('one koje žele osjetiti pravu ekspediciju', 'those who want to feel a real expedition'),
    ],
    whoIsForExcluded: [
      bilingual('nije za početnice', 'not for beginners'),
      bilingual('nije za osobe sa problemima sa koljenima/zglobovima', 'not for those with knee/joint problems'),
    ],
    guide: guideRef,
    availableDates: [
      {
        _key: cryptoKey(),
        _type: 'tourDate',
        startDate: '2026-07-04',
        endDate: '2026-07-05',
        spotsLeft: 4,
        status: 'open',
      },
      {
        _key: cryptoKey(),
        _type: 'tourDate',
        startDate: '2026-08-29',
        endDate: '2026-08-30',
        spotsLeft: 6,
        status: 'open',
      },
    ],
    featured: true,
    sortOrder: 30,
  });

  console.log('\n[seed] Linking similar tours…');
  // Sanity references go in arrays; update similar tours after all created.
  await client
    .patch('tour-via-ferrata-blagaj')
    .set({
      similarTours: [
        { _key: cryptoKey(), _type: 'reference', _ref: 'tour-lukomir-hike' },
        { _key: cryptoKey(), _type: 'reference', _ref: 'tour-prenj-weekend' },
      ],
    })
    .commit();
  await client
    .patch('tour-lukomir-hike')
    .set({
      similarTours: [
        { _key: cryptoKey(), _type: 'reference', _ref: 'tour-via-ferrata-blagaj' },
        { _key: cryptoKey(), _type: 'reference', _ref: 'tour-prenj-weekend' },
      ],
    })
    .commit();
  await client
    .patch('tour-prenj-weekend')
    .set({
      similarTours: [
        { _key: cryptoKey(), _type: 'reference', _ref: 'tour-via-ferrata-blagaj' },
        { _key: cryptoKey(), _type: 'reference', _ref: 'tour-lukomir-hike' },
      ],
    })
    .commit();

  console.log('\n[seed] Creating testimonials…');
  const testimonialSeeds = [
    {
      id: 'testimonial-1',
      author: 'Naja K.',
      city: 'Sarajevo',
      tour: 'tour-via-ferrata-blagaj',
      rating: 5,
      bs: 'Bila mi je prva via ferrata. Osjećaj na vrhu je nevjerovatan, a Amra nas je vodila tako sigurno i strpljivo da nijednog trenutka nisam pomislila da odustanem.',
      en: 'It was my first via ferrata. The feeling at the top is incredible, and Amra led us so safely and patiently that I never once thought of turning back.',
    },
    {
      id: 'testimonial-2',
      author: 'Ines T.',
      city: 'Beč',
      tour: 'tour-lukomir-hike',
      rating: 5,
      bs: 'Lukomir je nestvaran. Sa grupom od šest žena, među njima i meni stranom kao Sarajka, osjećala sam se kao kod kuće. Najbolji rođendanski poklon sebi.',
      en: 'Lukomir is unreal. With a group of six women — me being the only non-local — I felt completely at home. Best birthday gift I ever gave myself.',
    },
    {
      id: 'testimonial-3',
      author: 'Maja P.',
      city: 'Mostar',
      tour: 'tour-prenj-weekend',
      rating: 5,
      bs: 'Prenj je izazov koji vrijedi svake minute. Spavanje u planinskoj kući, dijeljenje priča s drugim ženama, izlazak sunca na vrhu — neprocjenjivo.',
      en: 'Prenj is a challenge worth every minute. Sleeping at the mountain hut, sharing stories with other women, sunrise on the summit — priceless.',
    },
    {
      id: 'testimonial-4',
      author: 'Lara M.',
      city: 'Zagreb',
      tour: 'tour-via-ferrata-blagaj',
      rating: 5,
      bs: 'Došla sam solo iz Zagreba, vratila se sa pet novih prijateljica i osjećajem da mogu i više. WildHer je više od ture.',
      en: 'I came solo from Zagreb, went home with five new friends and the feeling I can do more than I thought. WildHer is more than a tour.',
    },
  ];

  for (const tm of testimonialSeeds) {
    await createOrReplace(tm.id, {
      _type: 'testimonial',
      quote: bilingualText(tm.bs, tm.en),
      authorName: tm.author,
      authorCity: tm.city,
      rating: tm.rating,
      tour: { _type: 'reference', _ref: tm.tour },
      publishedAt: new Date().toISOString(),
      featured: true,
    });
  }

  // Patch testimonials onto tours
  await client
    .patch('tour-via-ferrata-blagaj')
    .set({
      testimonials: [
        { _key: cryptoKey(), _type: 'reference', _ref: 'testimonial-1' },
        { _key: cryptoKey(), _type: 'reference', _ref: 'testimonial-4' },
      ],
    })
    .commit();
  await client
    .patch('tour-lukomir-hike')
    .set({
      testimonials: [{ _key: cryptoKey(), _type: 'reference', _ref: 'testimonial-2' }],
    })
    .commit();
  await client
    .patch('tour-prenj-weekend')
    .set({
      testimonials: [{ _key: cryptoKey(), _type: 'reference', _ref: 'testimonial-3' }],
    })
    .commit();

  console.log('\n[seed] Creating FAQs…');
  const faqSeeds = [
    {
      id: 'faq-solo-travel',
      cat: 'solo',
      order: 10,
      qBs: 'Mogu li doći solo, ako ne poznajem nikoga u grupi?',
      qEn: 'Can I come solo if I do not know anyone in the group?',
      aBs: 'Da. Većina naših učesnica dolazi solo. Grupa je ono što čini WildHer iskustvo — do kraja ture stvaraju se prijateljstva koja traju duže od putovanja.',
      aEn: 'Yes. Most of our participants come solo. The group is what makes WildHer — by the end of the trip you will have friendships that outlast the trip itself.',
    },
    {
      id: 'faq-fitness',
      cat: 'fitness',
      order: 10,
      qBs: 'Kako da znam da li sam dovoljno spremna?',
      qEn: 'How do I know if I am fit enough?',
      aBs: 'Svaka tura ima oznaku težine 1–5 i jasan opis "Kome je ova tura namijenjena". Ako nisi sigurna, slobodno nam piši — bolje preporučiti turu nivoa niže nego pretjerati.',
      aEn: 'Every tour has a 1–5 difficulty rating and a clear "Who is this for" section. If unsure, write to us — better to recommend a tour one level easier than to overshoot.',
    },
    {
      id: 'faq-safety-bih',
      cat: 'safety',
      order: 10,
      qBs: 'Kao žena, da li je sigurno putovati i planinariti u BiH?',
      qEn: 'As a woman, is it safe to travel and hike in BiH?',
      aBs: 'Da. BiH je generalno vrlo sigurna zemlja za putovanje. Naše ture vodi licencirana vodičica sa obukom iz prve pomoći, koristimo certificiranu opremu i grupa nikad ne prelazi 10 učesnica.',
      aEn: 'Yes. BiH is generally a very safe country to travel in. Our tours are led by a licensed guide with first-aid training, we use certified equipment, and group size never exceeds 10 participants.',
    },
    {
      id: 'faq-period',
      cat: 'fitness',
      order: 20,
      qBs: 'Šta ako imam menstruaciju tokom ture?',
      qEn: 'What if I have my period during the tour?',
      aBs: 'Sve naše vodičice su žene i ovo je apsolutno normalna stvar o kojoj se razgovara. Imamo pribor za hitne slučajeve, a na višednevnim turama postoje privatni prostori za higijenu.',
      aEn: 'All our guides are women and this is absolutely a normal topic of conversation. We carry emergency supplies, and multi-day tours include private spaces for hygiene.',
    },
    {
      id: 'faq-cancellation',
      cat: 'booking',
      order: 10,
      qBs: 'Šta ako otkažem dolazak?',
      qEn: 'What if I have to cancel?',
      aBs: 'Otkazivanje 30+ dana prije ture: puna povrat depozita umanjena za transakcijske troškove. 14–30 dana: 50% povrat. Manje od 14 dana: depozit se zadržava (ili prebacuje na drugi termin).',
      aEn: 'Cancellation 30+ days before the tour: full deposit refund minus transaction fees. 14–30 days: 50% refund. Less than 14 days: deposit is kept (or transferred to another date).',
    },
    {
      id: 'faq-payment',
      cat: 'booking',
      order: 20,
      qBs: 'Kako plaćam?',
      qEn: 'How do I pay?',
      aBs: 'Nakon kratkog razgovora ili maila šaljemo Stripe link za uplatu depozita. Ostatak se plaća 14 dana prije ture, takođe karticom ili bankovnim transferom.',
      aEn: 'After a short call or email we send a Stripe link for the deposit. The balance is due 14 days before the tour, also by card or bank transfer.',
    },
    {
      id: 'faq-gear',
      cat: 'gear',
      order: 10,
      qBs: 'Trebam li svoju via ferrata opremu?',
      qEn: 'Do I need my own via ferrata gear?',
      aBs: 'Ne. Mi obezbjeđujemo certificirane setove (kaciga, pojas, sajla sa apsorberom). Trebaju ti samo planinarske cipele i adekvatna odjeća.',
      aEn: 'No. We provide certified sets (helmet, harness, lanyard with shock absorber). You only need hiking shoes and appropriate clothing.',
    },
    {
      id: 'faq-accommodation',
      cat: 'accommodation',
      order: 10,
      qBs: 'Kako izgleda smještaj na višednevnim turama?',
      qEn: 'What is the accommodation like on multi-day tours?',
      aBs: 'Većinom planinske kuće i pansioni vlasništva žena. Sobe su podijeljene (najčešće 2-4 osobe). Ako želiš privatnu sobu, javi nam ranije.',
      aEn: 'Mostly mountain huts and woman-owned guesthouses. Rooms are shared (typically 2-4 people). If you want a private room, let us know in advance.',
    },
  ];

  for (const faq of faqSeeds) {
    await createOrReplace(faq.id, {
      _type: 'faq',
      question: bilingual(faq.qBs, faq.qEn),
      answer: richText([faq.aBs], [faq.aEn]),
      category: faq.cat,
      order: faq.order,
    });
  }

  console.log('\n[seed] Creating page singletons…');
  await createOrReplace('homePage', {
    _type: 'homePage',
    heroTitle: bilingual('Otkrij svoju snagu u divljini Bosne', 'Discover your strength in wild Bosnia'),
    heroSubtitle: bilingualText(
      'Ženske outdoor avanture koje vode žene — planinarenje, via ferrata, ekspedicije i retreat programi kroz najljepše planine BiH.',
      "Women-led outdoor adventures — hiking, via ferrata, expeditions and retreats through BiH's most beautiful mountains."
    ),
    heroImage: imgHero || fallback,
    tagline: bilingual('Tvoja avantura. Tvoja sigurnost. Tvoje pleme.', 'Your adventure. Your safety. Your tribe.'),
    trustBadges: [
      bilingual('Samo za žene', 'Women only'),
      bilingual('Licencirana vodičica', 'Licensed female guide'),
      bilingual('Male grupe (max 10)', 'Small groups (max 10)'),
      bilingual('Lokalni vodičice iz BiH', 'Local BiH guides'),
    ],
    featuredTours: [
      { _key: cryptoKey(), _type: 'reference', _ref: 'tour-via-ferrata-blagaj' },
      { _key: cryptoKey(), _type: 'reference', _ref: 'tour-lukomir-hike' },
      { _key: cryptoKey(), _type: 'reference', _ref: 'tour-prenj-weekend' },
    ],
  });

  await createOrReplace('aboutPage', {
    _type: 'aboutPage',
    heroTitle: bilingual('Naša priča', 'Our story'),
    heroSubtitle: bilingualText(
      'WildHer Adventures je nastao iz ljubavi prema planinama BiH i ideje da žene zaslužuju siguran prostor za avanturu i istraživanje prirode.',
      'WildHer Adventures was born from a love of the mountains of BiH and a belief that women deserve a safe space for adventure and exploring nature.'
    ),
    heroImage: imgHero || fallback,
    founderStory: richText(
      [
        'WildHer Adventures osnovala je Amra Halilović 2024. godine. Kao licencirana planinska vodičica i profesorica tjelesnog odgoja, godinama je vodila grupe kroz planine BiH.',
        'Tokom tih godina postalo je jasno koliko priroda može imati transformativnu snagu na žene — i koliko često im je nedostajao siguran, ženski prostor da to dožive.',
        'Iz toga je nastao WildHer: ženske outdoor ture koje vode žene, u kojima je sigurnost prioritet, a iskustvo namijenjeno onima koje žele više od običnog izleta.',
      ],
      [
        'WildHer Adventures was founded by Amra Halilović in 2024. As a licensed mountain guide and physical-education teacher, she had spent years leading groups through the mountains of BiH.',
        "Over those years, it became clear how transformative nature can be for women — and how often they lacked a safe, women-only space to experience it.",
        'From that came WildHer: women-only outdoor tours led by women, where safety is the priority and the experience is for those who want more than a regular trip.',
      ]
    ),
    mission: richText(
      [
        'Pomoći ženama da kroz avanturu u prirodi otkriju svoju snagu, povežu se sa sobom i dožive autentičnu ljepotu planina BiH.',
      ],
      [
        'To help women discover their strength through adventure in nature, reconnect with themselves, and experience the authentic beauty of the BiH mountains.',
      ]
    ),
    values: [
      {
        _key: cryptoKey(),
        title: bilingual('Sigurnost', 'Safety'),
        text: bilingualText(
          'Tvoja sigurnost je naš prioritet. Svaka tura planira se uz pažljivu procjenu rute, vremenskih uslova i nivoa težine.',
          'Your safety is our priority. Every tour is planned with careful assessment of route, weather and difficulty.'
        ),
        icon: 'shield',
      },
      {
        _key: cryptoKey(),
        title: bilingual('Zajednica', 'Community'),
        text: bilingualText(
          'Žene koje dijele ljubav prema prirodi, avanturi i ličnom rastu — i stvaraju prijateljstva koja traju.',
          'Women who share a love of nature, adventure and personal growth — and form friendships that last.'
        ),
        icon: 'heart',
      },
      {
        _key: cryptoKey(),
        title: bilingual('Autentičnost', 'Authenticity'),
        text: bilingualText(
          'Bez masovnog turizma. Lokalne vodičice, lokalna gostoprimstva, prava priroda BiH.',
          'No mass tourism. Local guides, local hospitality, the real nature of BiH.'
        ),
        icon: 'mountain',
      },
    ],
    team: [{ _key: cryptoKey(), _type: 'reference', _ref: 'guide-amra' }],
  });

  await createOrReplace('contactPage', {
    _type: 'contactPage',
    title: bilingual('Stupi u kontakt', 'Get in touch'),
    intro: bilingualText(
      'Imaš pitanje o turi ili želiš rezervisati avanturu? Najlakše je da zakažemo kratak razgovor.',
      'Have a question about a tour or want to book an adventure? The easiest path is to schedule a short chat.'
    ),
    email: 'bookings@wildheradventures.ba',
    calendlyUrl: 'https://calendly.com/jasnez/wildher-adventures',
    instagram: 'https://instagram.com/wildheradventures',
    facebook: 'https://facebook.com/wildheradventures',
    responseTime: bilingual('Odgovaramo unutar 24h, ponedjeljkom–petkom.', 'We respond within 24h, Monday to Friday.'),
  });

  await createOrReplace('safetyPage', {
    _type: 'safetyPage',
    title: bilingual('Sigurnost je naš prioritet', 'Safety is our priority'),
    intro: richText(
      [
        'Svaka WildHer tura planira se sa pažljivom procjenom rute, vremena, sastava grupe i nivoa težine. Vodi je licencirana planinska vodičica sa obukom iz prve pomoći i certificiranom opremom za tehničke aktivnosti.',
      ],
      [
        'Every WildHer tour is planned with careful assessment of route, weather, group composition and difficulty level. It is led by a licensed mountain guide with first-aid training and certified equipment for technical activities.',
      ]
    ),
    standards: [
      {
        _key: cryptoKey(),
        heading: bilingual('Mala grupa, individualni pristup', 'Small group, individual attention'),
        description: bilingualText(
          'Maksimalno 10 učesnica po turi (8 na via ferrata, 6 na ekspedicijama). Vodičica može svakoj posvetiti vrijeme.',
          'Maximum 10 participants per tour (8 on via ferrata, 6 on expeditions). The guide can give every woman attention.'
        ),
      },
      {
        _key: cryptoKey(),
        heading: bilingual('Certificirana oprema', 'Certified gear'),
        description: bilingualText(
          'Cjelokupna via ferrata oprema je CE certificirana i provjerava se prije svake ture.',
          'All via ferrata gear is CE certified and checked before every trip.'
        ),
      },
      {
        _key: cryptoKey(),
        heading: bilingual('Procjena vremena i rute', 'Weather and route assessment'),
        description: bilingualText(
          'Pratimo prognozu 48h unaprijed. Ako uslovi nisu sigurni, mijenjamo rutu ili odgađamo turu (bez troška).',
          'We monitor the forecast 48h ahead. If conditions are unsafe, we change the route or postpone (at no cost).'
        ),
      },
      {
        _key: cryptoKey(),
        heading: bilingual('Prva pomoć', 'First aid'),
        description: bilingualText(
          'Vodičica je obučena u prvoj pomoći (WFR, 16-dnevni kurs) i nosi kompletan komplet.',
          'Guide is trained in first aid (WFR, 16-day course) and carries a full kit.'
        ),
      },
    ],
    certifications: [
      bilingual('Licenca turističkog vodiča BiH', 'BiH tourist guide license'),
      bilingual('Wilderness First Responder', 'Wilderness First Responder'),
      bilingual('CE certificirana via ferrata oprema', 'CE certified via ferrata gear'),
    ],
  });

  console.log('\n[seed] Done. Open http://localhost:3000/studio to verify, then visit:');
  console.log('  http://localhost:3000/ture        — 3 real tours');
  console.log('  http://localhost:3000/vodice      — 1 guide');
  console.log('  http://localhost:3000/faq         — 8 FAQs');
  console.log('  http://localhost:3000/sigurnost   — safety page');
  console.log('  http://localhost:3000/kontakt     — contact page\n');
}

seed().catch((err) => {
  console.error('\n[seed] FAILED:', err);
  process.exit(1);
});
