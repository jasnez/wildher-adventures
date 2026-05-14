import { defineField, defineType } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero subtitle',
      type: 'localeText',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline shown under hero',
      type: 'localeString',
    }),
    defineField({
      name: 'trustBadges',
      title: 'Trust badges (3-4)',
      type: 'array',
      of: [{ type: 'localeString' }],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'featuredTours',
      title: 'Featured tours (homepage carousel)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tour' }] }],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'featuredStories',
      title: 'Featured travel stories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'story' }] }],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'pressMentions',
      title: 'Press / partner logos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'logo', title: 'Logo', type: 'image' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Home page' }),
  },
});
