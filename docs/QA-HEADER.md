# QA — Header (duboka analiza)

Analiza headera WildHer Adventures: struktura, a11y, i18n, edge case-ovi i implementirani popravci.

---

## 1. Struktura i semantika

| Element | Stanje | Napomena |
|--------|--------|----------|
| `<header>` | ✅ | Koristi se ispravno, sticky `top-0 z-50`. |
| Glavna navigacija | ✅ | `<nav aria-label="…">` za desktop i mobilni blok. |
| Logo link | ✅ | `Link href="/"` s `aria-label="WildHer Adventures — {home}"`. |
| Redoslijed u DOM-u | ✅ | Logo → nav → CTA + jezik (desktop); hamburger na kraju. |

**Napomena:** Mobilni overlay je `<div id="mobile-menu">`, nije unutar `<header>`. To je prihvatljivo jer je vizualno dio headera; `aria-controls` na hamburgeru pokazuje na `id="mobile-menu"`.

---

## 2. Pristupačnost (a11y)

### 2.1 Ispravljeno u ovom QA krugu

| Problem | Rješenje |
|---------|----------|
| **Aria-labeli na bosanskom** — "Glavna navigacija", "Mobilna navigacija", "Otvori meni", "Zatvori meni" bili su hardcodirani; na EN lokalu bi ostali na BS. | Dodani prijevodi u `nav.mainNavAria`, `nav.mobileNavAria`, `nav.openMenu`, `nav.closeMenu` (BS/EN). Header koristi `t('mainNavAria')` itd. |
| **Escape ne zatvara meni** — tipkovnica nije mogla zatvoriti overlay. | Dodan `useEffect` koji sluša `keydown` i na `Escape` poziva `setMobileOpen(false)`. |
| **Fokus ne ulazi u meni** — kad se meni otvori, fokus ostaje na hamburgeru. | Pri otvaranju menija fokus se pomiče na prvi link u overlayu (`mobileMenuRef.current.querySelector('a')`). |

### 2.2 Već u redu

- **Hamburger:** `aria-expanded`, `aria-controls="mobile-menu"`, `aria-label` (sada preveden).
- **Overlay:** `aria-hidden={!mobileOpen}`.
- **Language toggle:** `aria-label={t('language')}`, `aria-pressed` na BS/EN dugmićima.
- **Minimalna površina klika:** hamburger i BS/EN dugmad imaju `min-h-[44px] min-w-[44px]` (ili ekvivalent).
- **Focus visible:** Button koristi `focus-visible:ring-*`; Linkovi imaju `:focus-visible` preko globalnih stilova ako postoje.

### 2.3 Opciono za kasnije

- **Focus trap u overlayu:** Tab bi mogao ostati unutar overlaya dok je otvoren (trenutno se fokusira prvi link, ali Tab može izaći van). Za puni trap trebao bi hook (npr. focus-trap-react) ili ručna obrada Tab/Shift+Tab.
- **Vraćanje fokusa:** pri zatvaranju menija vratiti fokus na hamburger (`button`).

---

## 3. i18n

| Stavka | Stanje |
|--------|--------|
| Nav linkovi | ✅ `t(link.key)` za tours, destinations, about, blog, gallery, contact. |
| Booking CTA | ✅ `tCommon('book')` — "Booking" (BS) / "Book" (EN). |
| Language toggle | ✅ `tCommon('language')` za aria-label. |
| Aria-labeli navigacije i menija | ✅ Sada prevedeni (mainNavAria, mobileNavAria, openMenu, closeMenu). |
| Logo aria-label | ✅ `WildHer Adventures — ${tCommon('home')}`. |

**Booking link:** Korišten je `ButtonLink` (next-intl `Link`) s `href="/prijava"`, tako da se lokala čuva (npr. `/en/prijava` kad je jezik EN). Ranije je bio `<Button as="a" href="/prijava">` — običan `<a>` bez prefiksa lokale.

---

## 4. Rute i 404

Header linkovi vode na:

- `/` (početna) — postoji
- `/o-nama` — postoji
- `/ture`, `/destinacije`, `/blog`, `/galerija`, `/kontakt`, `/prijava` — **stranice još ne postoje** → 404

**Preporuka:** Dodati placeholder stranice (npr. "U izradi" / "Coming soon") ili privremeno usmjeriti neke linkove na postojeće (npr. Booking → `/kontakt` dok se ne napravi `/prijava`).

---

## 5. Styling i ponašanje

| Stavka | Stanje |
|--------|--------|
| Sticky + scroll | ✅ Na scroll > 20px dodaje se `bg-white/95 shadow-card backdrop-blur-sm`. |
| Mobilni overlay | ✅ `fixed inset-0`, `z-40`, `lg:hidden`; zatvaranje po linku ili (sada) Escape. |
| Scroll lock | ✅ `body.style.overflow = 'hidden'` kad je meni otvoren. |
| Logo | ✅ Next.js `Image`, `priority`, `/logo-primary.png` iz `public/`. |
| Breakpoint | ✅ Desktop nav i CTA `lg:flex`, hamburger `lg:hidden`. |

---

## 6. Komponente i ovisnosti

- **LanguageToggle:** koristi `useLocale`, `useRouter`, `usePathname`, `useTranslations('common')` — sve iz next-intl / `@/i18n/navigation`.
- **ButtonLink:** koristi se za Booking (desktop i mobil) kako bi link bio lokaliziran; `Button as="a"` ostaje za slučajeve gdje treba običan `<a>` izvan RSC.
- **HamburgerIcon:** čisti presentational komponent; `aria-hidden="true"` na wrapperu.

---

## 7. Sažetak popravaka (ovaj QA)

1. **Aria-labeli prevedeni** — glavna navigacija, mobilna navigacija, otvori/zatvori meni (BS/EN).
2. **Escape zatvara mobilni meni** — listener na `keydown` za `Escape`.
3. **Fokus na prvi link** — pri otvaranju mobilnog menija fokus ide na prvi link u overlayu.
4. **Booking kao ButtonLink** — koristi next-intl `Link` da URL ima prefiks lokale (npr. `/en/prijava`).

---

## 8. Šta dalje (opciono)

- Stranice za Ture, Destinacije, Blog, Galerija, Kontakt, Prijava (ili placeholder).
- Focus trap u mobilnom overlayu (Tab ostaje unutar menija).
- Vraćanje fokusa na hamburger pri zatvaranju menija.
- A/B ili analitika za klik na Booking (npr. `data-cta="header-book"`).
