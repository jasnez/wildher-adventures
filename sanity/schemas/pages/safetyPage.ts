import { defineField, defineType } from 'sanity';

export const safetyPage = defineType({
  name: 'safetyPage',
  title: 'Safety page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page title', type: 'localeString' }),
    defineField({ name: 'intro', title: 'Intro', type: 'localeRichText' }),
    defineField({
      name: 'standards',
      title: 'Safety standards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', title: 'Heading', type: 'localeString' },
            { name: 'description', title: 'Description', type: 'localeText' },
          ],
        },
      ],
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications & insurance',
      type: 'array',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'emergencyProcedures',
      title: 'Emergency procedures',
      type: 'localeRichText',
    }),
  ],
  preview: { prepare: () => ({ title: 'Safety page' }) },
});

export const termsPage = defineType({
  name: 'termsPage',
  title: 'Booking conditions / Terms',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page title', type: 'localeString' }),
    defineField({ name: 'body', title: 'Body', type: 'localeRichText' }),
    defineField({ name: 'lastUpdated', title: 'Last updated', type: 'date' }),
  ],
  preview: { prepare: () => ({ title: 'Terms page' }) },
});

export const privacyPage = defineType({
  name: 'privacyPage',
  title: 'Privacy policy',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page title', type: 'localeString' }),
    defineField({ name: 'body', title: 'Body', type: 'localeRichText' }),
    defineField({ name: 'lastUpdated', title: 'Last updated', type: 'date' }),
  ],
  preview: { prepare: () => ({ title: 'Privacy page' }) },
});

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page title', type: 'localeString' }),
    defineField({ name: 'intro', title: 'Intro', type: 'localeText' }),
    defineField({ name: 'email', title: 'Contact email', type: 'string' }),
    defineField({ name: 'calendlyUrl', title: 'Calendly URL', type: 'url' }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
    defineField({ name: 'responseTime', title: 'Response-time blurb', type: 'localeString' }),
  ],
  preview: { prepare: () => ({ title: 'Contact page' }) },
});

export const giftVoucherPage = defineType({
  name: 'giftVoucherPage',
  title: 'Gift voucher page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page title', type: 'localeString' }),
    defineField({ name: 'description', title: 'Description', type: 'localeRichText' }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'tiers',
      title: 'Voucher tiers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'amount', title: 'Amount', type: 'number' },
            { name: 'currency', title: 'Currency', type: 'string' },
            { name: 'label', title: 'Label', type: 'localeString' },
          ],
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Gift voucher page' }) },
});
