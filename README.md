# WildHer Adventures

Women-only adventure-tourism site for Bosnia & Herzegovina. Next.js 15 + React 19 + Tailwind v4, content from Sanity.

## Development

```bash
# Install deps (once)
npm install

# Copy env template, fill in real values
cp .env.example .env.local

# Run dev server (http://localhost:3000)
npm run dev
```

### Required env vars (`.env.local`)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — from https://sanity.io/manage
- `NEXT_PUBLIC_SANITY_DATASET` — defaults to `production`
- `NEXT_PUBLIC_CALENDLY_URL` — public Calendly event URL used by the booking CTA
- `SANITY_API_WRITE_TOKEN` — Editor token, only needed when running `npm run seed:sanity`

## Content management

Sanity Studio is mounted at `/studio` (http://localhost:3000/studio). Sign in with your Sanity account.

Content types:
- **Pages** — singletons: Home, About, Safety, Terms, Privacy, Contact, Gift voucher
- **Tours** — the trip catalogue
- **Guides** — guide profiles
- **Destinations** — geographic pages
- **Travel stories** — blog
- **Testimonials**
- **FAQ**

## Seed data

To populate Sanity with realistic dummy content (3 tours, 1 guide, 2 destinations, 8 FAQs, 4 testimonials, home/about/safety/contact):

```bash
# Create an Editor token at sanity.io/manage and paste into .env.local
npm run seed:sanity
```

Idempotent — re-running updates existing documents with the same IDs.

## Scripts

- `npm run dev` — Next.js dev server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
- `npm run test` — Vitest
- `npm run test:watch` — Vitest watch mode
- `npm run optimize-images` — regenerate WebP variants for legacy `/public/images/`
- `npm run seed:sanity` — populate Sanity with dummy content

## Booking flow

Stage 1 is fully manual: every tour page has two CTAs that open either a Calendly consultation link or a prefilled `mailto:bookings@wildheradventures.ba` email. After the consultation, the owner sends a Stripe Payment Link manually. No form, no `/api/booking-request` route in this stage.

## Image pipeline

New content uses Sanity's CDN (`cdn.sanity.io`) with on-the-fly transforms. The legacy WebP pipeline in `scripts/optimize-images.js` + `public/images/` is still used by sections that have not yet migrated.
