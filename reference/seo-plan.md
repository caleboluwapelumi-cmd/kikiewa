# Kikiewa — SEO Plan (v1)

Companion to `reference/copy-deck.md`. Written 24 Oct 2026.

**Goal:** lead Ikorodu (and rank in wider Lagos) local search for salon, spa, medical spa and beauty training searches, and win the Google Maps "near me" results for both locations.

**Search volumes are not included on purpose.** I don't have reliable Nigerian keyword data, and guessing would mislead. The keyword targets below are search *intent* patterns based on how competitors (Trosuit, ORÍKÌ) structure their pages. Validate them after launch with Google Search Console (free, real queries) and Google Keyword Planner.

---

## 1. Strategy in five lines

1. **One page per thing someone searches for:** every service, treatment, concern, course and location gets its own URL. A single "services" page can only rank for one search.
2. **Location pages are the core, the lesson from ORÍKÌ.** ORÍKÌ has a separate page per area ("Spa in Lekki", "Spa in Victoria Island"). Kikiewa gets `/locations/ebute` and `/locations/nitel`, each targeting "[service] in [area], Lagos".
3. **Google Business Profile drives Maps rankings more than the website does.** Set up one profile per location, with the name, address and phone exactly matching the site.
4. **The Medical Spa ranks on trust signals:** named, registered practitioners, a licence and consultation-first wording. Google holds health pages to a higher standard, and so does Nigerian medical advertising regulation.
5. **Two strong journal articles beat ten thin ones.** Publish only what answers a real question better than competitors do.

---

## 2. Location keywords: Ikorodu first

Both locations are in **Ikorodu, Lagos State**: Ebute (Salon & Spa) and Nitel (Medical Spa & Makeover).

- **Primary location keyword: "Ikorodu".** People search "salon in Ikorodu" and "spa in Ikorodu", not the sub-area. Every division page targets Ikorodu.
- **Secondary: "Ebute, Ikorodu" and "Nitel, Ikorodu".** Use these in location page titles, addresses, directions copy and the Business Profiles. They catch people searching with a landmark or bus stop in mind.
- **No cannibalisation.** Both locations target Ikorodu, but for different services (salon and spa vs medical spa), so the pages don't compete with each other.
- **The opportunity:** the premium competitors studied (Trosuit in Ikeja GRA, ORÍKÌ in VI, Lekki and Ikeja) are not in Ikorodu. A polished, well-structured site can realistically lead the Ikorodu searches for these services.
- Still needed from the client: full street addresses, the nearest well-known landmark or bus stop for each location, and Google Maps pins.

## 3. Page-by-page targets

Title ≤ 60 characters, meta description ≤ 155. One H1 per page, matching the copy deck.

