import { defineField, defineType } from 'sanity';

export const tour = defineType({
  name: 'tour',
  title: 'Tour',
  type: 'document',
  fields: [
    // ---- Identity ----
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.bs', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'One-day', value: 'one-day' },
          { title: 'Weekend', value: 'weekend' },
          { title: 'Expedition (3+ days)', value: 'expedition' },
          { title: 'Retreat', value: 'retreat' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Activity type',
      type: 'string',
      options: {
        list: [
          { title: 'Hiking', value: 'hiking' },
          { title: 'Via ferrata', value: 'via_ferrata' },
          { title: 'Canyoning', value: 'canyoning' },
          { title: 'Retreat / mindfulness', value: 'retreat' },
          { title: 'Snowshoe / winter', value: 'winter' },
          { title: 'Mixed expedition', value: 'expedition' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // ---- Marketing copy ----
    defineField({
      name: 'shortDescription',
      title: 'Short description (cards, OG)',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle (under hero title)',
      type: 'localeString',
    }),
    defineField({
      name: 'experienceStory',
      title: 'Experience story (long-form)',
      type: 'localeRichText',
      description: 'The "what this adventure feels like" narrative section.',
    }),

    // ---- Media ----
    defineField({
      name: 'cover',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    // ---- Logistics ----
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'reference',
      to: [{ type: 'destination' }],
    }),
    defineField({
      name: 'durationDays',
      title: 'Duration (days)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'durationLabel',
      title: 'Duration label override (optional)',
      type: 'localeString',
      description: 'e.g. "1 dan", "vikend (2 dana)"',
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty (1-5)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      options: {
        list: [
          { title: '1 — Easy', value: 1 },
          { title: '2 — Moderate', value: 2 },
          { title: '3 — Challenging', value: 3 },
          { title: '4 — Demanding', value: 4 },
          { title: '5 — Expert', value: 5 },
        ],
      },
    }),
    defineField({
      name: 'lengthKm',
      title: 'Trail length (km)',
      type: 'number',
    }),
    defineField({
      name: 'elevationM',
      title: 'Elevation gain (m)',
      type: 'number',
    }),
    defineField({
      name: 'maxGroupSize',
      title: 'Max group size',
      type: 'number',
      initialValue: 8,
      validation: (Rule) => Rule.required().positive().integer(),
    }),
    defineField({
      name: 'minAge',
      title: 'Minimum age',
      type: 'number',
    }),
    defineField({
      name: 'startingPoint',
      title: 'Starting point / location',
      type: 'localeString',
    }),

    // ---- Pricing ----
    defineField({
      name: 'price',
      title: 'Price per person',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'deposit',
      title: 'Deposit per person',
      type: 'number',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          { title: 'EUR', value: 'EUR' },
          { title: 'BAM', value: 'BAM' },
          { title: 'USD', value: 'USD' },
        ],
        layout: 'radio',
      },
      initialValue: 'EUR',
    }),
    defineField({
      name: 'paymentLinkUrl',
      title: 'Payment Link URL (deposit)',
      description:
        'Paste the deposit payment link from your provider (PayPal, Stripe, Monri…). When set, the "Book" CTA opens this URL directly; when empty, it falls back to a mailto: link. Must be HTTPS.',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
    }),

    // ---- Itinerary ----
    defineField({
      name: 'itinerary',
      title: 'Day-by-day itinerary',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'itineraryStep',
          title: 'Itinerary step',
          fields: [
            defineField({
              name: 'label',
              title: 'Step label',
              type: 'localeString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'localeText',
            }),
            defineField({
              name: 'time',
              title: 'Time / duration (optional)',
              type: 'string',
              description: 'e.g. "07:00", "2h", "Day 1"',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: 'label.bs', subtitle: 'time', media: 'image' },
          },
        },
      ],
    }),

    // ---- Inclusions / exclusions / gear ----
    defineField({
      name: 'included',
      title: "What's included",
      type: 'array',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'excluded',
      title: "What's NOT included",
      type: 'array',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'whatToBring',
      title: 'What to bring',
      type: 'array',
      of: [{ type: 'localeString' }],
    }),

    // ---- "Is this for me?" ----
    defineField({
      name: 'whoIsForIncluded',
      title: 'Who is this for?',
      type: 'array',
      of: [{ type: 'localeString' }],
      description: 'Positive list: women who love nature, want to try via ferrata, etc.',
    }),
    defineField({
      name: 'whoIsForExcluded',
      title: 'Who this is NOT for',
      type: 'array',
      of: [{ type: 'localeString' }],
      description: 'Honest exclusions: fear of heights, complete beginners without fitness, etc.',
    }),
    defineField({
      name: 'physicalPrep',
      title: 'Physical preparation guide',
      type: 'localeRichText',
    }),

    // ---- Guide + dates ----
    defineField({
      name: 'guide',
      title: 'Lead guide',
      type: 'reference',
      to: [{ type: 'guide' }],
    }),
    defineField({
      name: 'availableDates',
      title: 'Available dates',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tourDate',
          fields: [
            defineField({
              name: 'startDate',
              title: 'Start date',
              type: 'date',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'endDate',
              title: 'End date',
              type: 'date',
            }),
            defineField({
              name: 'spotsLeft',
              title: 'Spots remaining',
              type: 'number',
            }),
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
              options: {
                list: [
                  { title: 'Open for booking', value: 'open' },
                  { title: 'Almost full', value: 'almost_full' },
                  { title: 'Sold out', value: 'sold_out' },
                  { title: 'Waitlist only', value: 'waitlist' },
                  { title: 'Cancelled', value: 'cancelled' },
                ],
              },
              initialValue: 'open',
            }),
          ],
          preview: {
            select: { title: 'startDate', subtitle: 'status' },
          },
        },
      ],
    }),

    // ---- Trust / social proof ----
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
    }),
    defineField({
      name: 'faqs',
      title: 'Tour-specific FAQs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
    }),
    defineField({
      name: 'similarTours',
      title: 'Similar tours',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tour' }] }],
      validation: (Rule) => Rule.max(4),
    }),

    // ---- Display flags ----
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      options: {
        list: [
          { title: '(none)', value: '' },
          { title: 'Most popular', value: 'popular' },
          { title: 'New', value: 'new' },
          { title: 'Coming soon', value: 'coming' },
          { title: 'Inaugural — earlybird', value: 'inaugural' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Show on homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'soloFriendly',
      title: 'Solo-friendly',
      description:
        'Show a "solo-friendly" badge on this tour. Removes the single-supplement objection.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order (lower = first)',
      type: 'number',
      initialValue: 100,
    }),

    // ---- Files ----
    defineField({
      name: 'gpxFile',
      title: 'GPX track file (optional)',
      type: 'file',
      options: { accept: '.gpx,.kml' },
    }),
    defineField({
      name: 'mapImage',
      title: 'Map / elevation profile image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'title.bs',
      subtitle: 'category',
      media: 'cover',
    },
  },
});
