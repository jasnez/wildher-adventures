# WildHer Adventures — logotip i brand vodič

Referenca: nacrt dizajna logotipa i palete — slika u `assets/` (brand guideline s primarnim logotipom, ikonom, verzijom za tamnu pozadinu, favicon varijantama i paletom boja). Svaki element s tog nacrta koristi se kako je opisano u nastavku.

---

## 1. Glavni logotip (Primary Logo)

**Datoteka:** `public/logo-primary.png` — službena primarna verzija (ikona + „WildHer” + „Adventures”) za svijetlu pozadinu.

**Sastav:**
- **Ikona:** Dva zelena planinska vrha; na desnom (svjetlijem) vrhu stilizirana figura žene s pletenicom koja se penje. Između planina vijuga staza/rijeka. Iza desne planine stilizirano sunce (žuto/zlatno) sa zrakama. Boje: Primary Green, Earth Tone.
- **Tekst:** "WildHer" — velika, tamnozelena slova, sans-serif. Ispod: "Adventures" — manji, svjetliji, smeđi/zemljani sans-serif.

**Kada koristiti:** Header, footer, glavne stranice, materijali na svijetloj pozadini.

**Pravila:** Ne istezati, ne mijenjati proporcije, koristiti službene boje (vidi paletu ispod). Minimalna širina / visina prema vodiču.

---

## 2. Sekundarni logotip

**Datoteka:** `public/logo-secondary.png` — verzija s **ikonom iznad teksta** (planine, sunce, penjač + „WildHer” i „Adventures” ispod). Iste boje kao primarni, drugačiji raspored.

**Kada koristiti:** Kad je bolji vertikalni raspored (npr. uski stupac, mobilni header, cover stranice), email potpis, društvene mreže (post s logom), print materijali gdje je logo centriran.

**Ostale varijante:**
- **Samo ikona (Icon / Mark):** Službena ikona u tamnozelenom krugu — `public/logo-icon-mark.png` (planine, penjač, staza, sunce). Koristi se za **favicon**, app ikonu, uski header, avatar, društvene mreže. Postavljena kao favicon u `app/layout.js`.

---

## 3. Verzija za tamnu pozadinu (Dark Background Version)

**Datoteka:** `public/logo-primary-dark.png` — horizontalni logotip (ikona lijevo, „WildHer” i „Adventures” desno) na **tamnoj maslinasto-zelenoj / charcoal** pozadini. „WildHer” u bijeloj/off-white, „Adventures” i sunce u svijetlo zlatnoj/tan; planine u svijetlijoj maslinastoj, penjač u tamnijoj zelenoj.

**Pozadina:** Charcoal / tamno maslinasto zelena (koristi `bg-brand-charcoal` ili slično).

**Kada koristiti:** Hero s tamnom pozadinom, footer, overlayi, dark mode, cover za društvene mreže.

---

## 4. Male ikone / Favikoni

Nacrt predviđa niz malih kvadratnih ikona (npr. 6 varijanti) za:
- Favicon (tab u browseru)
- App ikone (PWA, mobil)
- Male UI elemente

**Preporuka:** Koristiti samo ikonu (planine + figura) ili ikonu u krugu; na svijetloj i tamnoj pozadini. Dimenzije: 32×32 px (favicon), 180×180 / 192×192 za app ikone.

---

## 5. Paleta boja (iz vodiča)

Ove boje su ugrađene u `app/globals.css` kao dizajn tokeni. Ako dizajner dostavi točne HEX vrijednosti, zamijeni ih u `@theme`:

| Ime u vodiču   | HEX       | CSS token        | Primjena                          |
|----------------|-----------|------------------|-----------------------------------|
| **Dark Forest Green** | `#4a6044` | `brand-primary-green` | Planine, "WildHer" tekst       |
| **Dark Brown** | `#715d43` | `brand-earth-tone`   | "Adventures" tekst             |
| **Gold/Beige** | `#b19d70` | `brand-gold-beige`   | Sunce, staza/rijeka            |
| **Off-white**  | `#f2f2ec` | `brand-off-white`   | Figura penjača, tekst na tamnoj |
| **Charcoal**   | `#2c2c2c` | `brand-charcoal`    | Tamna pozadina                 |

**Primjeri u kodu:** `bg-brand-charcoal`, `text-brand-off-white`, `text-brand-primary-green`, `text-brand-earth-tone`, `text-brand-gold-beige`.

---

## 6. Šta treba za implementaciju

- **Vektorski logo (SVG)** ili **PNG u više rezolucija** (1x, 2x) za primarni i sekundarni logotip.
- **Ikona samo (SVG/PNG)** za favicon i uske prostore.
- **Verzija za tamnu pozadinu** (SVG ili PNG) s Off-white/zemljanim elementima.
- **Favicon set** (npr. 32×32, 180×180, 192×192) — može se generirati iz jedne visoke rezolucije.

Sve navedene elemente s nacrta možemo uzeti kao osnovu: paleta je u tokenima, pravila korištenja su u ovom dokumentu.

**Primarni logotip (službena slika):** `public/logo-primary.png` — horizontalno (ikona lijevo, tekst desno). Koristi se u headeru i na svijetlim pozadinama.

**Sekundarni logotip:** `public/logo-secondary.png` — vertikalno (ikona gore, „WildHer” i „Adventures” ispod). Za uske prostore, mobil, cover, društvene mreže.

**Verzija za tamnu pozadinu:** `public/logo-primary-dark.png` — puni logotip na tamnoj pozadini („WildHer” bijelo, „Adventures” zlatno). Za hero/footer s tamnom pozadinom.

**Varijanta stacked (alternativna):** `public/logo-stacked-alt.png` — ikona gore, „WildHer” (tamno zelena) i „adventures” (zlato/smeđa, lowercase). Blagi 3D/emboss na tekstu; koristi se kad želiš mekši, manje formalan dojam.

**Placeholder SVG datoteke** (za favicon i ako treba skalirana ikona):

| Datoteka | Opis |
|----------|------|
| `logo.svg` | Pun logotip (ikona + "WildHer" + "Adventures") za svijetlu pozadinu |
| `logo-dark.svg` | Isti logotip u bojama za tamnu pozadinu (Off-white, earth) |
| `logo-icon.svg` | Samo ikona (planine, sunce, penjač) — bez teksta |
| `logo-icon-dark.svg` | Ikona u svijetlim bojama za tamnu pozadinu |
| `logo-icon-circle.svg` | Placeholder ikona u krugu (SVG) |
| `logo-icon-mark.png` | **Službena ikona u krugu** — favicon, app ikona, avatar |
| `logo-primary-dark.png` | **Puni logotip na tamnoj pozadini** — hero, footer, dark sections |
| `logo-stacked-alt.png` | Stacked varijanta s „adventures” lowercase i 3D tekstom |

Favicon u browseru koristi `logo-icon-mark.png` (postavljeno u `app/layout.js`).
