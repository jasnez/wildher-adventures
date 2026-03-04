import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import OptimizedImage from "@/components/OptimizedImage";
import { Icon } from "@/components/ui";
import { WhySectionIcon } from "@/components/WhySectionIcon";
import { Card, CardImage, CardContent, CardFeature } from "@/components/ui";
import { ButtonLink } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { HomeHeroCTAs, ScrollIndicator } from "@/components/HomeHero";
import { HomeNewsletter } from "@/components/HomeNewsletter";

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

  const whyBlocks = [
    { titleKey: "why1Title", textKey: "why1Text", icon: "why-users" },
    { titleKey: "why2Title", textKey: "why2Text", icon: "why-backpack" },
    { titleKey: "why3Title", textKey: "why3Text", icon: "why-nature" },
    { titleKey: "why4Title", textKey: "why4Text", icon: "why-care" },
  ];

  const tours = [
    { titleKey: "tour1Title", locationKey: "tour1Location", durationKey: "tour1Duration", difficultyKey: "tour1Difficulty", groupKey: "tour1Group", priceKey: "tour1Price", descKey: "tour1Desc", image: "5" },
    { titleKey: "tour2Title", locationKey: "tour2Location", durationKey: "tour2Duration", difficultyKey: "tour2Difficulty", groupKey: "tour2Group", priceKey: "tour2Price", descKey: "tour2Desc", image: "8" },
    { titleKey: "tour3Title", locationKey: "tour3Location", durationKey: "tour3Duration", difficultyKey: "tour3Difficulty", groupKey: "tour3Group", priceKey: "tour3Price", descKey: "tour3Desc", image: "10" },
  ];

  const testimonials = [
    { quoteKey: "testimonial1Quote", authorKey: "testimonial1Author" },
    { quoteKey: "testimonial2Quote", authorKey: "testimonial2Author" },
    { quoteKey: "testimonial3Quote", authorKey: "testimonial3Author" },
  ];

  const destinations = [
    { nameKey: "dest1Name", metaKey: "dest1Meta", image: "11" },
    { nameKey: "dest2Name", metaKey: "dest2Meta", image: "12" },
    { nameKey: "dest3Name", metaKey: "dest3Meta", image: "13" },
    { nameKey: "dest4Name", metaKey: "dest4Meta", image: "14" },
    { nameKey: "dest5Name", metaKey: "dest5Meta", image: "15" },
    { nameKey: "dest6Name", metaKey: "dest6Meta", image: "16" },
  ];

  const blogPosts = [
    { titleKey: "blog1Title", excerptKey: "blog1Excerpt", image: "17" },
    { titleKey: "blog2Title", excerptKey: "blog2Excerpt", image: "18" },
    { titleKey: "blog3Title", excerptKey: "blog3Excerpt", image: "19" },
  ];

  const instagramImages = ["20", "21", "22", "23", "1", "2", "3", "4", "5"];

  return (
    <main id="main-content" className="min-h-screen">
      {/* 1. HERO */}
      <section className="relative min-h-screen flex flex-col justify-end">
        <Image
          src="/hero-mountains.png"
          alt="Planine BiH — WildHer Adventures"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight">
            {t("title")}
          </h1>
          <p className="text-body-lg md:text-xl text-white/95 max-w-2xl mb-10">
            {t("subtitle")}
          </p>
          <HomeHeroCTAs />
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-12 text-white/90 text-small">
            <span className="flex items-center gap-2">
              <Icon name="check" size={18} className="text-brand-gold-beige" />
              {t("trust1")}
            </span>
            <span className="flex items-center gap-2">
              <Icon name="check" size={18} className="text-brand-gold-beige" />
              {t("trust2")}
            </span>
            <span className="flex items-center gap-2">
              <Icon name="check" size={18} className="text-brand-gold-beige" />
              {t("trust3")}
            </span>
          </div>
        </div>
        <ScrollIndicator />
      </section>

      {/* 2. ZAŠTO WILDHER */}
      <section className="bg-[#f6f1e7] py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          {/* Naslov sa tankim linijama lijevo/desno */}
          <div className="mb-10 flex items-center gap-6">
            <span className="hidden flex-1 border-t border-neutral-200 md:block" />
            <h2 className="font-display text-h1 md:text-3xl font-semibold text-wildher-text text-center">
              {t("whyTitle")}
            </h2>
            <span className="hidden flex-1 border-t border-neutral-200 md:block" />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {whyBlocks.map(({ titleKey, textKey, icon }) => (
              <div
                key={titleKey}
                className="flex flex-col items-center text-center gap-3"
              >
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

      {/* 3. FEATURED TURE */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="font-display text-h1 md:text-3xl font-semibold text-wildher-text text-center mb-12">
            {t("toursTitle")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {tours.map((tour, i) => (
              <Card
                key={i}
                className="group rounded-2xl shadow-card hover:shadow-xl transition-all duration-700 hover:-translate-y-1"
              >
                <CardImage>
                  <OptimizedImage
                    name={tour.image}
                    alt={t(tour.titleKey)}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </CardImage>
                <CardContent>
                  <p className="text-small text-wildher-text-muted mb-1">
                    {t(tour.locationKey)}
                  </p>
                  <h3 className="text-h3 font-semibold text-wildher-text mb-3">
                    {t(tour.titleKey)}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-small text-wildher-text-muted mb-3">
                    <span className="flex items-center gap-1">
                      <Icon name="calendar" size={16} />
                      {t(tour.durationKey)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="mountain" size={16} />
                      {t(tour.difficultyKey)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="users" size={16} />
                      {t(tour.groupKey)}
                    </span>
                  </div>
                  <p className="text-small text-wildher-text-muted mb-4 line-clamp-2">
                    {t(tour.descKey)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-brand-primary-green">
                      Od {t(tour.priceKey)}€
                    </span>
                    <Link
                      href="/ture"
                      className="text-small font-semibold text-brand-primary-green hover:underline"
                    >
                      {t("learnMore")} →
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
            {testimonials.map(({ quoteKey, authorKey }, i) => (
              <blockquote key={i}>
                <p className="text-body-lg md:text-xl italic mb-4">&ldquo;{t(quoteKey)}&rdquo;</p>
                <footer className="text-small text-brand-off-white/80">— {t(authorKey)}</footer>
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

      {/* 5. UPOZNAJ OSNIVAČICU */}
      <section className="py-16 md:py-24 bg-[#fafaf9]">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="rounded-xl overflow-hidden shadow-card aspect-[4/3] md:aspect-[16/10]">
              <OptimizedImage
                name="2"
                alt="Osnivačica WildHer Adventures"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-h1 md:text-3xl font-semibold text-wildher-text mb-6 text-left">
                {t("aboutTitle")}
              </h2>
              <p className="text-body text-wildher-text mb-6 text-left">
                {t("aboutText1")}
              </p>
              <p className="text-body text-wildher-text mb-8 text-left">
                {t("aboutText2")}
              </p>
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

      {/* 6. ISTRAŽI DESTINACIJE */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="font-display text-h1 md:text-3xl font-semibold text-wildher-text text-center mb-10">
            {t("destinationsTitle")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {destinations.slice(0, 4).map((dest, i) => (
              <Link
                key={i}
                href="/destinacije"
                className="group block rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] relative">
                  <OptimizedImage
                    name={dest.image}
                    alt={t(dest.nameKey)}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                    <p className="font-semibold text-sm md:text-body">{t(dest.nameKey)}</p>
                    <p className="text-small text-white/90">{t(dest.metaKey)}</p>
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
            {blogPosts.map((post, i) => (
              <Card key={i} className="group rounded-2xl hover:shadow-xl transition-all duration-700 hover:-translate-y-1 shadow-card overflow-hidden">
                <CardImage>
                  <OptimizedImage
                    name={post.image}
                    alt={t(post.titleKey)}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </CardImage>
                <CardContent>
                  <h3 className="text-h3 font-semibold text-wildher-text mb-2 line-clamp-2">{t(post.titleKey)}</h3>
                  <p className="text-small text-wildher-text-muted line-clamp-2 mb-4">{t(post.excerptKey)}</p>
                  <Link href="/blog" className="text-small font-semibold text-brand-primary-green hover:underline">
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

      {/* 8. INSTAGRAM FEED */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="font-display text-h1 md:text-2xl font-semibold text-wildher-text text-center mb-8">
            {t("instagramTitle")}
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {instagramImages.map((name, i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-radius-button hover:opacity-90 transition-opacity"
              >
                <OptimizedImage
                  name={name}
                  alt=""
                  sizes="33vw"
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
          <p className="text-center mt-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body font-semibold text-brand-primary-green hover:underline"
            >
              @wildheradventures — {t("instagramCta")}
            </a>
          </p>
        </div>
      </section>

      {/* 9. NEWSLETTER */}
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

      {/* 10. FINAL CTA */}
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
  );
}
