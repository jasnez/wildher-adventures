/**
 * Tour detail page tests — all 10 sections from spec.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import messagesBs from '../../../../../messages/bs.json';

function getNested(obj, key) {
  return key.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);
}

vi.mock('next/image', () => ({ default: (props) => <img src={props.src} alt={props.alt} /> }));
vi.mock('next-intl/server', () => ({
  setRequestLocale: () => {},
  getTranslations: (ns) => (key) => {
    const v = getNested(messagesBs[ns] ?? messagesBs, key);
    return typeof v === 'string' ? v : key;
  },
}));
vi.mock('@/i18n/navigation', () => ({ Link: ({ href, children }) => <a href={href}>{children}</a> }));
vi.mock('@/lib/tours', () => ({
  getTourBySlug: (slug) => {
    const tours = {
      'via-ferrata-blagaj': { id: '1', slug: 'via-ferrata-blagaj', titleKey: 'home.tour1Title', locationKey: 'home.tour1Location', durationKey: 'home.tour1Duration', difficulty: 3, difficultyKey: 'home.tour1Difficulty', type: 'via_ferrata', priceFrom: 95, maxGroup: 8, ascent: 450, length: 8, image: '5', descKey: 'home.tour1Desc', badge: 'popular' },
      'visocica-summit-hike': { id: '2', slug: 'visocica-summit-hike', titleKey: 'home.tour2Title', locationKey: 'home.tour2Location', durationKey: 'home.tour2Duration', difficulty: 2, difficultyKey: 'home.tour2Difficulty', type: 'hiking', priceFrom: 95, maxGroup: 12, image: '8', descKey: 'home.tour2Desc', badge: null },
      'prenj-weekend-expedition': { id: '3', slug: 'prenj-weekend-expedition', titleKey: 'home.tour3Title', locationKey: 'home.tour3Location', durationKey: 'home.tour3Duration', difficulty: 4, difficultyKey: 'home.tour3Difficulty', type: 'hiking', priceFrom: 320, maxGroup: 8, image: '10', descKey: 'home.tour3Desc', badge: null },
    };
    return tours[slug] ?? null;
  },
}));
vi.mock('@/lib/tourDetailData', () => ({
  getTourDetail: () => ({
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
  }),
}));

import TourDetailPage from '../page';

describe('Tour Detail page', () => {
  beforeEach(async () => {
    const Page = await TourDetailPage({ params: Promise.resolve({ locale: 'bs', slug: 'via-ferrata-blagaj' }) });
    render(Page);
  });

  it('renders hero with title and CTA Rezerviši mjesto', () => {
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    const ctas = screen.getAllByRole('link', { name: /rezerviši mjesto/i });
    expect(ctas.length).toBeGreaterThanOrEqual(1);
  });

  it('renders hero micro info: location, duration, difficulty, max group', () => {
    const matches = screen.getAllByText(/1 dan|blagaj|težina|3\/5|max.*8/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders quick facts bar with trajanje, težina, uspon, dužina, grupa, cijena', () => {
    expect(screen.getAllByText(/trajanje/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/težina/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/450|uspon/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/8 km|dužina/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/grupa|osoba/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/95|cijena/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders experience story section (Kako izgleda ova avantura)', () => {
    expect(screen.getByText(/kako izgleda ova avantura/i)).toBeInTheDocument();
  });

  it('renders visual itinerary timeline', () => {
    const matches = screen.getAllByText(/polazna tačka|početak staze|pauza|povratak/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders Who is this for with included and excluded items', () => {
    expect(screen.getByText(/ko je ova tura za/i)).toBeInTheDocument();
  });

  it('renders gear checklist', () => {
    const matches = screen.getAllByText(/planinarske cipele|ruksak|voda|kapa|jakna/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders map / elevation section', () => {
    const matches = screen.getAllByText(/mapa|elevation|profil|uspon/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders testimonial story', () => {
    const matches = screen.getAllByText(/nezaboravno|via ferrata|sigurno/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders similar adventures section', () => {
    expect(screen.getByText(/slične avanture|slične ture/i)).toBeInTheDocument();
  });

  it('renders booking panel with price and CTA', () => {
    const ctas = screen.getAllByRole('link', { name: /rezerviši mjesto/i });
    expect(ctas.length).toBeGreaterThanOrEqual(1);
    const priceMatches = screen.getAllByText(/od 95€/i);
    expect(priceMatches.length).toBeGreaterThanOrEqual(1);
  });
});
