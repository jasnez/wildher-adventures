import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorCity',
      title: 'Author city / country',
      type: 'string',
      description: 'e.g. Sarajevo, Berlin, London',
    }),
    defineField({
      name: 'authorPhoto',
      title: 'Author photo (optional, with permission)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      initialValue: 5,
    }),
    defineField({
      name: 'tour',
      title: 'Tour (optional)',
      type: 'reference',
      to: [{ type: 'tour' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      title: 'Show on homepage',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'quote.bs',
      media: 'authorPhoto',
    },
  },
});