| URL | Primary intent | Title | Meta description |
|---|---|---|---|
| `/` | Kikiewa brand; salon, spa and med spa in Ikorodu | Kikiewa \| Salon, Spa & Medical Spa in Ikorodu, Lagos | Beauty, in good hands. Hair, nails, spa, skin and aesthetic care at Kikiewa in Ikorodu, Lagos. Book online or chat on WhatsApp. |
| `/salon-spa` | salon and spa in Ikorodu | Salon & Spa in Ikorodu, Lagos \| Kikiewa | Hair, nails, massage and spa rituals at Kikiewa Salon & Spa, Ebute, Ikorodu. See services and prices, then book online or on WhatsApp. |
| `/salon-spa/[service]` | [service] in Ikorodu | {{Service}} in Ikorodu, Lagos \| Kikiewa | {{Service}} at Kikiewa Salon & Spa, Ebute, Ikorodu. {{Duration}}, from {{price}}. Book online or chat with us on WhatsApp. |
| `/medical-spa` | medical spa in Ikorodu | Medical Spa in Ikorodu, Lagos \| Kikiewa | Consultation-led skin and aesthetic treatments at Kikiewa Medical Spa, Nitel, Ikorodu. Book a consultation online or on WhatsApp. |
| `/medical-spa/[treatment]` | [treatment] in Ikorodu / Lagos | {{Treatment}} in Ikorodu, Lagos \| Kikiewa | {{Treatment}} at Kikiewa Medical Spa, Nitel, Ikorodu. Starts with a consultation to assess suitability. From {{price}}. |
| `/medical-spa/concerns/[concern]` | [concern] treatment in Ikorodu / Lagos | {{Concern}} Treatment in Ikorodu \| Kikiewa | Concerned about {{concern}}? Book a consultation at Kikiewa Medical Spa in Nitel, Ikorodu, to find the approach that suits your skin. |
| `/beauty-institute` | beauty school / training in Ikorodu, Lagos | Beauty School & Training in Ikorodu \| Kikiewa | Practical beauty courses in Ikorodu, Lagos: compare levels, duration, fees and intake dates at the Kikiewa Beauty Institute. |
| `/beauty-institute/[course]` | [course] course in Ikorodu / Lagos | {{Course}} Course in Ikorodu \| Kikiewa | {{Course}} at the Kikiewa Beauty Institute, Ikorodu. {{Duration}}, next intake {{date}}. See fees and how to apply. |
| `/locations` | Kikiewa locations Ikorodu | Our Locations in Ikorodu, Lagos \| Kikiewa | Kikiewa Salon & Spa in Ebute and Medical Spa in Nitel, both in Ikorodu, Lagos. Addresses, opening hours and directions. |
| `/locations/ebute` | salon / spa near Ebute, Ikorodu | Kikiewa Ebute, Ikorodu \| Salon & Spa | Find Kikiewa Salon & Spa in Ebute, Ikorodu: address, opening hours, directions and services. Book online or on WhatsApp. |
| `/locations/nitel` | medical spa near Nitel, Ikorodu | Kikiewa Nitel, Ikorodu \| Medical Spa | Find Kikiewa Medical Spa in Nitel, Ikorodu: address, opening hours, directions and treatments. Book a consultation. |
| `/gallery` | Kikiewa photos | Gallery \| Kikiewa Ikorodu | Inside Kikiewa: our salon, spa and medical spa spaces in Ikorodu, Lagos, and recent work from our team. |
| `/book` | book Kikiewa | Book an Appointment \| Kikiewa Ikorodu | Book a salon, spa or medical spa appointment at Kikiewa in Ikorodu, Lagos. Choose a service and time; we'll confirm on WhatsApp. |
| `/contact` | Kikiewa phone / contact | Contact Kikiewa \| Ikorodu, Lagos | Call, WhatsApp or message Kikiewa Salon & Spa (Ebute) and Medical Spa (Nitel), Ikorodu, Lagos. |
| `/journal` | blog | Journal \| Kikiewa | Practical advice on hair, skin and beauty in Lagos from the Kikiewa team in Ikorodu. |
| `/policies` | (not a target) | Booking & Cancellation Policy \| Kikiewa | How booking, deposits, cancellations and refunds work at Kikiewa. |

**Build rule:** titles and descriptions are generated from data. Dynamic names ({{Service}}, {{Treatment}}, {{Course}}) come from data; if a price or duration is TBC, drop that clause. Never output "TBC" in metadata. Add a test or script that fails if any title exceeds 60 characters, any description exceeds 155, or either contains "TBC" or "{{".

---

## 4. Structured data (JSON-LD)

Output only verified fields. Omit any TBC field rather than filling it in.

| Page | Schema |
|---|---|
| Every page | `Organization` (name, logo, url, sameAs = social links) in the root layout |
| `/locations/ebute`, `/salon-spa` | `BeautySalon` (or `DaySpa`) with name "Kikiewa Salon & Spa", address, geo, openingHoursSpecification, telephone, priceRange "₦₦–₦₦₦" (only once prices are confirmed), url, image |
| `/locations/nitel`, `/medical-spa` | `HealthAndBeautyBusiness` until licensing is confirmed. Switch to `MedicalClinic` only once the facility licence is verified |
| Service and treatment pages | `Service` with provider → the location's business, areaServed ["Ikorodu", "Lagos"], and `offers` with price + `priceCurrency: "NGN"` only when the price is confirmed |
| Course pages | `Course` with provider `EducationalOrganization` "Kikiewa Beauty Institute", and `hasCourseInstance` (courseMode, duration, startDate) when confirmed |
| All nested pages | `BreadcrumbList` |
| Pages with a visible FAQ | `FAQPage`, only for the FAQs actually rendered on that page |

Do **not** add `AggregateRating` or `Review` schema until real reviews are displayed on the page. Self-serving review markup can trigger a manual penalty.

---

## 5. Technical requirements

