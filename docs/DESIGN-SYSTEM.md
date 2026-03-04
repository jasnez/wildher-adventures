# Dizajn sistem — UI komponente

Komponente u `components/ui/` koriste design tokene iz `app/globals.css` (boje, radius, sjenke, tipografija). Uvoz: `import { Button, Card, Input, Icon } from '@/components/ui';`

---

## 1. Button

**Varijante:** `primary` | `secondary` | `outline` | `ghost` | `dark`  
**Veličine:** `sm` | `md` | `lg`  
**Opciono:** `iconLeft`, `iconRight` (React node, npr. `<Icon name="arrow-right" />`), `as="a"` za link.

```jsx
import { Button, Icon } from '@/components/ui';

<Button variant="primary" size="md">Rezerviši</Button>
<Button variant="outline" iconRight={<Icon name="arrow-right" />} as="a" href="/ture">
  Istraži ture
</Button>
<Button variant="ghost" size="sm">Otkaži</Button>
```

---

## 2. Card

- **Card** — osnovni wrapper (rounded, shadow, hover).
- **CardImage** — gornji dio (aspect 4/3).
- **CardContent** — padding blok.
- **CardTour** — kartica ture: `image`, `title`, `meta`, `description`, `price`, `ctaLabel`, `ctaHref`.
- **CardFeature** — „Zašto mi?“: `icon`, `title`, children (tekst).
- **CardBlog** — blog: `image`, `title`, `excerpt`, `date`, `href`.

```jsx
import { CardTour, CardFeature, Icon } from '@/components/ui';

<CardTour
  image={<img src="..." alt="..." />}
  title="Prenj — Zelena glava"
  meta="1 dan | Umjereno"
  description="Uspon na 2155m..."
  price={89}
  ctaHref="/ture/prenj"
/>
<CardFeature icon={<Icon name="mountain" size={24} />} title="Autentična BiH">
  Skrivene ljepote, 78 vrhova iznad 2000m.
</CardFeature>
```

---

## 3. Forme (Input, Label, Textarea, Select, Checkbox)

Sva polja koriste `rounded-radius-button`, `border-neutral-300`, focus ring u `brand-primary-green`.  
**Label** — `htmlFor`, `required` (dodaje *).  
**Input / Textarea / Select** — `label`, `required`, `error` (prikaz poruke), ostali HTML atributi.

```jsx
import { Input, Textarea, Select, Checkbox } from '@/components/ui';

<Input label="Email" name="email" type="email" required placeholder="ti@email.com" />
<Input label="Ime" name="name" error="Obavezno polje" />
<Textarea label="Poruka" name="message" rows={4} />
<Select
  label="Tip upita"
  name="type"
  options={[
    { value: 'booking', label: 'Booking pitanje' },
    { value: 'general', label: 'Općeniti upit' },
  ]}
  placeholder="Odaberi..."
/>
<Checkbox name="newsletter" label="Želim primati newsletter" />
```

---

## 4. Icon

**Dostupne ikone:** `arrow-right`, `arrow-external`, `chevron-down`, `map-pin`, `calendar`, `mountain`, `users`, `mail`, `check`, `x`.  
**Veličine:** `size={16}` | `20` | `24` (mapira na Tailwind w-4/w-5/w-6).

```jsx
import { Icon } from '@/components/ui';

<Icon name="arrow-right" />
<Icon name="map-pin" size={24} className="text-brand-primary-green" />
```

---

## Pristupačnost

- Dugmad: min. 44×44 px tap area (md/lg), focus-visible ring.
- Forme: `label` povezan s `id`/`htmlFor`, `aria-invalid` i `aria-describedby` kad postoji `error`.
- Ikone: `aria-hidden="true"` kad su dekorativne pored teksta.

Nove komponente dodavati u `components/ui/` i exportati u `components/ui/index.js`.
