# Kikiewa brand assets

Traced from `Kikiewa_Peacock_Beauty_Logo.png` (1774×887) on 24 Oct 2026. These are clean web SVGs, good at any screen size. If the designer later supplies a true vector original, swap the files: the names stay the same.

## Where each file goes in the repo

| File | Put it in | Use |
|---|---|---|
| `public/brand/kikiewa-logo.svg` | `public/brand/` | **Master logo** (peacock + Kikiewa, no subtitle). Header, footer, OG image |
| `public/brand/kikiewa-logo-full.svg` | `public/brand/` | Original lockup with "Med Spa and Makeover". **Nitel/Medical Spa only** |
| `public/brand/kikiewa-mark.svg` | `public/brand/` | Peacock alone, full colour |
| `public/brand/kikiewa-logo-mono.svg` | `public/brand/` | One colour (`currentColor`), for plum/dark surfaces: footer, CTA band |
| `public/brand/kikiewa-mark-mono.svg` | `public/brand/` | One-colour peacock, for dividers, loader, small marks |
| `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png` | `app/` | Browser and home-screen icons (Next.js picks these up automatically) |
| `app/opengraph-image.png` | `app/` | Default social share image, 1200×630 |
| `public/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | `public/icons/` | For the booking-alerts app (PWA) later |

The `currentColor` files inherit the CSS text colour, so `<KikiewaLogo className="text-cream" />` turns it cream on plum. Inline them as React components (or with SVGR) rather than `<img>`, otherwise `currentColor` won't apply.

## Colours sampled from the logo

| Role | Logo colour | Old token (picked by eye) | Contrast on #FAF8F5 |
|---|---|---|---|
| Deep plum (tail) | `#5B0F53` | `#5A1F5E` | 12.1:1 ✅ any text |
| Magenta (wordmark, crest) | `#8A2174` | `#8E3F8F` | 7.8:1 ✅ any text |
| Orchid pink (neck, inner feathers) | `#C868A3` | `#C98BB9` | 3.3:1 ⚠️ large text/icons only, never body text |
| Tagline black | `#000000` | n/a | n/a |

The real brand is noticeably more saturated than the old tokens. Cream (`#FAF8F5`) on the logo plum is 12.1:1, so the footer and CTA band stay comfortably AA.