- Static generation for all marketing pages (`generateStaticParams` for dynamic routes).
- `app/sitemap.ts` listing every route, including dynamic ones. `app/robots.ts` disallows all unless `NEXT_PUBLIC_SITE_ENV === 'production'`.
- A canonical URL on every page, using `https://kikiewa.com` with no trailing slash. Filtered gallery URLs (`?division=`) canonicalise to `/gallery`.
- `<html lang="en-NG">`, and Open Graph `locale: en_NG`.
- Open Graph image: the default is in `app/opengraph-image.png`. Add division-specific ones later.
- Images: `next/image`, AVIF/WebP, correct `sizes`, hero images `priority`, and everything else lazy-loaded. The gallery is the largest LCP risk.
- Core Web Vitals targets on mobile: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Internal linking:
  - Each concern page links to its treatments, and each treatment links back to its concerns.
  - Each service or treatment links to its location page, and each location page lists its services.
  - Home links to all three divisions and both locations.
  - Breadcrumbs are visible on all nested pages.
- **Redirects:** if any old URLs or old site pages exist, list them and add 301 redirects in `next.config` before launch.

---

## 6. Google Business Profile (off-site, but the biggest local lever)

Create **two separate profiles**, one per location. Use the same name format on the site, the profiles and social media:

| Field | Ebute | Nitel |
|---|---|---|
| Business name | Kikiewa Salon & Spa | Kikiewa Medical Spa & Makeover |
| Area in address | Ebute, Ikorodu, Lagos State | Nitel, Ikorodu, Lagos State |
| Primary category | Beauty salon (or Day spa) | Medical spa (only if licensed; otherwise Skin care clinic) |
| Secondary | Hair salon, Nail salon, Massage spa | Skin care clinic, Facial spa |
| Website link | https://kikiewa.com/locations/ebute | https://kikiewa.com/locations/nitel |
| Booking link | https://kikiewa.com/book?division=salon-spa | https://kikiewa.com/book?division=medical-spa |

- Business Profile names must match the **real signage** at each location. If both signs just say "Kikiewa", use "Kikiewa" on both profiles and let the categories do the work.
- The **name, address and phone must be character-for-character identical** on the website, the Business Profile, Instagram bio and any directories. Even inconsistent abbreviations ("St." vs "Street") weaken the match.
- Upload 10+ real photos per profile (interiors, exterior with signage, team, work).
- Ask happy clients for Google reviews after every visit. Use a short link printed at reception and sent with the WhatsApp booking confirmation. Reply to every review.
- Post a monthly update to each profile (a new service, a seasonal offer or an institute intake).
- The Institute can share the Ebute profile or get its own if it has a separate entrance and signage. Google's rules require a real, staffed location for each profile.

---

## 7. Journal: the first articles

Publish two at launch, then one a month. Each must be genuinely useful, written or reviewed by the relevant team member, and link to the matching service.

| Working title | Target intent | Links to |
|---|---|---|
| How to care for your skin in Lagos heat and humidity | skincare routine for humid weather Nigeria | Medical Spa concerns, facials |
| Your bridal beauty timeline: what to book and when | bridal hair and makeup Lagos | Salon makeup, hair |
| What happens at a medical spa consultation | medical spa consultation what to expect | `/medical-spa` |
| Protective styles: how to keep natural hair healthy | protective styles natural hair care | Salon hair |
| Choosing a beauty course in Lagos: questions to ask | beauty school Lagos | `/beauty-institute` |

Medical articles must be reviewed by a qualified practitioner, show "Reviewed by {{name, role}}" with a date, and make no outcome claims.

---

## 8. Regulatory note (Medical Spa)

Advertising medical treatments in Nigeria is regulated: medical practitioners' professional rules restrict advertising, and some treatments may only be performed or promoted by licensed practitioners. This plan keeps all Medical Spa copy consultation-led and claim-free, but **the client must confirm in writing which treatments may be advertised** before any treatment page goes live. I'm not a lawyer; if in doubt, the client should check with her regulatory adviser.

---

## 9. Launch checklist

- [ ] Area names confirmed and filled in (section 2)
- [ ] Every title ≤ 60 and description ≤ 155, with no TBC or `{{` in metadata
- [ ] JSON-LD validates in Google's Rich Results Test, with no placeholder values
- [ ] The sitemap lists every route; robots allows crawling only on production
- [ ] `NEXT_PUBLIC_SITE_ENV=production` set in Vercel
- [ ] Search Console verified for kikiewa.com and the sitemap submitted
- [ ] Both Google Business Profiles live, with the name, address and phone matching the site
- [ ] `npm run check:images` passes (no Instagram placeholders)
- [ ] Lighthouse mobile: SEO and Accessibility ≥ 90 on Home, Medical Spa and Gallery
- [ ] 301 redirects added for any old URLs
