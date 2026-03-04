# CMS (Strapi) — WildHer Adventures

Strapi u ovom repou je **samo za WildHer Adventures**. Sadržaj (ture, blog, destinacije) i mediji su potpuno odvojeni od bilo kojeg drugog projekta (npr. Kolmix).

---

## Lokacija

- **Folder:** `WildHer-Adventures/` (ugniježden u root projekta)
- **Baza:** SQLite za razvoj (fajl `WildHer-Adventures/.tmp/data.db`)
- **Port:** 1337
- **Next.js veza:** U `next.config.js` su rewrites `/cms-api/*` → `http://localhost:1337/*` i dozvola za slike s `localhost:1337/uploads/**`

---

## Prvo pokretanje

1. **Pokreni CMS:**
   ```bash
   npm run cms:dev
   ```
   ili iz foldera Strapi projekta:
   ```bash
   cd WildHer-Adventures && npm run develop
   ```

2. **Otvori admin:**  
   Browser će se otvoriti na http://localhost:1337/admin (ili otvori ručno).

3. **Registruj prvog admin korisnika** (ime, email, lozinka). To je jednom — nakon toga se samo uloguješ.

4. **API:**  
   - Admin panel: http://localhost:1337/admin  
   - REST API: http://localhost:1337/api  
   - Iz Next.js app-a možeš zvati `http://localhost:1337/api/...` ili kroz rewrite: `/cms-api/api/...` (ako želiš sakriti Strapi origin).

---

## Deprecation upozorenje

Pri pokretanju možeš vidjeti: `admin.auth.options.expiresIn is deprecated...` — to je poznato u Strapi 5, ne utječe na rad. U nekoj budućoj verziji će se zamijeniti s `admin.auth.sessions.maxRefreshTokenLifespan` i `maxSessionLifespan`. Za sada možeš ignorirati.

---

## Dva procesa za razvoj

- **Next.js (front):** `npm run dev` → http://localhost:3000  
- **Strapi (CMS):** `npm run cms:dev` → http://localhost:1337  

Oba treba da budu pokrenuta dok radiš na stranici i sadržaju. Slike s Strapi uploada koristi preko `next.config.js` (remotePatterns za 1337).

---

## Produkcija

Za produkciju:
- Strapi: prebaci bazu na PostgreSQL (npr. Supabase) preko env varijabli u `cms/.env` (`DATABASE_CLIENT=postgres`, `DATABASE_URL=...`).
- Hosting: Strapi na posebnom serveru ili servisu (Railway, Render, Strapi Cloud), Next.js na Vercel. U Next.js podesi `NEXT_PUBLIC_STRAPI_URL` (ili rewrites destination) na produkcijski URL Strapi API-ja.

---

## Content type-ovi (dodano u kodu)

U projektu su definisani:

### Tour (`api::tour.tour`)
- **Stranica:** Ture i iskustva, pojedinačna tura
- **Polja:** title, slug, shortDescription, description, images, cover, duration, difficulty, lengthKm, elevationM, maxGroupSize, minAge, price, currency, itinerary, included, excluded, whatToBring, physicalPreparation, category (one-day | weekend | expedition | retreat), location, **destination** (relacija na Destinaciju), featured, availableDates
- **API:** `GET /api/tours`, `GET /api/tours/:id`, `GET /api/tours?filters[slug][$eq]=...`

### Blog Post (`api::article.article`)
- **Stranica:** Blog / Journal
- **Polja:** title (obavezno), description (do 300 znakova, excerpt), slug (obavezno), cover, author, category, readingTime (minute), blocks (rich text, citati, mediji, slider)
- **API:** `GET /api/articles`, `GET /api/articles/:id`, po slugu

### Destinacija (`api::destination.destination`)
- **Stranica:** Destinacije — planine, regije, mjesta
- **Polja:** title, slug, shortDescription, description, cover, images, region, country (default BiH), featured, **tours** (relacija oneToMany na Ture)
- **API:** `GET /api/destinations`, `GET /api/destinations/:id`, `GET /api/destinations?filters[slug][$eq]=...`

**Permisije:** U **Settings → Users & Permissions → Roles → Public** omogući **find** i **findOne** za **Tour**, **Article** i **Destination**. Bootstrap u `WildHer-Adventures/src/index.ts` pokušava ove dozvole automatski uključiti pri startu.

---

## Dodavanje novih content type-ova

U Admin panelu: **Content-Type Builder** → Create new collection type (npr. **Tour**, **Blog Post**, **Destination**). Polja i relacije su već u kodu; nakon pull-a ili izmjene sheme ponovo pokreni Strapi (`npm run cms:dev`). Ovaj CMS ne dijeli sadržaj s drugim projektima.
