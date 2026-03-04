# WildHer Adventures

Web stranica za ženski avanturistički brend u Bosni i Hercegovini (Next.js + Tailwind v4 + Strapi CMS).

## Razvojno okruženje

- **Frontend:** Next.js 15, Tailwind CSS v4
- **CMS:** Strapi 5 u folderu `WildHer-Adventures/` — **samo za WildHer** (nema zajedničkog sadržaja s drugim projektima)

### Pokretanje

```bash
# Instalacija (jednom)
npm install

# Next.js (http://localhost:3000)
npm run dev

# Strapi CMS (http://localhost:1337) — u drugom terminalu
npm run cms:dev
```

Prvi put kad pokreneš CMS, otvori http://localhost:1337/admin i registruj admin korisnika.

### Ostalo

- **Slike:** [docs/IMAGE-OPTIMIZATION.md](docs/IMAGE-OPTIMIZATION.md) — WebP, srcset, `OptimizedImage` komponenta  
- **CMS:** [docs/CMS.md](docs/CMS.md) — Strapi, API, produkcija  
- **Izvori slika:** [IMAGE-SOURCES.md](IMAGE-SOURCES.md) — legalni izvori za placeholder slike
