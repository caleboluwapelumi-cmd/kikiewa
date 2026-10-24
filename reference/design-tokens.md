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
- Headings: Bodoni Moda (serif, editorial)
- Body and labels: Plus Jakarta Sans
- Labels: small, uppercase, wide letter-spacing

## Style
- Sharp corners on buttons and cards (no rounded pills)
- Generous whitespace, editorial layout, photography-led
- Primary button: solid primary, light text. Secondary: outlined.

## Content rules
- No invented credentials, statistics, prices, treatment claims or testimonials
- Unconfirmed values are stored as `'TBC'` in `data/site.ts` and render as a small muted "To be confirmed" label. Raw bracketed placeholders never appear on screen.
- Marketing copy written before client sign-off is marked `// DRAFT COPY - client approval needed`
- Locations: Ebute and Nitel are equals offering every service (reference/site-plan.md, section 2)
