import type { StructureResolver } from 'sanity/structure';
import { singletonTypes } from './schemas';

const SINGLETON_LABELS: Record<string, string> = {
  homePage: 'Home page',
  aboutPage: 'About page',
  safetyPage: 'Safety page',
  termsPage: 'Terms & booking conditions',
  privacyPage: 'Privacy policy',
  contactPage: 'Contact page',
  giftVoucherPage: 'Gift voucher page',
};

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items(
              [...singletonTypes].map((type) =>
                S.listItem()
                  .title(SINGLETON_LABELS[type] || type)
                  .id(type)
                  .child(S.document().schemaType(type).documentId(type))
              )
            )
        ),
      S.divider(),
      S.documentTypeListItem('tour').title('Tours'),
      S.documentTypeListItem('guide').title('Guides'),
      S.documentTypeListItem('destination').title('Destinations'),
      S.documentTypeListItem('story').title('Travel stories'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('faq').title('FAQ'),
    ]);
