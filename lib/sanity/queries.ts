import { groq } from 'next-sanity';

/**
 * GROQ query fragments. Keep them small and composable so we can
 * reuse the same shape across listing and detail pages.
 */

export const localeStringProjection = `{ bs, en }`;

export const guideRefProjection = groq`
  _id,
  name,
  slug,
  role,
  "photo": photo.asset->url,
  languages,
  certifications
`;

export const destinationRefProjection = groq`
  _id,
  name,
  slug,
  region,
  "heroImage": heroImage.asset->url
`;

export const testimonialProjection = groq`
  _id,
  quote,
  authorName,
  authorCity,
  rating,
  "authorPhoto": authorPhoto.asset->url,
  publishedAt
`;

export const tourCardProjection = groq`
  _id,
  title,
  slug,
  category,
  type,
  shortDescription,
  "cover": cover.asset->url,
  durationDays,
  durationLabel,
  difficulty,
  price,
  currency,
  maxGroupSize,
  badge,
  featured,
  soloFriendly,
  sortOrder,
  "reviewCount": count(*[_type == "testimonial" && references(^._id)]),
  "averageRating": math::avg(*[_type == "testimonial" && references(^._id)].rating)
`;

export const tourFullProjection = groq`
  ${tourCardProjection},
  subtitle,
  experienceStory,
  "gallery": gallery[].asset->url,
  lengthKm,
  elevationM,
  minAge,
  startingPoint,
  deposit,
  itinerary[]{
    label,
    description,
    time,
    "image": image.asset->url
  },
  included,
  excluded,
  whatToBring,
  whoIsForIncluded,
  whoIsForExcluded,
  physicalPrep,
  guide->{${guideRefProjection}},
  destination->{${destinationRefProjection}},
  availableDates[]{
    startDate,
    endDate,
    spotsLeft,
    status
  },
  testimonials[]->{${testimonialProjection}},
  faqs[]->{ _id, question, answer, category },
  similarTours[]->{${tourCardProjection}},
  "gpxFile": gpxFile.asset->url,
  "mapImage": mapImage.asset->url
`;

// ---- Public queries ----

export const allToursQuery = groq`
  *[_type == "tour"] | order(sortOrder asc, _createdAt desc){
    ${tourCardProjection}
  }
`;

export const tourBySlugQuery = groq`
  *[_type == "tour" && slug.current == $slug][0]{
    ${tourFullProjection}
  }
`;

export const featuredToursQuery = groq`
  *[_type == "tour" && featured == true] | order(sortOrder asc)[0...6]{
    ${tourCardProjection}
  }
`;

export const allGuidesQuery = groq`
  *[_type == "guide"] | order(name asc){
    ${guideRefProjection},
    shortBio
  }
`;

export const guideBySlugQuery = groq`
  *[_type == "guide" && slug.current == $slug][0]{
    ${guideRefProjection},
    shortBio,
    bio,
    specialties,
    instagram,
    "toursLed": *[_type == "tour" && references(^._id)]{
      ${tourCardProjection}
    }
  }
`;

export const allDestinationsQuery = groq`
  *[_type == "destination"] | order(name.bs asc){
    ${destinationRefProjection},
    shortDescription,
    elevationM,
    bestSeason
  }
`;

export const destinationBySlugQuery = groq`
  *[_type == "destination" && slug.current == $slug][0]{
    ${destinationRefProjection},
    shortDescription,
    description,
    elevationM,
    bestSeason,
    "gallery": gallery[].asset->url,
    "tours": *[_type == "tour" && references(^._id)]{
      ${tourCardProjection}
    }
  }
`;

export const allStoriesQuery = groq`
  *[_type == "story"] | order(publishedAt desc){
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coverImage.asset->url,
    publishedAt,
    tags,
    author->{ _id, name, slug, "photo": photo.asset->url }
  }
`;

export const storyBySlugQuery = groq`
  *[_type == "story" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coverImage.asset->url,
    body,
    publishedAt,
    tags,
    author->{ _id, name, slug, "photo": photo.asset->url, shortBio },
    relatedTours[]->{${tourCardProjection}}
  }
`;

export const allFaqsQuery = groq`
  *[_type == "faq"] | order(category asc, order asc){
    _id, question, answer, category
  }
`;

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] | order(publishedAt desc)[0...6]{
    ${testimonialProjection}
  }
`;

export const allTestimonialsQuery = groq`
  *[_type == "testimonial"] | order(publishedAt desc){
    ${testimonialProjection},
    tour->{ _id, title, slug }
  }
`;

// ---- Page singletons ----

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    heroTitle,
    heroSubtitle,
    "heroImage": heroImage.asset->url,
    tagline,
    trustBadges,
    featuredTours[]->{${tourCardProjection}},
    featuredStories[]->{
      _id, title, slug, excerpt, publishedAt,
      "coverImage": coverImage.asset->url
    },
    pressMentions[]{ name, url, "logo": logo.asset->url }
  }
`;

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0]{
    heroTitle,
    heroSubtitle,
    "heroImage": heroImage.asset->url,
    founderStory,
    mission,
    values[]{ title, text, icon },
    team[]->{${guideRefProjection}, shortBio}
  }
`;

/**
 * Compact projection for the home page founder teaser: pulls the first paragraph
 * of the founder story + the lead guide photo (first entry of team).
 */
export const homeFounderTeaserQuery = groq`
  *[_type == "aboutPage"][0]{
    founderStory,
    "founderPhoto": team[0]->photo.asset->url,
    "founderName": team[0]->name
  }
`;

export const contactPageQuery = groq`
  *[_type == "contactPage"][0]{
    title,
    intro,
    email,
    calendlyUrl,
    instagram,
    facebook,
    responseTime
  }
`;

export const safetyPageQuery = groq`
  *[_type == "safetyPage"][0]{
    title,
    intro,
    standards[]{ heading, description },
    certifications,
    emergencyProcedures
  }
`;

export const termsPageQuery = groq`
  *[_type == "termsPage"][0]{
    title,
    body,
    lastUpdated
  }
`;

export const privacyPageQuery = groq`
  *[_type == "privacyPage"][0]{
    title,
    body,
    lastUpdated
  }
`;

export const giftVoucherPageQuery = groq`
  *[_type == "giftVoucherPage"][0]{
    title,
    description,
    "heroImage": heroImage.asset->url,
    tiers[]{ amount, currency, label }
  }
`;
