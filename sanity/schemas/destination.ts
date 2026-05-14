import { defineField, defineType } from 'sanity';

export const destination = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'localeString',
      description: 'e.g. Prenj, Sutjeska NP, Una valley',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name.bs', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      options: {
        list: [
          { title: 'Sarajevo area', value: 'sarajevo' },
          { title: 'Herzegovina', value: 'herzegovina' },
          { title: 'Bosanska Krajina', value: 'krajina' },
          { title: 'Central Bosnia', value: 'central' },
          { title: 'Eastern Bosnia', value: 'eastern' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
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
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'localeText',
    }),
    defineField({
      name: 'description',
      title: 'Full description',
      type: 'localeRichText',
    }),
    defineField({
      name: 'elevationM',
      title: 'Highest elevation (m)',
      type: 'number',
    }),
    defineField({
      name: 'bestSeason',
      title: 'Best season',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Spring (Mar-May)', value: 'spring' },
          { title: 'Summer (Jun-Aug)', value: 'summer' },
          { title: 'Autumn (Sep-Nov)', value: 'autumn' },
          { title: 'Winter (Dec-Feb)', value: 'winter' },
        ],
      },
    }),
    defineField({
      name: 'mapCoordinates',
      title: 'Map coordinates (lat,lng)',
      type: 'string',
      description: 'e.g. 43.4628,17.7806',
    }),
  ],
  preview: {
    select: { title: 'name.bs', subtitle: 'region', media: 'heroImage' },
  },
});
