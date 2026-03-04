# Optimizacija slika — WildHer Adventures

Placeholder slike su optimizirane za web: **WebP**, više rezolucija za **srcset**, i komponenta s **lazy loadingom**.

---

## Šta je urađeno

1. **Skripta** `scripts/optimize-images.js`  
   Čita sve JPG/JPEG iz `Public/`, za svaku generiše WebP u širinama **400, 640, 960, 1280, 1920** px i sprema u `Public/images/`.  
   Izlaz: npr. `1-400w.webp`, `1-640w.webp`, … i `manifest.json` s putanjama.

2. **Komponenta** `components/OptimizedImage.jsx`  
   Koristi te fajlove: `<picture>` + WebP `srcSet`, `loading="lazy"`, `decoding="async"`.  
   Za hero/LCP sliku možeš postaviti `priority={true}` da se ne lazy-loaduje.

---

## Kako ponovo pokrenuti optimizaciju

Kad dodaš nove JPG u `Public/`:

```bash
npm run optimize-images
```

Generirat će se novi WebP u `Public/images/` i ažurirat će se `manifest.json`.

---

## Korištenje u kodu

### React / Next.js

```jsx
import OptimizedImage from '@/components/OptimizedImage';

// Kartica / grid
<OptimizedImage
  name="1"
  alt="Planine BiH — hiking"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="rounded-lg object-cover w-full h-64"
/>

// Hero (bez lazy load da se brže prikaže)
<OptimizedImage
  name="7"
  alt="WildHer Adventures — grupa na vrhu"
  sizes="100vw"
  className="w-full h-screen object-cover"
  priority
/>
```

### Čisti HTML (bez React)

```html
<picture>
  <source
    type="image/webp"
    srcset="
      /images/1-400w.webp 400w,
      /images/1-640w.webp 640w,
      /images/1-960w.webp 960w,
      /images/1-1280w.webp 1280w,
      /images/1-1920w.webp 1920w
    "
    sizes="100vw"
  />
  <img
    src="/images/1-1920w.webp"
    alt="Planine BiH"
    loading="lazy"
    decoding="async"
    width="1920"
    height="1080"
  />
</picture>
```

---

## Napomene

- **Public vs public**  
  Slike čitaju se iz `public/` (Next.js konvencija). Ako su ti originali u `Public/`, prekopiraj ih u `public/` i pokreni `npm run optimize-images`.

- **Performanse**  
  WebP + srcset + lazy load drže LCP i CLS u okviru zahtjeva iz specifikacije. Za hero sliku ostavi `priority={true}` i koristi širinu koja odgovara najvećem prikazu (npr. 1920px).

- **Zamjena placeholdera**  
  Kad imaš konačne fotografije, zamijeni JPG u `Public/` (ili u `public/`) i ponovo pokreni `npm run optimize-images`. Imena fajlova (1, 2, …) možeš mapirati na destinacije/ture u CMS-u ili konfiguraciji.
