# WildHer Adventures — design tokens

Centralna referenca za boje, tipografiju i komponentne tokene. Sve je u `app/globals.css` unutar `@theme` i mapira se na Tailwind v4 utility klase.

---

## 1. Color palette

### Primary (šumska zelena)
Glavna brand boja — CTA dugmad, linkovi, naglasci.

| Token            | Hex       | Primjena              |
|------------------|-----------|------------------------|
| primary-50       | `#f0f7f2` | Pozadine, hover        |
| primary-100–200  | —         | Borders, disabled     |
| primary-500–600  | `#3d8354` / `#2d6a43` | CTA, aktivni elementi |
| primary-700–950  | —         | Tekst na svijetloj pozadini |

**Tailwind:** `bg-primary-500`, `text-primary-700`, `border-primary-200` itd.

### Secondary (zemljana / terakota)
Toplina, sekundarni CTA, kartice, podnaslovi.

| Token            | Primjena                    |
|------------------|-----------------------------|
| secondary-500–600| Sekundarni dugmad, ikone    |
| secondary-100–200| Pozadine blokova           |

**Tailwind:** `bg-secondary-100`, `text-secondary-700`.

### Accent (nebo / voda)
Svježina, linkovi, hover stanja.

| Token       | Primjena        |
|------------|------------------|
| accent-500 | Linkovi, ikone   |
| accent-100 | Svijetle pozadine |

**Tailwind:** `text-accent-600`, `bg-accent-50`.

### Neutrals (topli sivi)
Tekst i pozadine.

| Token      | Primjena              |
|-----------|------------------------|
| neutral-50| Pozadina stranice      |
| neutral-800 / 900 | Glavni tekst   |
| neutral-500 / 600 | Muted tekst, placeholders |

**Tailwind:** `text-neutral-800`, `bg-neutral-50`, `text-neutral-600`.

### Brand aliasi (brza upotreba)
- `wildher-green` → primary-600  
- `wildher-earth` → secondary-600  
- `wildher-sky` → accent-500  
- `wildher-bg` → neutral-50  
- `wildher-surface` → #fff  
- `wildher-text` → neutral-800  
- `wildher-text-muted` → neutral-600  

**Tailwind:** `bg-wildher-green`, `text-wildher-text`, `text-wildher-text-muted`.

**Paleta iz logo vodiča (v. docs/BRAND-LOGO.md):**  
`brand-primary-green`, `brand-earth-tone`, `brand-off-white`, `brand-charcoal` — i aliasi `wildher-logo-green`, `wildher-logo-earth`, `wildher-on-dark`, `wildher-charcoal`.

### Semantic
- `success` → primary-600  
- `warning` → žuta  
- `error` → crvena  

---

## 2. Typography

### Font family
- **Plus Jakarta Sans** (next/font u `app/layout.js`, varijabla `--font-plus-jakarta`).
- `font-sans` / `font-display` — oba koriste Plus Jakarta Sans.

### Skala (Tailwind v4 @theme)
| Token        | Veličina | Line height | Težina | Primjena        |
|-------------|----------|-------------|--------|-----------------|
| text-hero   | 2.5rem   | 1.15        | 700    | Hero headline   |
| text-h1     | 2rem     | 1.2         | 700    | H1              |
| text-h2     | 1.5rem   | 1.3         | 600    | H2              |
| text-h3     | 1.25rem  | 1.35        | 600    | H3              |
| text-body-lg| 1.125rem | 1.6         | —      | Uvodni paragrafi|
| text-body   | 1rem     | 1.6         | —      | Body            |
| text-small  | 0.875rem | 1.5         | —      | Sekundarni tekst|
| text-caption| 0.75rem  | 1.4         | —      | Captions, labels|

**Tailwind:** `text-hero`, `text-h1`, `text-body-lg`, `font-bold` (700), `font-semibold` (600).

---

## 3. Spacing

- `spacing-section` = 4rem (64px) — vertikalni razmak između sekcija.  
- `spacing-section-lg` = 5rem.  
- `spacing-block` = 1.5rem (24px).  
- `spacing-inline` = 1rem (16px).  

**Tailwind:** `gap-spacing-section`, `py-spacing-section`, `px-spacing-inline`.  
Koristi i default Tailwind spacing (npr. `p-4`, `gap-6`).

---

## 4. Border radius

| Token          | Vrijednost | Primjena     |
|----------------|------------|--------------|
| radius-button  | 0.5rem     | Dugmad       |
| radius-card    | 0.75rem    | Kartice      |
| radius-card-lg | 1rem       | Velike kartice |
| radius-full    | 9999px     | Pills, avatari |

**Tailwind:** `rounded-radius-button`, `rounded-radius-card`, `rounded-full`.

---

## 5. Shadows

| Token           | Primjena           |
|-----------------|--------------------|
| shadow-card     | Kartice            |
| shadow-card-hover | Hover na karticama |
| shadow-hero     | Overlay na heroju  |
| shadow-button   | Dugmad             |

**Tailwind:** `shadow-card`, `shadow-card-hover`, `shadow-hero`.

---

## 6. Breakpoints

| Naziv | Vrijednost | Primjena   |
|-------|------------|------------|
| sm    | 40rem (640px)  | Mobil +  |
| md    | 48rem (768px)  | Tablet   |
| lg    | 64rem (1024px) | Desktop  |
| xl    | 90rem (1440px) | Wide     |
| 2xl   | 100rem         | Extra wide |

**Tailwind:** `md:text-h1`, `lg:grid-cols-3`, `xl:max-w-7xl`.

---

## 7. Easing (tranzicije)

- `ease-out-expo` — brzi kraj animacije.  
- `ease-in-out-smooth` — glatke tranzicije.  

**Tailwind:** `transition-[timing-function:var(--ease-out-expo)]` ili custom klasa.

---

## Pristupačnost (WCAG 2.1 AA)

- Kontrast teksta: `text-neutral-800` na `bg-neutral-50` / `bg-white` zadovoljava 4.5:1+.  
- Za manji tekst koristi `text-neutral-900` na svijetloj pozadini.  
- Primary/Secondary na bijeloj: provjeri kontrast (npr. primary-700 za tekst).

Sve tokene mijenjaj u `app/globals.css` unutar `@theme`; nakon toga su odmah dostupni kao Tailwind utility klase.
