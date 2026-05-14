import { defineField, defineType } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  fields: [
    defineField({ name: 'heroTitle', title: 'Hero title', type: 'localeString' }),
    defineField({ name: 'heroSubtitle', title: 'Hero subtitle', type: 'localeText' }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'founderStory', title: 'Founder story', type: 'localeRichText' }),
    defineField({ name: 'mission', title: 'Mission', type: 'localeRichText' }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'localeString' },
            { name: 'text', title: 'Text', type: 'localeText' },
            { name: 'icon', title: 'Icon name', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'team',
      title: 'Team members (guides shown on About)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'guide' }] }],
    }),
  ],
  preview: { prepare: () => ({ title: 'About page' }) },
});
