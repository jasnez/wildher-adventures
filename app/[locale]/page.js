import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import OptimizedImage from "@/components/OptimizedImage";
import { Icon } from "@/components/ui";
import { WhySectionIcon } from "@/components/WhySectionIcon";
import { Card, CardImage, CardContent } from "@/components/ui";
import { ButtonLink } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { HomeHeroCTAs, ScrollIndicator } from "@/components/HomeHero";
import { HomeNewsletter } from "@/components/HomeNewsletter";
import {
  getHomePage,
  getFeaturedTours,
  getFeaturedTestimonials,
  getAllDestinations,
  getAllStories,
  getHomeFounderTeaser,
} from "@/lib/sanity/fetch";
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
    sanityDestinations,
    sanityStories,
    founderTeaser,
  ] = await Promise.all([
    getHomePage(),
    getFeaturedTours(),
    getFeaturedTestimonials(),
    getAllDestinations(),
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

  // ---- Why blocks (static i18n — generic marketing copy) -------------------
  const whyBlocks = [
    { titleKey: "why1Title", textKey: "why1Text", icon: "why-users" },
    { titleKey: "why2Title", textKey: "why2Text", icon: "why-backpack" },
    { titleKey: "why3Title", textKey: "why3Text", icon: "why-nature" },
    { titleKey: "why4Title", textKey: "why4Text", icon: "why-care" },
  ];

  // ---- Tours (Sanity featured -> all featured -> mock) ----------------------
  const sanityFeatured = (homeDoc?.featuredTours || featuredTours || []).slice(0, 3);
  const tours = sanityFeatured.length
    ? sanityFeatured.map((tour) => ({
        title: pickLocale(tour.title, locale),
        location: tour.destination ? pickLocale(tour.destination.name, locale) : "",
        duration: tour.durationLabel
          ? pickLocale(tour.durationLabel, locale)
          : `${tour.durationDays} ${locale === "en" ? "day(s)" : "dan(a)"}`,
        difficulty: tour.difficulty,
        price: tour.price,
        currency: tour.currency || "EUR",
        description: pickLocale(tour.shortDescription, locale),
        image: tour.cover || "",
        slug: tour.slug?.current,
      }))
    : null;

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

  // ---- Destinations (Sanity -> static fallback) -----------------------------
  const destinations = sanityDestinations?.length
    ? sanityDestinations.slice(0, 4).map((d) => ({
        name: pickLocale(d.name, locale),
        meta: pickLocale(d.shortDescription, locale).slice(0, 60),
        image: d.heroImage || "",
        slug: d.slug?.current,
      }))
    : [
        { nameKey: "dest1Name", metaKey: "dest1Meta", image: "11" },
        { nameKey: "dest2Name", metaKey: "dest2Meta", image: "12" },
        { nameKey: "dest3Name", metaKey: "dest3Meta", image: "13" },
        { nameKey: "dest4Name", metaKey: "dest4Meta", image: "14" },
      ].map((d) => ({
        name: t(d.nameKey),
        meta: t(d.metaKey),
        image: d.image,
        slug: null,
      }));

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

  const priceFromLabel = tTours("priceFrom");
  const soloFriendlyLabel = tTours("soloFriendly");
  const learnMore = t("learnMore");

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

  // ---- Press strip ---------------------------------------------------------
  const pressMentions = Array.isArray(homeDoc?.pressMentions)
    ? homeDoc.pressMentions.filter((p) => p?.logo)
    : [];

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
          <div className="mt-12 flex flex-wrap justify-center gap-4 md:gap-6">
            {trustBadges.map((label, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-3 rounded-full bg-black/35 border border-white/25 px-4 py-2 md:px-5 md:py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40">
                  <Icon
                    name={trustIcons[i % trustIcons.length]}
                    size={18}
                    className="text-brand-gold-beige"
                  />
                </span>
                <span className="text-[0.78rem] md:text-small font-semibold tracking-wide text-white">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <ScrollIndicator />
      </section>

      {/* 2. WHY WILDHER */}
      <section className="bg-[#f6f1e7] py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-10 flex items-center gap-6">
            <span className="hidden flex-1 border-t border-neutral-200 md:block" />
            <h2 className="font-display text-h1 md:text-3xl font-semibold text-wildher-text text-center">
              {t("whyTitle")}
            </h2>
            <span className="hidden flex-1 border-t border-neutral-200 md:block" />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {whyBlocks.map(({ titleKey, textKey, icon }) => (
              <div key={titleKey} className="flex flex-col items-center text-center gap-3">
                <div
                  className="mb-2 inline-flex items-center justify-center rounded-full bg-[#e8e4dc] p-3 shadow-[0_2px_6px_rgba(0,0,0,0.06)]"
                  style={{
                    ['--why-icon-stroke']: 'var(--color-neutral-700)',
                    ['--why-icon-fill']: '#e8e4dc',
                    ['--why-icon-bird']: 'var(--color-neutral-600)',
                    ['--why-icon-plaster']: '#d4d0c8',
                  }}
                >
                  <WhySectionIcon name={icon} size={44} />
                </div>
                <h3 className="font-display text-h3 font-semibold text-wildher-text">
                  {t(titleKey)}
                </h3>
                <p className="text-small text-wildher-text-muted max-w-[14rem]">
                  {t(textKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED TOURS */}
      {tours && tours.length > 0 && (
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="font-display text-h1 md:text-3xl font-semibold text-wildher-text text-center mb-12">
              {t("toursTitle")}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {tours.map((tour, i) => (
                <Card
                  key={tour.slug || i}
                  className="group rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardImage>
                    <OptimizedImage
                      src={tour.image}
                      alt={tour.title}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </CardImage>
                  <CardContent>
                    {tour.location && (
                      <p className="text-small text-wildher-text-muted mb-1">{tour.location}</p>
                    )}
                    <h3 className="text-h3 font-semibold text-wildher-text mb-3">{tour.title}</h3>
                    <div className="flex flex-wrap gap-3 text-small text-wildher-text-muted mb-3">
                      <span className="flex items-center gap-1">
                        <Icon name="calendar" size={16} />
                        {tour.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="mountain" size={16} />
                        {tour.difficulty}/5
                      </span>
                    </div>
                    <p className="text-small text-wildher-text-muted mb-4 line-clamp-2">
                      {tour.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-brand-primary-green">
                        {priceFromLabel} {tour.price}€
                      </span>
                      <Link
                        href={tour.slug ? `/ture/${tour.slug}` : "/ture"}
                        className="text-small font-semibold text-brand-primary-green hover:underline"
                      >
                        {learnMore} →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
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

      {/* 4b. PRESS STRIP — only renders when Sanity has press mentions */}
      {pressMentions.length > 0 && (
        <section className="py-10 md:py-14 bg-white border-y border-neutral-200">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <p className="text-caption uppercase tracking-wide text-wildher-text-muted text-center mb-6">
              {t("pressTitle")}
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-70">
              {pressMentions.map((p, i) => {
                const inner = (
                  <OptimizedImage
                    src={p.logo}
                    alt={p.name || ""}
                    sizes="120px"
                    className="h-8 md:h-10 w-auto object-contain"
                  />
                );
                return (
                  <li key={i}>
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={p.name}
                        className="hover:opacity-100 transition-opacity"
                      >
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* 5. MEET THE FOUNDER */}
      <section className="py-16 md:py-24 bg-[#fafaf9]">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="rounded-xl overflow-hidden shadow-card aspect-[4/3] md:aspect-[16/10]">
              <OptimizedImage
                {...(founderPhoto ? { src: founderPhoto } : { name: "2" })}
                alt={founderName || "Osnivačica WildHer Adventures"}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-h1 md:text-3xl font-semibold text-wildher-text mb-6 text-left">
                {t("aboutTitle")}
              </h2>
              {founderExcerpt ? (
                <p className="text-body text-wildher-text mb-8 text-left">
                  {founderExcerpt}
                </p>
              ) : (
                <>
                  <p className="text-body text-wildher-text mb-6 text-left">
                    {t("aboutText1")}
                  </p>
                  <p className="text-body text-wildher-text mb-8 text-left">
                    {t("aboutText2")}
                  </p>
                </>
              )}
              <ButtonLink
                href="/o-nama"
                variant="primary"
                size="md"
                className="inline-flex items-center gap-2 bg-brand-earth-tone hover:bg-brand-earth-tone/90 text-white shadow-button"
              >
                {t("aboutCta")}
                <Icon name="plus" size={18} className="text-white" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EXPLORE DESTINATIONS */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="font-display text-h1 md:text-3xl font-semibold text-wildher-text text-center mb-10">
            {t("destinationsTitle")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {destinations.map((dest, i) => (
              <Link
                key={dest.slug || i}
                href={dest.slug ? `/destinacije/${dest.slug}` : "/destinacije"}
                className="group block rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] relative">
                  <OptimizedImage
                    src={dest.image}
                    alt={dest.name}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                    <p className="font-semibold text-sm md:text-body">{dest.name}</p>
                    {dest.meta && <p className="text-small text-white/90">{dest.meta}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-center mt-8">
            <Link
              href="/destinacije"
              className="text-body font-semibold text-wildher-text hover:text-brand-primary-green transition-colors"
            >
              {t("destinationsCta")} →
            </Link>
          </p>
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
                className="group rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-card overflow-hidden"
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

      {/* 9. FINAL CTA */}
      <section className="relative py-24 md:py-32">
        <OptimizedImage
          name="9"
          alt=""
          aria-hidden
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          <h2 className="font-display text-h2 md:text-4xl font-semibold text-white mb-8 max-w-2xl">
            {t("finalCtaTitle")}
          </h2>
          <ButtonLink href="/ture" variant="primary" size="lg" className="bg-primary-600 hover:bg-primary-700">
            {t("finalCtaButton")}
          </ButtonLink>
        </div>
      </section>
    </main>
    </>
  );
}
