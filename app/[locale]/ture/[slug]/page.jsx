import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Icon } from '@/components/ui';
import { ShareButton } from '@/components/ShareButton';
import { getTourBySlug } from '@/lib/tours';
import { getTourDetail } from '@/lib/tourDetailData';
import { getTourBySlugFromCms } from '@/lib/sanity/fetch';
import { mapTourDetail } from '@/lib/sanity/adapters';
import { resolveKey } from '@/lib/i18nKeys';
import {
  tourJsonLd,
  serializeJsonLd,
  absoluteUrl,
} from '@/lib/seo/structuredData';
import {
  TourDetailHero,
  QuickFactsBar,
  ExperienceStory,
  VisualItinerary,
  WhoIsFor,
  GearChecklist,
  MapElevation,
  TestimonialStory,
  SimilarAdventures,
  BookingPanel,
  MobileBookingBar,
} from '@/components/tour-detail';

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const tour = await getTourBySlugFromCms(slug);
  if (!tour) {
    return { title: 'WildHer Adventures' };
  }
  const title =
    (locale === 'en' && tour.title?.en) || tour.title?.bs || 'WildHer Adventures';
  const description =
    (locale === 'en' && tour.shortDescription?.en) ||
    tour.shortDescription?.bs ||
    undefined;
  const cover = tour.cover ? absoluteUrl(tour.cover) : undefined;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wildheradventures.ba'}${
    locale === 'en' ? '/en' : ''
  }/ture/${slug}`;
  return {
    title: `${title} — WildHer Adventures`,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'WildHer Adventures',
      locale: locale === 'en' ? 'en_GB' : 'bs_BA',
      images: cover ? [{ url: cover, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: cover ? [cover] : undefined,
    },
    alternates: {
      canonical: url,
      languages: {
        bs: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wildheradventures.ba'}/ture/${slug}`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wildheradventures.ba'}/en/ture/${slug}`,
      },
    },
  };
}

function buildBookHref(tTourDetail, title) {
  const mailSubject = encodeURIComponent(`${tTourDetail('mailSubjectPrefix')}: ${title}`);
  return `mailto:bookings@wildheradventures.ba?subject=${mailSubject}`;
}

