# Kikiewa Design Tokens

The live values are in `app/globals.css`. This file records what they are and why.

## Colours

Brand colours were sampled from the logo (`public/brand/kikiewa-logo.svg`) on 24 Oct 2026. They replace the earlier values picked by eye.

| Token | Value | Use | Contrast on background #FAF8F5 |
|---|---|---|---|
| primary | #5B0F53 | Logo plum (tail). Buttons, key accents, footer and CTA band | 12.1:1, any text |
| primary-hover | #4A0C44 | Hover state for primary buttons | 13.9:1 with cream |
| secondary | #8A2174 | Logo magenta (wordmark, crest). Links, labels, icons, hover | 7.8:1, any text |
| accent | #C868A3 | Logo orchid (neck, inner feathers). Hairlines, tints, icons only | 3.3:1, **never text** |
| on-primary | #FFFFFF | Text on plum | 12.8:1 on primary |
| cream | = background | Mono logo and marks on plum surfaces | 12.1:1 on primary |
| background | #FAF8F5 | Page background | |
| surface | #F3F0EB | Section bands | |
| surface-2 / surface-3 | #EDEAE4 / #E7E3DC | Image frames, deeper bands | |
| surface-warm | accent 10% into background | Warm wash behind image placeholders | |
| clinical / clinical-2 / clinical-3 | #F5F6F6 / #ECEEEE / #E4E7E7 | Cool off-white scale for skin & aesthetics: page, bands, frames | |
| clinical-rule | #DADEDE | Hairlines on the cool scale | |
| foreground | #1A1A18 | Body text | 16.4:1 |
| muted | #66635D | Secondary text. Lowest pair is 4.7:1 on surface-3, so it clears AA 4.5:1 on every surface | 5.7:1 |

**Restraint:** the logo colours go on the logo, buttons and small accents only. Cream surfaces and photography carry the pages.

**The clinical dial:** the aesthetics service page (`/services/aesthetics`) is wrapped in the `tone-clinical` utility (`components/ServicePage.tsx`). Inside it, `background`, `surface`, `surface-2/3`, `border` and `border-strong` point at the cool scale, so shared components cool down on their own. Plum, type, buttons, the header, footer and closing band don't change: same brand, cooler room. Muted text stays above 4.5:1 on every cool surface (lowest: 4.8:1 on clinical-3).

## Logo

- `components/brand/Logo.tsx` inlines the logo SVGs. The full-colour logo reads its fills from the primary, secondary and accent tokens, so it always matches the theme.
- Header: full colour. Footer and plum CTA band: mono variant in cream.
- SVGs never go through `next/image`, and `images.dangerouslyAllowSVG` stays off.
- `components/brand/PeacockDivider.tsx`: the mono peacock between fine hairlines. At most once per page.

## Typography

Loaded with `next/font` in `app/layout.tsx`. Designed for 360px first.

- Headings: **Fraunces**, variable, latin subset, with the `opsz` axis only (weights 400 to 600 used). Optical size is set per tier: `opsz` 14 on small headings for sturdier strokes, rising to 18, 36 and 72 on the larger tiers. The `SOFT` axis is not loaded: it nearly doubled the font file (117KB to 65KB without it).
- Body and UI: **Outfit** 400, 500 and 600.
- Fluid scale with `clamp()` from 360px to 1440px:

| Token | 360px | 1440px | Line height |
|---|---|---|---|
| display-hero (H1) | 34px | 64px | 1.1 |
| headline-lg | 28px | 46px | 1.12 |
| headline-md | 22px | 28px | 1.2 |
| headline-sm | 20px | 22px | 1.2 |
| lead (serif) | 20px | 24px | 1.45 |
| body-lg | 17px | 18px | 1.6 |
| body-md | 16px | 16px | 1.6 |
| body-sm | 14px | 14px | 1.55 |
| button | 16px, Outfit 600 | | 1.25 |
| label-sm / label-md | 13px, Outfit, uppercase, 0.12em | | 1.4 |

- Body text never drops below 16px on phones. Small print (body-sm) is 14px; only uppercase labels go below that, at 13px.
- Eyebrow labels are always Outfit, never the serif.
- Headings use `text-wrap: balance`; paragraphs `text-wrap: pretty`.
- No hyphenation: `hyphens: none` on `html`, `overflow-wrap: break-word` only. Visible copy and metadata use no em or en dashes (`npm run check:seo` fails on them).

## Shape

| Token | Value | Use |
|---|---|---|
| radius-card | 16px | Cards, image frames, sheets, the lightbox |
| radius-input | 12px | Form fields and choice tiles |
| radius-chip | 999px | Buttons, chips and tags |
| radius-bar | 24px | The floating mobile action bar (inset 12px from the screen edges) |

Hairlines stay subtle (`border`, `border-strong`).

## Buttons

One `Button` component (`components/Button.tsx`) for every call to action. Pill shaped, at least 48px tall, about 14px by 28px padding, Outfit 600, sentence case, no letter-spacing, no arrows.

- `primary`: filled plum, cream text
- `secondary`: plum outline
- `onDark`: cream fill, plum text
- `whatsapp`: outline with the WhatsApp icon on the left (the only icon allowed)

States: hover darkens, shared focus ring, pressed `scale(0.97)`, disabled fades. Hero and closing band buttons stack full width on phones; elsewhere they sit at their natural width. Inline links inside sentences stay underlined text.

## Motion

CSS plus one small IntersectionObserver hook (`components/RevealOnScroll.tsx`). Transform and opacity only, and none of it runs under `prefers-reduced-motion`.

- Sections fade up 16px over 500ms; card grids stagger. Never above the fold.
- Hero: Ken Burns zoom, 1 to 1.06 over each slide, under the crossfade.
- Header: soft shadow and a slight shrink after 24px of scrolling.
- Mobile menu: slides in from the right over a fading backdrop.
- Accordions: smooth height via `interpolate-size` where supported.
- Images in cards: gentle zoom on hover, hover devices only.

## Style
- Generous whitespace, editorial layout, photography-led
- Section spacing tighter on phones (about 56 to 64px), generous on desktop

## Content rules
- No invented credentials, statistics, prices, treatment claims or testimonials
- Unconfirmed values are stored as `'TBC'` in `data/site.ts` and render as a small muted "To be confirmed" label. Raw bracketed placeholders never appear on screen.
- Marketing copy written before client sign-off is marked `// DRAFT COPY - client approval needed`
- Locations: Ebute and Nitel are equals offering every service (reference/site-plan.md, section 2)
