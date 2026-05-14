import { defineField, defineType } from 'sanity';

/**
 * Bilingual string used wherever a field needs both a Bosnian and English value.
 * Keep bs as the primary (required) and en as optional but recommended.
 */
export const localeString = defineType({
  name: 'localeString',
  title: 'Bilingual text',
  type: 'object',
  fields: [
    defineField({
      name: 'bs',
      title: 'Bosanski',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
    }),
  ],
});

export const localeText = defineType({
  name: 'localeText',
  title: 'Bilingual long text',
  type: 'object',
  fields: [
    defineField({
      name: 'bs',
      title: 'Bosanski',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 4,
    }),
  ],
});

export const localeRichText = defineType({
  name: 'localeRichText',
  title: 'Bilingual rich text',
  type: 'object',
  fields: [
    defineField({
      name: 'bs',
      title: 'Bosanski',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
});