async function renderFromSanity({ slug, locale, tTourDetail, tTours, tHome, t }) {
  const sanityTour = await getTourBySlugFromCms(slug);
  if (!sanityTour) return null;

  const fallbackDurationLabel = (days) => {
    if (days <= 1) return t('duration1day');
    if (days <= 2) return t('durationWeekend');
    if (days <= 5) return t('duration3to5');
    return t('duration5plus');
  };
  const difficultyLookup = (key) => t(key);
  const detail = mapTourDetail(sanityTour, locale, difficultyLookup, fallbackDurationLabel);

  // When a Payment Link URL is set on the tour (PayPal, Stripe, Monri, …),
  // the Book CTA opens that checkout directly. Otherwise it falls back to the
  // mailto: pattern from the Stage-1 booking model.
  const hasPaymentLink = Boolean(detail.paymentLinkUrl);
  const bookCta = hasPaymentLink
    ? tTourDetail('bookCtaDeposit')
    : tTourDetail('bookCta');
  const bookHref = hasPaymentLink
    ? detail.paymentLinkUrl
    : buildBookHref(tTourDetail, detail.title);
  const bookCtaNote = hasPaymentLink
    ? tTourDetail('bookCtaDepositNote')
    : tTourDetail('bookCtaMailNote');

  const quickFactsLabels = {
    duration: tTourDetail('quickFacts.duration'),
    difficulty: tTourDetail('quickFacts.difficulty'),
    ascent: tTourDetail('quickFacts.ascent'),
    length: tTourDetail('quickFacts.length'),
    group: tTourDetail('quickFacts.group'),
    groupPeople: tTourDetail('people'),
    price: tTourDetail('quickFacts.price'),
    priceFrom: tTourDetail('priceFrom'),
  };

  // Find the earliest upcoming departure. If none are 'open' or 'almost_full',
  // treat the tour as sold-out (or, if there are no future dates at all, "by request").
  const upcomingDate = detail.availableDates
    .filter((d) => d.status !== 'cancelled')
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  const status = upcomingDate?.status ?? 'by_request';
  const spotsLeftText = upcomingDate?.spotsLeft
    ? tTourDetail('spotsLeft', { count: upcomingDate.spotsLeft })
    : null;
  const statusLabelKey =
    status === 'sold_out'
      ? 'statusSoldOut'
      : status === 'almost_full'
        ? 'statusAlmostFull'
        : status === 'waitlist'
          ? 'statusWaitlist'
          : status === 'by_request'
            ? 'statusByRequest'
            : null;
  const statusLabel = statusLabelKey ? tTourDetail(statusLabelKey) : null;
  const nextDateText = upcomingDate?.startDate
    ? new Date(upcomingDate.startDate).toLocaleDateString(
        locale === 'en' ? 'en-GB' : 'bs-BA',
        { day: 'numeric', month: 'long', year: 'numeric' }
      )
    : null;

  const featuredTestimonial = detail.testimonials[0];

  const trustItems = [tHome('trust1'), tHome('trust2'), tHome('trust3')];
  const bookingGroupText = tTourDetail('heroGroupMax', { count: detail.maxGroup });

  const jsonLd = tourJsonLd(detail, locale === 'en' ? 'en' : 'bs');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <main id="main-content" className="min-h-screen pb-24 lg:pb-0">
      <TourDetailHero
        title={detail.title}
        subtitle={detail.subtitle}
        location={detail.location}
        duration={detail.duration}
        difficultyLabel={detail.difficultyLabel}
        difficultyPrefix={tTourDetail('quickFacts.difficulty')}
        maxGroup={detail.maxGroup}
        maxGroupLabel={tTourDetail('heroGroupMax', { count: detail.maxGroup })}
        imageName={detail.image}
        bookCta={bookCta}
        bookHref={bookHref}
        bookHrefIsExternal={hasPaymentLink}
      />

      <QuickFactsBar
        duration={detail.duration}
        difficultyLabel={detail.difficultyLabel}
        ascent={detail.elevationM}
        length={detail.lengthKm}
        group={detail.maxGroup}
        priceFrom={detail.priceFrom}
        labels={quickFactsLabels}
      />

      <div className="flex flex-col lg:flex-row lg:items-start gap-8 max-w-6xl mx-auto px-4 py-8">
        <div className="flex-1 min-w-0">
          <div className="flex justify-end mb-4">
            <ShareButton
              title={detail.title}
              label={tTourDetail('share')}
              copiedLabel={tTourDetail('shareCopied')}
            />
          </div>
          {detail.experienceStory && (
            <ExperienceStory
              title={tTourDetail('experienceTitle')}
              storyText={
                Array.isArray(detail.experienceStory)
                  ? blocksToPlainText(detail.experienceStory)
                  : detail.subtitle
              }
              imageName={detail.gallery[0] || detail.image}
              ctaLabel={tTourDetail('experienceCta')}
              ctaHref="#booking"
            />
          )}

          {detail.guide && (
            <section className="my-12 rounded-card-lg border border-neutral-200 bg-white p-6 shadow-card">
              <p className="text-caption uppercase tracking-wide text-brand-primary-green font-semibold mb-3">
                {tTourDetail('yourGuide')}
              </p>
              <Link
                href={`/vodice/${detail.guide.slug}`}
                className="flex items-center gap-4 group"
              >
                {detail.guide.photo && (
                  <span className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img
                      src={`${detail.guide.photo}?w=128&h=128&fit=crop&auto=format`}
                      alt={detail.guide.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </span>
                )}
                <span className="flex-1">
                  <span className="block text-h3 font-semibold text-wildher-text group-hover:text-brand-primary-green transition-colors">
                    {detail.guide.name}
                  </span>
                  {detail.guide.role && (
                    <span className="block text-small text-wildher-text-muted">
                      {detail.guide.role}
                    </span>
                  )}
                </span>
                <span className="text-small font-semibold text-brand-primary-green hidden sm:inline-block">
                  {tTourDetail('viewGuideProfile')} →
                </span>
              </Link>
            </section>
          )}

          {detail.destination && (
            <Link
              href={`/destinacije/${detail.destination.slug}`}
              className="my-12 flex items-center justify-between gap-4 rounded-card-lg border border-neutral-200 bg-white p-6 shadow-card hover:border-brand-primary-green transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-green focus-visible:ring-offset-2"
            >
              <span className="min-w-0">
                <span className="block text-caption uppercase tracking-wide text-brand-primary-green font-semibold mb-1">
                  {tTourDetail('exploreArea')}
                </span>
                <span className="block text-h3 font-semibold text-wildher-text group-hover:text-brand-primary-green transition-colors">
                  {detail.destination.name}
                </span>
              </span>
              <Icon name="map-pin" size={24} className="text-brand-primary-green shrink-0" />
            </Link>
          )}

          {detail.itinerary.length > 0 && (
            <VisualItinerary
              steps={detail.itinerary.map((s) => ({
                label: s.label,
                time: s.time,
                description: s.description,
                image: s.image || detail.image,
              }))}
            />
          )}

          {(detail.whoIsForIncluded.length > 0 || detail.whoIsForExcluded.length > 0) && (
            <WhoIsFor
              title={tTourDetail('whoIsForTitle')}
              included={detail.whoIsForIncluded}
              excluded={detail.whoIsForExcluded}
              imageName={detail.image}
            />
          )}

          {detail.whatToBring.length > 0 && (
            <GearChecklist
              title={tTourDetail('gearTitle')}
              items={detail.whatToBring.map((label, i) => ({ key: `gear-${i}`, label }))}
            />
          )}

          {(detail.mapImage || detail.gpxFile) && (
            <MapElevation
              title={tTourDetail('mapElevationTitle')}
              placeholder={tTourDetail('mapComingSoon')}
              showDetailsLabel={tTourDetail('mapShowDetails')}
            />
          )}

          {featuredTestimonial && (
            <TestimonialStory
              quote={featuredTestimonial.quote}
              author={`${featuredTestimonial.author}${featuredTestimonial.city ? `, ${featuredTestimonial.city}` : ''}`}
              imageName={featuredTestimonial.photo || detail.image}
            />
          )}

          {detail.similarTours.length > 0 && (
            <SimilarAdventures
              title={tTourDetail('similarTitle')}
              tours={detail.similarTours}
              ctaDetailsLabel={tTours('ctaDetailsBooking')}
              priceFromLabel={tTours('priceFrom')}
              soloFriendlyLabel={tTours('soloFriendly')}
              badgeLabels={{
                popular: tTours('badgePopular'),
                new: tTours('badgeNew'),
                coming: tTours('badgeComing'),
              }}
            />
          )}
        </div>

        <BookingPanel
          priceFrom={hasPaymentLink && detail.deposit ? detail.deposit : detail.priceFrom}
          priceLabel={tTourDetail('priceFrom')}
          spotsLeft={spotsLeftText}
          nextDateText={nextDateText}
          nextDateLabel={tTourDetail('nextDateLabel')}
          dateFallback={tTourDetail('dateByRequest')}
          groupText={bookingGroupText}
          bookCta={bookCta}
          bookHref={bookHref}
          bookCtaNote={bookCtaNote}
          isExternalPayment={hasPaymentLink}
          status={status}
          statusLabel={statusLabel}
          trustItems={trustItems}
        />
      </div>

      <MobileBookingBar
        priceFrom={hasPaymentLink && detail.deposit ? detail.deposit : detail.priceFrom}
        priceLabel={tTourDetail('priceFrom')}
        bookCta={bookCta}
        bookHref={bookHref}
        isExternalPayment={hasPaymentLink}
        status={status}
        statusLabel={statusLabel}
      />
    </main>
    </>
  );
}

