# Kikiewa Website

Stack: Next.js (App Router), TypeScript, Tailwind v4, npm.

## Rules
- Design reference lives in /reference. The .png is the visual truth, the .html is the structure reference, design-tokens.md holds colours and fonts.
- Theme tokens are in app/globals.css. Never use arbitrary hex values or hardcoded fonts in components.
- All business content lives in /data/site.ts. Components read from it.
- Split UI into components in /components. Never paste exported HTML as one file.
- Use next/image, semantic HTML, alt text, mobile-first responsive layouts.
- Do not invent business facts. Use visible placeholders.
- Complete the whole prompt, run all checks, report and stop. One prompt = one unit of approval.

## Design reference
reference/site-plan.md is the source of truth for structure, copy and SEO. If any other
reference file disagrees with it, site-plan.md wins. competitor-study.md is for design
direction only; ignore its sitemap and any 'divisions' language.
