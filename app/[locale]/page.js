import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import OptimizedImage from "@/components/OptimizedImage";
import { Icon } from "@/components/ui";
import { Card, CardImage, CardContent } from "@/components/ui";
import { ButtonLink } from "@/components/ui";
import { TourCard } from "@/components/tours";
import { Link } from "@/i18n/navigation";
import { HomeHeroCTAs, ScrollIndicator } from "@/components/HomeHero";
import { HomeNewsletter } from "@/components/HomeNewsletter";
import {
  getHomePage,
  getFeaturedTours,
  getFeaturedTestimonials,
  getAllStories,
  getHomeFounderTeaser,
} from "@/lib/sanity/fetch";
import { mapTourCard } from "@/lib/sanity/adapters";
import {
  travelAgencyJsonLd,
  serializeJsonLd,
} from "@/lib/seo/structuredData";

function pickLocale(value, locale) {
  if (!value || typeof value !== "object") return "";
  return (locale === "en" && value.en) || value.bs || "";
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const title = locale === "bs"
    ? "WildHer Adventures — ženske outdoor ture u BiH"
    : "WildHer Adventures — Women-only outdoor adventures in Bosnia and Herzegovina";
  const description = locale === "bs"
    ? "Planinarenje samo za žene, via ferrata i ekspedicije kroz planine Bosne i Hercegovine. Licencirani vodič, male grupe."
    : "Women-only hiking tours, via ferrata and expeditions in Bosnia and Herzegovina. Licensed guide, small groups.";
  return { title, description };
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tTours = await getTranslations("tours");

  const [
    homeDoc,
    featuredTours,
    featuredTestimonials,
    sanityStories,
    founderTeaser,
  ] = await Promise.all([
    getHomePage(),
    getFeaturedTours(),
    getFeaturedTestimonials(),
    getAllStories(),
    getHomeFounderTeaser(),
  ]);

  // ---- Hero / trust badges --------------------------------------------------
  const heroTitle = pickLocale(homeDoc?.heroTitle, locale) || t("title");
  const heroSubtitle = pickLocale(homeDoc?.heroSubtitle, locale) || t("subtitle");
  const trustBadgesFromCms = Array.isArray(homeDoc?.trustBadges)
    ? homeDoc.trustBadges.map((b) => pickLocale(b, locale)).filter(Boolean)
    : null;
  const trustBadges = trustBadgesFromCms?.length
    ? trustBadgesFromCms
    : [t("trust1"), t("trust2"), t("trust3")];
  const trustIcons = ["users", "shield", "zap", "heart"];

  // ---- Tours (Sanity featured -> getFeaturedTours -> none) ----------------
  // Shape data through mapTourCard so /ture and home featured tours share
  // the same TourCard component (badges, rating pill, difficulty dots).
  const fallbackTourDurationLabel = (days) => {
    if (days <= 1) return tTours("duration1day");
    if (days <= 2) return tTours("durationWeekend");
    if (days <= 5) return tTours("duration3to5");
    return tTours("duration5plus");
  };
  const tourDifficultyLookup = (key) => tTours(key);

  const sanityFeatured = (homeDoc?.featuredTours || featuredTours || []).slice(0, 3);
  const tours = sanityFeatured.length
    ? sanityFeatured.map((tour) =>
        mapTourCard(tour, locale, tourDifficultyLookup, fallbackTourDurationLabel)
      )
    : null;

  const tourCardBadgeLabels = {
    popular: tTours("badgePopular"),
    new: tTours("badgeNew"),
    coming: tTours("badgeComing"),
  };
  const tourCardCtaLabel = tTours("ctaDetailsBooking");

  // ---- Testimonials (Sanity featured -> founder vision fallback) ----------
  // Pre-launch: until we have real participant reviews, fall back to a
  // single founder-vision quote rather than fabricated testimonials.
  const sanityTestimonials = Array.isArray(featuredTestimonials)
    ? featuredTestimonials.slice(0, 3)
    : [];
  const testimonials = sanityTestimonials.length
    ? sanityTestimonials.map((t) => ({
        quote: pickLocale(t.quote, locale),
        author: `${t.authorName}${t.authorCity ? `, ${t.authorCity}` : ""}`,
      }))
    : [
        {
          quote: t("founderVisionQuote"),
          author: t("founderVisionAuthor"),
        },
      ];

  // ---- Stories (Sanity stories -> static fallback) -------------------------
  const stories = sanityStories?.length
    ? sanityStories.slice(0, 3).map((s) => ({
        title: pickLocale(s.title, locale),
        excerpt: pickLocale(s.excerpt, locale),
        image: s.coverImage || "",
        slug: s.slug?.current,
      }))
    : [
        { titleKey: "blog1Title", excerptKey: "blog1Excerpt", image: "17" },
        { titleKey: "blog2Title", excerptKey: "blog2Excerpt", image: "18" },
        { titleKey: "blog3Title", excerptKey: "blog3Excerpt", image: "19" },
      ].map((b) => ({
        title: t(b.titleKey),
        excerpt: t(b.excerptKey),
        image: b.image,
        slug: null,
      }));

  const soloFriendlyLabel = tTours("soloFriendly");
  const priceFromLabel = tTours("priceFrom");

  // ---- Founder teaser (Sanity aboutPage + lead guide) ----------------------
  function blocksFirstParagraph(richText) {
    const blocks =
      richText && typeof richText === "object"
        ? (locale === "en" && Array.isArray(richText.en) ? richText.en : richText.bs) || null
        : null;
    if (!Array.isArray(blocks) || blocks.length === 0) return null;
    const first = blocks.find((b) => b?._type === "block" && Array.isArray(b.children));
    if (!first) return null;
    return first.children.map((c) => c.text || "").join("");
  }
  const founderExcerpt = blocksFirstParagraph(founderTeaser?.founderStory);
  const founderPhoto = founderTeaser?.founderPhoto || null;
  const founderName = founderTeaser?.founderName || null;

  const homeJsonLd = travelAgencyJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(homeJsonLd) }}
      />
      <main id="main-content" className="min-h-screen">
      {/* 1. HERO */}
      <section className="relative min-h-screen flex flex-col justify-end">
        {homeDoc?.heroImage ? (
          <OptimizedImage
            src={homeDoc.heroImage}
            alt="WildHer Adventures hero"
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover"
            priority
          />
        ) : (
          <Image
            src="/hero-mountains.png"
            alt="Planine BiH — WildHer Adventures"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight">
            {heroTitle}
          </h1>
          <p className="text-body-lg md:text-xl text-white/95 max-w-2xl mb-10">
            {heroSubtitle}
          </p>
          <HomeHeroCTAs />
        </div>
        <ScrollIndicator />
      </section>

      {/* 2. TRUST STRIP */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-6 md:py-7">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-10">
            {trustBadges.map((label, i) => (
              <li key={i} className="inline-flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary-green/10">
                  <Icon
                    name={trustIcons[i % trustIcons.length]}
                    size={16}
                    className="text-brand-primary-green"
                  />
                </span>
                <span className="text-small font-semibold tracking-wide text-wildher-text">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. FOUNDER MINI — renders only when Sanity has founderName + founderPhoto + founderStory */}
      {founderName && founderPhoto && founderExcerpt && (
        <section className="py-12 md:py-16 bg-white">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-[180px_1fr] md:gap-10 items-center">
              <div className="rounded-full overflow-hidden aspect-square w-32 md:w-[180px] mx-auto md:mx-0 shadow-card">
                <OptimizedImage
                  src={founderPhoto}
                  alt={founderName}
                  sizes="(max-width: 768px) 128px, 180px"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <p className="text-caption uppercase tracking-wide text-brand-primary-green font-semibold mb-2">
                  {t("aboutTitle")}
                </p>
                <h2 className="font-display text-h2 md:text-h1 font-semibold text-wildher-text mb-3">
                  {founderName}
                </h2>
                <p className="text-body text-wildher-text-muted mb-4">
                  {founderExcerpt}
                </p>
                <Link
                  href="/o-nama"
                  className="inline-flex items-center gap-1 text-body font-semibold text-brand-primary-green hover:text-brand-primary-green-hover transition-colors"
                >
                  {t("aboutCta")} →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED TOURS */}
      {tours && tours.length > 0 && (
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="font-display text-h1 md:text-3xl font-semibold text-wildher-text text-center mb-12">
              {t("toursTitle")}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {tours.map((tour) => (
                <TourCard
                  key={tour.id || tour.slug}
                  tour={tour}
                  ctaLabel={tourCardCtaLabel}
                  priceFromLabel={priceFromLabel}
                  soloFriendlyLabel={soloFriendlyLabel}
                  badgeLabels={tourCardBadgeLabels}
                />
              ))}
            </div>
            <div className="text-center mt-10">
              <ButtonLink href="/ture" variant="outline" size="md">
                {t("toursCta")} →
              </ButtonLink>
            </div>
          </div>
        </section>
      )}

      {/* 4. TESTIMONIALS + STATS */}
      <section className="relative py-16 md:py-24">
        <Image
          src="/testimonials-bg.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-charcoal/70" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-6 text-center text-brand-off-white">
          <h2 className="font-display text-h1 md:text-3xl font-semibold mb-12">
            {t("testimonialsTitle")}
          </h2>
          <div className="space-y-10 mb-14">
            {testimonials.map((tm, i) => (
              <blockquote key={i}>
                <p className="text-body-lg md:text-xl italic mb-4">&ldquo;{tm.quote}&rdquo;</p>
                <footer className="text-small text-brand-off-white/80">— {tm.author}</footer>
              </blockquote>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-brand-gold-beige">{t("statWomen")}</p>
              <p className="text-small text-brand-off-white/80">{t("statWomenLabel")}</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-brand-gold-beige">{t("statTours")}</p>
              <p className="text-small text-brand-off-white/80">{t("statToursLabel")}</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-brand-gold-beige">{t("statRating")}</p>
              <p className="text-small text-brand-off-white/80">{t("statRatingLabel")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BLOG / JOURNAL */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="font-display text-h1 md:text-3xl font-semibold text-wildher-text text-center mb-12">
            {t("blogTitle")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {stories.map((post, i) => (
              <Card
                key={post.slug || i}
                className="group rounded-radius-card-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-card overflow-hidden"
              >
                <CardImage>
                  <OptimizedImage
                    src={post.image}
                    alt={post.title}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </CardImage>
                <CardContent>
                  <h3 className="text-h3 font-semibold text-wildher-text mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-small text-wildher-text-muted line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <Link
                    href={post.slug ? `/blog/${post.slug}` : "/blog"}
                    className="text-small font-semibold text-brand-primary-green hover:underline"
                  >
                    {t("readMore")} →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <ButtonLink href="/blog" variant="outline" size="md">
              {t("blogCta")} →
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="py-16 md:py-24 bg-brand-charcoal text-brand-off-white relative">
        <OptimizedImage
          name="6"
          alt=""
          aria-hidden
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-brand-charcoal/85" />
        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-display text-h2 md:text-h1 font-semibold text-white mb-4">
            {t("newsletterTitle")}
          </h2>
          <p className="text-body text-white/90 mb-8">{t("newsletterText")}</p>
          <HomeNewsletter />
          <p className="text-caption text-white/70 mt-4">{t("newsletterMicro")}</p>
        </div>
      </section>

    </main>
    </>
  );
}