function blocksToPlainText(blocks) {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map((b) => {
      if (b?._type === 'block' && Array.isArray(b.children)) {
        return b.children.map((c) => c.text || '').join('');
      }
      return '';
    })
    .filter(Boolean)
    .join('\n\n');
}

async function renderFromMock({ slug, locale, tTourDetail, tHome, tTours }) {
  const tour = getTourBySlug(slug);
  if (!tour) return null;

  const title = resolveKey({ home: tHome, tours: tTours }, tour.titleKey) || tHome(tour.titleKey);
  const location = resolveKey({ home: tHome, tours: tTours }, tour.locationKey) || tHome(tour.locationKey);
  const duration = resolveKey({ home: tHome, tours: tTours }, tour.durationKey) || tHome(tour.durationKey);
  const difficultyLabel = resolveKey({ home: tHome, tours: tTours }, tour.difficultyKey) || `${tour.difficulty}/5`;
  const detail = getTourDetail(slug);
  const subtitle = tTourDetail(detail.subtitleKey);
  const experienceStory = tTourDetail(detail.experienceStoryKey);
  const bookCta = tTourDetail('bookCta');
  const bookHref = buildBookHref(tTourDetail, title);

  const itinerarySteps = detail.itinerary.map((step) => ({
    label: tTourDetail(step.labelKey),
    image: step.image,
  }));
  const whoIncluded = detail.whoIsForIncludedKeys.map((k) => tTourDetail(k));
  const whoExcluded = detail.whoIsForExcludedKeys.map((k) => tTourDetail(k));
  const gearItems = detail.gearKeys.map((k) => ({ key: k, label: tTourDetail(k) }));
  // Pre-launch mock tours have no real dates or reviews: no fabricated
  // scarcity, and availability is by request.
  const spotsLeft = null;
  const mockStatus = 'by_request';
  const mockStatusLabel = tTourDetail('statusByRequest');
  const trustItems = [tHome('trust1'), tHome('trust2'), tHome('trust3')];
  const bookingGroupText = tTourDetail('heroGroupMax', { count: tour.maxGroup ?? 8 });

  const similarTours = (detail.similarSlugs || [])
    .map((s) => getTourBySlug(s))
    .filter(Boolean)
    .map((t) => ({
      title: resolveKey({ home: tHome, tours: tTours }, t.titleKey) || tHome(t.titleKey),
      location: resolveKey({ home: tHome, tours: tTours }, t.locationKey) || tHome(t.locationKey),
      duration: resolveKey({ home: tHome, tours: tTours }, t.durationKey) || tHome(t.durationKey),
      difficulty: t.difficulty,
      difficultyLabel: resolveKey({ home: tHome, tours: tTours }, t.difficultyKey) || tTours(t.difficultyKey),
      priceFrom: t.priceFrom,
      description: t.descKey ? resolveKey({ home: tHome, tours: tTours }, t.descKey) : '',
      image: t.image,
      badge: t.badge,
      slug: t.slug,
    }));

  const quickFactsLabels = {
    duration: tTourDetail('quickFacts.duration'),
    difficulty: tTourDetail('quickFacts.difficulty'),
    ascent: tTourDetail('quickFacts.ascent'),
    length: tTourDetail('quickFacts.length'),
    group: tTourDetail('quickFacts.group'),
    groupPeople: tTourDetail('people'),
    price: tTourDetail('quickFacts.price'),
    priceFrom: tTourDetail('priceFrom'),
  };

  return (
    <main id="main-content" className="min-h-screen pb-24 lg:pb-0">
      <TourDetailHero
        title={title}
        subtitle={subtitle}
        location={location}
        duration={duration}
        difficultyLabel={difficultyLabel}
        difficultyPrefix={tTourDetail('quickFacts.difficulty')}
        maxGroup={tour.maxGroup ?? 8}
        maxGroupLabel={tTourDetail('heroGroupMax', { count: tour.maxGroup ?? 8 })}
        imageName={tour.image}
        bookCta={bookCta}
        bookHref={bookHref}
      />

      <QuickFactsBar
        duration={duration}
        difficultyLabel={difficultyLabel}
        ascent={tour.ascent}
        length={tour.length}
        group={tour.maxGroup}
        priceFrom={tour.priceFrom}
        labels={quickFactsLabels}
      />

      <div className="flex flex-col lg:flex-row lg:items-start gap-8 max-w-6xl mx-auto px-4 py-8">
        <div className="flex-1 min-w-0">
          <div className="flex justify-end mb-4">
            <ShareButton
              title={title}
              label={tTourDetail('share')}
              copiedLabel={tTourDetail('shareCopied')}
            />
          </div>
          <ExperienceStory
            title={tTourDetail('experienceTitle')}
            storyText={experienceStory}
            imageName={detail.experienceImage}
            ctaLabel={tTourDetail('experienceCta')}
            ctaHref={bookHref}
          />

          <VisualItinerary steps={itinerarySteps} />

          <WhoIsFor
            title={tTourDetail('whoIsForTitle')}
            included={whoIncluded}
            excluded={whoExcluded}
            imageName={tour.image}
          />

          <GearChecklist title={tTourDetail('gearTitle')} items={gearItems} />

          <MapElevation
            title={tTourDetail('mapElevationTitle')}
            placeholder={tTourDetail('mapComingSoon')}
            showDetailsLabel={tTourDetail('mapShowDetails')}
          />

          <SimilarAdventures
            title={tTourDetail('similarTitle')}
            tours={similarTours}
            ctaDetailsLabel={tTours('ctaDetailsBooking')}
            priceFromLabel={tTours('priceFrom')}
            soloFriendlyLabel={tTours('soloFriendly')}
            badgeLabels={{
              popular: tTours('badgePopular'),
              new: tTours('badgeNew'),
              coming: tTours('badgeComing'),
            }}
          />
        </div>

        <BookingPanel
          priceFrom={tour.priceFrom}
          priceLabel={tTourDetail('priceFrom')}
          spotsLeft={spotsLeft}
          nextDateText={null}
          dateFallback={tTourDetail('dateByRequest')}
          groupText={bookingGroupText}
          bookCta={bookCta}
          bookHref={bookHref}
          bookCtaNote={tTourDetail('bookCtaMailNote')}
          status={mockStatus}
          statusLabel={mockStatusLabel}
          trustItems={trustItems}
        />
      </div>

      <MobileBookingBar
        priceFrom={tour.priceFrom}
        priceLabel={tTourDetail('priceFrom')}
        bookCta={bookCta}
        bookHref={bookHref}
        status={mockStatus}
        statusLabel={mockStatusLabel}
      />
    </main>
  );
}

export default async function TourDetailPage({ params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tTourDetail = await getTranslations('tourDetail');
  const tHome = await getTranslations('home');
  const tTours = await getTranslations('tours');

  const sanityResult = await renderFromSanity({ slug, locale, tTourDetail, tTours, tHome, t: tTours });
  if (sanityResult) return sanityResult;

  const mockResult = await renderFromMock({ slug, locale, tTourDetail, tHome, tTours });
  if (mockResult) return mockResult;

  notFound();
}
