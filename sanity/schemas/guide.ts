import { defineField, defineType } from 'sanity';

export const guide = defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'localeString',
      description: 'e.g. Founder & lead guide, Via ferrata specialist',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortBio',
      title: 'Short bio (1-2 sentences, shown on cards)',
      type: 'localeText',
    }),
    defineField({
      name: 'bio',
      title: 'Full bio',
      type: 'localeRichText',
    }),
    defineField({
      name: 'languages',
      title: 'Spoken languages',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. Bosnian, English, German',
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. Licenced tour guide (BiH), Wilderness First Aid, Via Ferrata Cert',
    }),
    defineField({
      name: 'specialties',
      title: 'Specialties',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Hiking', value: 'hiking' },
          { title: 'Via Ferrata', value: 'via_ferrata' },
          { title: 'Canyoning', value: 'canyoning' },
          { title: 'Mountaineering', value: 'mountaineering' },
          { title: 'Retreat / Mindfulness', value: 'retreat' },
          { title: 'First aid', value: 'first_aid' },
          { title: 'Photography', value: 'photography' },
        ],
      },
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram handle',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role.bs',
      media: 'photo',
    },
  },
});
