import { defineField, defineType } from 'sanity';

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'localeRichText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Booking & payment', value: 'booking' },
          { title: 'Fitness & difficulty', value: 'fitness' },
          { title: 'Solo travel', value: 'solo' },
          { title: 'Safety', value: 'safety' },
          { title: 'What to bring', value: 'gear' },
          { title: 'Accommodation', value: 'accommodation' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order (lower = first)',
      type: 'number',
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: 'Category, then order',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'question.bs', subtitle: 'category' },
  },
});
