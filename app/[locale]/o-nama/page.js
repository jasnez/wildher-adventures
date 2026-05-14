import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { AboutHero } from "@/components/AboutHero";
import OptimizedImage from "@/components/OptimizedImage";
import { Icon } from "@/components/ui";
import { AboutCta } from "@/components/AboutCta";
import { Link } from "@/i18n/navigation";
import { getAboutPage } from "@/lib/sanity/fetch";
import { RichText, localiseRichText } from "@/lib/sanity/portableText";

function pickLocale(value, locale) {
  if (!value || typeof value !== "object") return "";
  return (locale === "en" && value.en) || value.bs || "";
}

const VALUE_ICON_FALLBACK = ["shield", "zap", "heart", "users"];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "bs" ? "O nama — WildHer Adventures" : "About Us — WildHer Adventures",
  };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const aboutDoc = await getAboutPage();

  // ---- Hero -----------------------------------------------------------------
  const heroTitle = pickLocale(aboutDoc?.heroTitle, locale) || t("heroTitle");
  const heroSubtitle = pickLocale(aboutDoc?.heroSubtitle, locale) || t("heroSubtitle");

  // ---- Founder story --------------------------------------------------------
  const founderStoryRich = localiseRichText(aboutDoc?.founderStory, locale);
  const useStaticStory = !founderStoryRich;

  // ---- Mission --------------------------------------------------------------
  const missionRich = localiseRichText(aboutDoc?.mission, locale);

  // ---- Values ---------------------------------------------------------------
  const valuesFromCms = Array.isArray(aboutDoc?.values) ? aboutDoc.values : [];
  const values = valuesFromCms.length
    ? valuesFromCms.map((v, i) => ({
        title: pickLocale(v?.title, locale),
        text: pickLocale(v?.text, locale),
        icon: v?.icon || VALUE_ICON_FALLBACK[i % VALUE_ICON_FALLBACK.length],
      }))
    : [
        { titleKey: "value1Title", textKey: "value1Text", icon: "shield" },
        { titleKey: "value2Title", textKey: "value2Text", icon: "zap" },
        { titleKey: "value3Title", textKey: "value3Text", icon: "heart" },
        { titleKey: "value4Title", textKey: "value4Text", icon: "users" },
      ].map((v) => ({ title: t(v.titleKey), text: t(v.textKey), icon: v.icon }));

  // ---- Team -----------------------------------------------------------------
  const cmsTeam = Array.isArray(aboutDoc?.team) ? aboutDoc.team : [];
  const team = cmsTeam.length
    ? cmsTeam.map((g) => ({
        name: g?.name,
        slug: g?.slug?.current,
        role: pickLocale(g?.role, locale),
        bio: pickLocale(g?.shortBio, locale),
        photo: g?.photo || null,
      }))
    : [
        { image: "2", nameKey: "member1Name", roleKey: "member1Role", bioKey: "member1Bio" },
        { image: "3", nameKey: "member2Name", roleKey: "member2Role", bioKey: "member2Bio" },
        { image: "4", nameKey: "member3Name", roleKey: "member3Role", bioKey: "member3Bio" },
      ].map((m) => ({
        name: t(m.nameKey),
        slug: null,
        role: t(m.roleKey),
        bio: t(m.bioKey),
        photo: null,
        imageName: m.image,
      }));

  // ---- Static fallback sections --------------------------------------------
  const mountains = t("mountains").split(", ");
  const safetyItems = [
    t("safety1"),
    t("safety2"),
    t("safety3"),
    t("safety4"),
    t("safety5"),
  ];
  const stats = [
    { valueKey: "stat1Value", labelKey: "stat1Label" },
    { valueKey: "stat2Value", labelKey: "stat2Label" },
    { valueKey: "stat3Value", labelKey: "stat3Label" },
    { valueKey: "stat4Value", labelKey: "stat4Label" },
  ];

  return (
    <main id="main-content" className="min-h-screen">
      <AboutHero
        heroImageSrc={aboutDoc?.heroImage || "/about-hero.png"}
        heroAlt="WildHer Adventures"
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
        {/* Priča osnivačice */}
        <section className="mb-16">
          <h2 className="text-h2 font-semibold text-wildher-text mb-8">{t("founderTitle")}</h2>
          <div className="space-y-6 text-body text-wildher-text">
            {useStaticStory ? (
              <>
                <p>{t("founderP1")}</p>
                <p>{t("founderP2")}</p>
                <div className="rounded-radius-card overflow-hidden my-8">
                  <OptimizedImage
                    name="1"
                    alt="Planinarenje u prirodi"
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <p>{t("founderP3")}</p>
                <p>{t("founderP4")}</p>
                <p>{t("founderP5")}</p>
                <p>{t("founderP6")}</p>
              </>
            ) : (
              <RichText value={founderStoryRich} />
            )}
          </div>
        </section>

        {/* Misija */}
        <section className="mb-16">
          <h2 className="text-h2 font-semibold text-wildher-text mb-6">{t("missionTitle")}</h2>
          {missionRich ? (
            <div className="text-body-lg font-medium text-brand-primary-green max-w-2xl">
              <RichText value={missionRich} />
            </div>
          ) : (
            <p className="text-body-lg font-medium text-brand-primary-green max-w-2xl">
              {t("mission")}
            </p>
          )}
        </section>

        {/* Vrijednosti */}
        <section className="mb-16">
          <h2 className="text-h2 font-semibold text-wildher-text mb-8">{t("valuesTitle")}</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <div
                key={i}
                className="rounded-radius-card-lg border border-neutral-200 bg-white p-6 shadow-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-brand-primary-green">
                    <Icon name={v.icon || "heart"} size={24} />
                  </span>
                  <h3 className="text-h3 font-semibold text-wildher-text">{v.title}</h3>
                </div>
                <p className="text-body text-wildher-text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Brojke */}
        <section className="mb-16">
          <h2 className="text-h2 font-semibold text-wildher-text mb-8 text-center">
            {t("statsTitle")}
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map(({ valueKey, labelKey }) => (
              <div
                key={valueKey}
                className="rounded-radius-card-lg border border-neutral-200 bg-white py-6 px-4 text-center shadow-card"
              >
                <p className="text-3xl md:text-4xl font-bold text-brand-primary-green mb-1">
                  {t(valueKey)}
                </p>
                <p className="text-small text-wildher-text-muted">{t(labelKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Kvalifikacije i sigurnost */}
        <section className="mb-16">
          <h2 className="text-h2 font-semibold text-wildher-text mb-6">
            {t("qualificationsTitle")}
          </h2>
          <p className="text-body text-wildher-text mb-4">{t("qualificationsIntro")}</p>
          <p className="text-body text-wildher-text mb-4">{t("qualificationsIntro2")}</p>
          <ul className="space-y-3 mb-6">
            {safetyItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-body text-wildher-text">
                <span className="mt-0.5 shrink-0 text-brand-primary-green">
                  <Icon name="check" size={20} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-body text-wildher-text">{t("qualificationsOutro")}</p>
        </section>

        {/* Istražujemo planine BiH */}
        <section className="mb-16">
          <h2 className="text-h2 font-semibold text-wildher-text mb-6">{t("exploreTitle")}</h2>
          <p className="text-body text-wildher-text mb-4">{t("exploreP1")}</p>
          <p className="text-body text-wildher-text mb-6">{t("exploreP2")}</p>
          <p className="text-body text-wildher-text mb-3">{t("exploreListIntro")}</p>
          <ul className="list-none mb-6">
            {mountains.map((name) => (
              <li
                key={name}
                className="text-body font-medium text-brand-primary-green py-1"
              >
                {name}
              </li>
            ))}
          </ul>
          <p className="text-body text-wildher-text">{t("exploreOutro")}</p>
        </section>

        {/* Naša zajednica */}
        <section className="mb-16">
          <h2 className="text-h2 font-semibold text-wildher-text mb-6">{t("communityTitle")}</h2>
          <p className="text-body-lg font-medium text-wildher-text mb-4">{t("communityP1")}</p>
          <p className="text-body text-wildher-text mb-4">{t("communityP2")}</p>
          <p className="text-body text-wildher-text">{t("communityP3")}</p>
        </section>

        {/* Tim */}
        <section className="mb-16">
          <h2 className="text-h2 font-semibold text-wildher-text mb-8">{t("teamTitle")}</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => {
              const Wrapper = ({ children }) =>
                member.slug ? (
                  <Link
                    href={`/vodice/${member.slug}`}
                    className="block rounded-radius-card-lg overflow-hidden border border-neutral-200 bg-white shadow-card hover:shadow-xl transition-shadow"
                  >
                    {children}
                  </Link>
                ) : (
                  <article className="rounded-radius-card-lg overflow-hidden border border-neutral-200 bg-white shadow-card">
                    {children}
                  </article>
                );
              return (
                <Wrapper key={member.slug || i}>
                  <div className="aspect-[4/3] overflow-hidden">
                    <OptimizedImage
                      {...(member.photo ? { src: member.photo } : { name: member.imageName })}
                      alt={member.name}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-h3 font-semibold text-wildher-text mb-1">
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="text-small font-medium text-brand-primary-green mb-3">
                        {member.role}
                      </p>
                    )}
                    {member.bio && (
                      <p className="text-small text-wildher-text-muted">{member.bio}</p>
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-radius-card-lg bg-neutral-100 py-12 px-6 text-center md:py-16">
          <h2 className="text-h2 font-semibold text-wildher-text mb-4">{t("ctaTitle")}</h2>
          <p className="text-body text-wildher-text-muted max-w-xl mx-auto mb-8">{t("ctaText")}</p>
          <AboutCta />
        </section>
      </div>
    </main>
  );
}
