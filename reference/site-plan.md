# Kikiewa — Site Plan & Copy (v4)

**This file replaces `copy-deck.md` and `seo-plan.md`.** It is the single source for structure, copy and SEO. Written 24 Oct 2026 from the client's brief form. **v4 (25 Oct 2026, prompt E):** the Kikiewa method ("How we work") drives the copy; Ebute and Nitel are "branches"; Google Maps; Shop; designed image placeholders.

Status: DRAFT copy for client approval. Store all copy in `data/site.ts`, marked `// DRAFT COPY - client approval needed`.

---

## 0. What we know (from the client)

- **Kikiewa is one business.** A med spa at its core, with beauty services (hair, barbing, nails, makeup) alongside, an academy and a shop. Registered name: to be confirmed (something like "Kikiewa Beauty & Spa"). On screen, the brand is simply **Kikiewa**.
- **Two branches, both in Ikorodu, Lagos: Ebute and Nitel.** They are equals: same layout, all six services, no "main" branch. Never call either one a head office, or a branch for one type of service.
- **Customers:** within Lagos.
- **Vision (her words):** everyone is beautiful in their own way, and Kikiewa brings that beauty out.
- **Mission (her words):** bringing expertise and professional know-how to work on you, so your beauty can be seen and felt.
- **Her method (how every visit works):** (1) Consultation: understand, feel and empathise. (2) A tailored solution. (3) Professional, problem-solving delivery. (4) The client leaves satisfied, their beauty brought out. Principles: Empathy · Tailored care · Professionalism · Problem-solving.
- **Services she most wants booked** that we can show: **facials** and **massage**.
- **Courses:** (1) **Cosmetology:** hair dressing and styling, barbing, nails and nail artistry, makeup, manicure and pedicure. (2) **Aesthetics:** facials and massage.

### Not on the website (decided)
These carry legal or reputational risk, so they are deliberately left off the site. The client can still offer them in person.
- Buttock injectables, body fillers, and any filler or injectable named by product
- Weight-loss injections or medication
- "Face ammunization" (unclear what it is; add only once clarified and confirmed safe to advertise)
- Before/after photos without the client's written consent
- Outcome promises ("results guaranteed", "permanent", "painless")
- Product claims beyond what the client supplies (shop)

---

## 1. The brand in one line

> # Your beauty, seen and felt.
> *Everyone is beautiful in their own way. We bring it out.*

This comes straight from her vision and mission. It also matches the peacock in the logo, a bird made to be seen.

**Voice:** warm, assured, simple. Short sentences. Talk to "you". No hype words (best, No. 1, world-class, flawless, perfect, guaranteed, miracle, painless). No "division", "house" or "head office" on screen. Ebute and Nitel are "our branches" ("Ebute branch", "Nitel branch"); never "two locations, the same Kikiewa".

**How we work** (the Kikiewa method; drives all communication, replaces the old three values):
- H2 *How we work* · *Every visit follows the same path, whatever brings you in.*
1. **We listen.** Every visit starts with a consultation. We take time to understand what you'd like, how you feel, and what matters to you.
2. **We tailor.** No two people are the same, so no two plans are. We recommend a solution built around you, and explain why.
3. **We solve, professionally.** Expert hands, high standards and a problem-solving mindset, applied carefully to every treatment.
4. **We bring your beauty out.** You leave satisfied, your beauty seen and felt, with advice to keep it that way.
- Principles row: Empathy · Tailored care · Professionalism · Problem-solving
- Short step names (Home, service pages): We listen · We tailor · We solve · We bring your beauty out
- One-line strip: *Listen. Tailor. Solve. Bring your beauty out.* → /about#how-we-work

**CTA labels:** Book an appointment · Book · Chat on WhatsApp · Call us · View services · See our work · See our courses · Get directions · Book a consultation (aesthetics only) · Order on WhatsApp (shop).

---

## 2. Site structure

### Navigation
**About · Services ▾ · Shop · Academy · Gallery · Branches · Contact** + **Book** button + WhatsApp icon. The logo links home (no "Home" item). Shop is hidden while the shop is off (production with no products).

Services dropdown: Facials · Massage & Spa · Aesthetics · Hair & Barbing · Nails · Makeup

Mobile action bar: **Book · WhatsApp · Call** (Call lists *Ebute branch* / *Nitel branch*; each calls its own line, or the business line until that is confirmed)

### Pages
```
/                         Home
/about                    About Kikiewa (#how-we-work)
/services                 All services
/services/facials
/services/massage
/services/aesthetics
/services/hair            (includes barbing)
/services/nails
/services/makeup
/shop                     Shop (404 in production until real products exist)
/shop/[product]
/academy                  Kikiewa Academy
/academy/cosmetology
/academy/aesthetics
/gallery                  Our work
/locations                Our branches (URL stays /locations)
/locations/ebute          (same layout as Nitel: equal pages, for local search)
/locations/nitel
/book
/contact
/booking-policy
/privacy
```
Plus `/sitemap.xml` (indexable pages only; the shop only once products exist) and `/robots.txt`.

### Redirects (permanent, 308)
| Old | New |
|---|---|
| /salon-spa, /salon-spa/* | /services |
| /medical-spa, /medical-spa/* | /services/aesthetics |
| /beauty-institute, /beauty-institute/* | /academy |
| /licensing | /about |

### Data model
Services do not belong to a branch. Every service is offered at **both** branches unless a service has `locations: ['ebute']` or `['nitel']` set explicitly (only when the client says so).

### Images: no empty spaces
Every image slot without a photograph shows a designed placeholder in the same frame and aspect ratio: a soft gradient from cream into plum, the mono peacock mark centred at low opacity, and (previews only) a small sans caption saying what goes there, e.g. "Our work · Nails". Screen readers hear "Photo coming soon". Placeholders are not stock; Our work, Gallery, classes and team still refuse stock photographs.

---

## 3. Home `/`

### 3.1 Hero slider
Full-screen image slider: 4 slides, crossfade, dark gradient at the bottom for legible text, caption and button per slide.

| # | Image | Heading (H1 on slide 1 only; others are styled the same but not H1) | Line | Button |
|---|---|---|---|---|
| 1 | Calm treatment room or client relaxing | **Your beauty, seen and felt.** | Everyone is beautiful in their own way. At Kikiewa, we bring it out. | Book an appointment |
| 2 | Facial in progress | Skin that feels as good as it looks. | Facials and skin treatments, matched to your skin. | Explore facials |
| 3 | Massage | Switch off. Breathe out. | Massage and spa treatments to release the week. | Explore massage |
| 4 | Hair, nails or makeup finish | Finished to be seen. | Hair, barbing, nails and makeup, done with care. | View services |

Slider rules: autoplay 6s; pause on hover and focus; visible pause/play button; previous/next arrows and dot indicators (keyboard operable, labelled); no autoplay or motion under `prefers-reduced-motion` (show slide 1 static); first image `preload`/eager, the rest lazy; swipe on mobile; slide captions are real text (not baked into images). No slider library unless asked; build it on CSS + a small client component.

### 3.2 Mini about
- Eyebrow: About Kikiewa
- **H2:** Everyone is beautiful in their own way.
- Body: Kikiewa exists to bring that beauty out. We bring expertise and professional know-how to every treatment, so your beauty can be seen and felt. Facials, massage, aesthetics, hair, nails and makeup, all under one name in Ikorodu, Lagos.
- Link: More about us → /about
- Beside it: one portrait image and **How we work** as a compact numbered list of the four step names (We listen · We tailor · We solve · We bring your beauty out)

### 3.3 What we do
- **H2:** What we do
- Intro: Whatever brings you in, we start by listening.
- Six cards (image, name, one line, link):

| Card | Line | Link |
|---|---|---|
| Facials | Deep cleansing, hydrating and glow facials, matched to your skin. | /services/facials |
| Massage & Spa | Massages that release tension and help you fully switch off. | /services/massage |
| Aesthetics | Advanced skin treatments, always starting with a consultation. | /services/aesthetics |
| Hair & Barbing | Styling, treatments and clean, sharp cuts. | /services/hair |
| Nails | Manicures, pedicures and nail art, finished with precision. | /services/nails |
| Makeup | For your big day, a night out, or a photoshoot. | /services/makeup |

### 3.4 Our work
- **H2:** Our work
- Intro: A few recent favourites from our team.
- Grid of 6 tiles (one per service); each tile shows the service name on hover/focus and links to that service page. Placeholders until photographs arrive. Button: See our work → /gallery

### 3.5 Academy
- Eyebrow: Kikiewa Academy
- **H2:** Learn the craft from the people who practise it.
- Body: Practical training in cosmetology and aesthetics, taught by the team behind Kikiewa.
- Left: slideshow of 4 class photos (same slider component; captions optional; placeholders until supplied; same accessibility rules)
- Right: two course cards: **Cosmetology** (Hair, barbing, nails, makeup, manicure and pedicure) · **Aesthetics** (Facials and massage). Each: View course. Main button: See our courses.

### 3.6 Testimonials
- **H2:** What our clients say
- Slider of quote cards: quote, first name + last initial, service (optional), star rating only if it comes from Google.
- **Only real testimonials, with permission.** Sources: Google reviews, WhatsApp/Instagram messages the client has received (with the customer's OK).
- Until real ones exist: the section renders only when `NEXT_PUBLIC_SITE_ENV !== 'production'`, showing clearly labelled placeholders ("Client testimonial, to be supplied"). In production with no testimonials, the section is hidden.

### 3.7 Branches
- **H2:** Our branches
- Intro: Two branches in Ikorodu, both offering our full range of services.
- Two equal cards: **Ebute branch** · **Nitel branch**: address, hours, phone, Book here, Get directions.

### 3.8 Closing CTA band (all pages)
- **H2:** Come in. Leave in full feather.
- Body: Tell us what you'd like. We'll listen, and tailor the rest.
- Buttons: Book an appointment · Chat on WhatsApp

### 3.9 Footer
- Logo + line: *Your beauty, seen and felt.*
- Columns: **Services** (six links) · **Kikiewa** (About, Shop, Academy, Gallery, Branches, Contact; Shop only while the shop is on) · **Visit** (Ebute address/hours, Nitel address/hours) · **Follow** (socials when confirmed)
- Bottom: © {year} Kikiewa · Booking policy · Privacy
- Small note: Aesthetic treatments follow a consultation and suitability assessment. Results vary from person to person.

---

## 4. About `/about`

1. **Hero:** H1 *Everyone is beautiful in their own way.* Sub: We exist to bring that beauty out.
2. **Our story:** H2 *Our story*. {{client: how Kikiewa started, founder name, year, the meaning of "Kikiewa"}}. Hidden until supplied.
3. **Vision & mission:** two side-by-side statements.
   - **Our vision:** A world where everyone sees the beauty they already have, and is helped to bring it out.
   - **Our mission:** To bring expertise and professional know-how to every client, so their beauty can be seen and felt.
4. **How we work** (`id="how-we-work"`): the full method from section 1: H2, intro, the four numbered steps with their lines, beside a portrait; the principles row beneath.
5. **We keep learning:** To serve you better, our team keeps training and growing, inside the beauty industry and beyond. Two photographs.
6. **Our team:** hidden until real names and roles exist.
7. **Our branches:** short strip (Visit us · *Our branches* · Two branches in Ikorodu, both offering our full range of services. · Find us → /locations).
8. Closing band.

---

## 5. Services

### `/services` (hub)
- **H1:** Our services
- Sub: Facials, massage, aesthetics, hair, nails and makeup, available at both our Ikorodu branches.
- Six large cards (same as Home §3.3), then a short "Not sure what to book?" block: *Tell us what you'd like and we'll recommend the right treatment.* Button: Chat on WhatsApp.

### Service page template (all six)
1. **Hero:** image, eyebrow "Services", H1, one line, Book an appointment · Chat on WhatsApp
2. **Intro:** 2–3 sentences
3. **Menu:** each item = name · one line · duration · from price (TBC allowed) · Book. Name items by benefit ("Hydrating Facial", not "Facial B"). Item names below are **suggestions for the client to confirm or replace**; show only confirmed ones in production.
4. **What to expect:** the one-line strip *Listen. Tailor. Solve. Bring your beauty out.* (→ /about#how-we-work), then the SAME four steps on every page (We listen · We tailor · We solve · We bring your beauty out), each with a line for this service.
5. **Our work:** gallery filtered to this service; 3 placeholder tiles until photographs arrive.
6. **FAQs:** render only questions with confirmed answers. Every page except aesthetics opens with: *Do I need a consultation?* · *Every visit starts with a short consultation so we can tailor the service to you. It's part of your appointment.*
7. **Testimonials** for this service (same rules as Home)
8. Closing band

### Per-page copy

**Facials** `/services/facials`
- H1: Facials · Line: Skin that feels as good as it looks.
- Intro: Every facial starts with a look at your skin and a chat about what you'd like. Then we cleanse, treat and finish with care, and send you home with simple advice to keep the glow going.
- Suggested menu: Deep Cleansing Facial · Hydrating Facial · Glow Facial · Facial for Men (Dermaplaning confirmed)
- Expect: listen = A skin check and a chat about your goals. · tailor = We choose the facial and products for your skin. · solve = We cleanse, treat and massage with care. · bring out = Your finish, plus simple advice to keep the glow.
- FAQs: Do I need a consultation? · How often should I have a facial? · Can I wear makeup afterwards? · Is it suitable for sensitive skin?

**Massage & Spa** `/services/massage`
- H1: Massage & Spa · Line: Switch off. Breathe out.
- Intro: Choose the pressure and the pace. Our therapists work with you to release tension, ease tired muscles and give your mind a proper rest.
- Suggested menu: Relaxing Massage · Deep Tissue Massage · Couples Massage · Body Scrub
- Expect: listen = Tell us how you feel, where you hold tension and the pressure you like. · tailor = We choose the massage, pressure and pace to suit you. · solve = Skilled hands work through tension carefully, at your pace. · bring out = Take your time afterwards, with simple tips to keep the calm going.
- FAQs: Do I need a consultation? · What should I wear? · Can I choose a male or female therapist? · Can I book for two?

**Aesthetics** `/services/aesthetics`
- H1: Aesthetics · Line: Advanced skin care, always starting with a consultation.
- Intro: For concerns a facial can't reach, our aesthetic treatments go further. Every one begins with a consultation, so you only ever get what's right for your skin.
- Menu: **only treatments the client confirms in writing are licensed and safe to advertise.** Placeholder until then: "Aesthetic consultation". Every item shows "Consultation required" and uses **Book a consultation**.
- Expect (consultation, suitability and aftercare wording, nothing stronger): listen = A consultation: we listen to what you'd like to address and take a short medical history. · tailor = We check suitability, explain your options, costs and what to expect, and agree a plan. · solve = Your treatment, carried out by our team at a pace you're comfortable with. · bring out = Clear aftercare advice, and we check in afterwards where your treatment calls for it.
- FAQs (its own consultation FAQ, not the shared one): What happens at a consultation? · Is there a consultation fee? · Will I see results after one session? (Answer: Results vary from person to person; we'll talk you through what's realistic.)
- Disclaimer on this page: Treatments follow a consultation and suitability assessment. Results vary from person to person.

**Hair & Barbing** `/services/hair`
- H1: Hair & Barbing · Line: Styled, cut and cared for.
- Intro: From protective styles and treatments to clean, sharp cuts, our stylists and barbers take the time to get it right for your hair.
- Suggested menu: Styling · Hair Treatment · Braids & Protective Styles · Haircut & Barbing
- Expect: listen = A chat about the style or cut you'd like, and a look at your hair. · tailor = We recommend the style, treatment or cut that suits your hair. · solve = Wash and prep, then we style or cut with care. · bring out = Your finished look, plus tips to keep your hair healthy.
- FAQs: Do I need a consultation? · How long will my appointment take? · Do you cut men's hair?

**Nails** `/services/nails`
- H1: Nails · Line: Finished with precision.
- Intro: Clean shapes, neat cuticles and colour that lasts. Keep it simple or ask for nail art.
- Suggested menu: Manicure · Pedicure · Gel Polish · Nail Art
- Expect: listen = Tell us the look you'd like, or bring a photo. · tailor = We suggest the shape, finish and colour to suit you. · solve = Shape and prep, then colour or art, applied with precision. · bring out = Your finished nails, plus care tips to make them last.
- FAQs: Do I need a consultation? · Can I bring a design I like? · How long does gel polish last?

**Makeup** `/services/makeup`
- H1: Makeup · Line: For the moments you want to remember.
- Intro: Bridal, events, photoshoots or just because. We match your makeup to your skin, your outfit and the occasion.
- Suggested menu: Bridal Makeup · Event Makeup · Photoshoot Makeup
- Expect: listen = Tell us about the occasion, your outfit and the look you love. · tailor = We plan a look matched to your skin and the occasion. · solve = Skin prep, then your makeup, applied with care. · bring out = Final touches, so you're ready for your moment.
- FAQs: Do I need a consultation? · Do you offer trials? · Can you come to my venue? · How early should I book for a wedding?

---

## 6. Academy `/academy`

1. **Hero:** H1 *Learn the craft from the people who practise it.* Sub: Practical courses in cosmetology and aesthetics at Kikiewa, Ikorodu. You'll learn the Kikiewa way: listen, tailor, solve, and bring the beauty out in every client. Buttons: See our courses · Chat on WhatsApp
2. **Why train with us:** three points: *Taught by working professionals* · *Practical classes, learned by doing* · *Small groups* {{confirm}}
3. **Courses:** two cards, each with: what you'll learn, duration {{TBC}}, fee {{TBC}}, next intake {{TBC}}, certificate {{TBC}}, View course
   - **Cosmetology:** Hair dressing and styling, barbing, nails and nail artistry, makeup, manicure and pedicure.
   - **Aesthetics:** Facials and massage.
4. **Inside our classes:** photo slideshow (4; placeholders until supplied)
5. **How to apply:** Choose your course → Visit or message us → Enrol {{requirements TBC}}
6. **Student testimonials** (real only, same rules)
7. **FAQs:** Do I need experience? · Are classes weekdays or weekends? · Do I get a certificate? (render only confirmed answers)

**Course pages** `/academy/cosmetology`, `/academy/aesthetics`: H1 course name, overview, "What you'll learn" (first item: *The Kikiewa way: listen, tailor, solve, and bring the beauty out in every client*, then the modules above), facts table (duration, schedule, fee, intake, certificate, all TBC-aware), how to apply, CTA (… visit either branch …).

---

## 7. Other pages

**Gallery** `/gallery`: H1 *Our work* · Sub: Recent work from our team. Filters: All · Facials · Massage & Spa · Aesthetics · Hair & Barbing · Nails · Makeup · Academy. Native `<dialog>` lightbox. No client faces or before/afters without written consent. Until photographs arrive: a short note and one placeholder tile per service.

**Branches** `/locations`: H1 *Our branches* · Sub: Visit us at our Ebute or Nitel branch in Ikorodu, Lagos. Two equal cards, each with a click-to-load map. `/locations/ebute` and `/locations/nitel` use identical layouts: H1 *Ebute branch* / *Nitel branch*; address, landmark, hours table, phone, Book here, Call this branch, Chat on WhatsApp, Get directions, map, "Services at this branch" (all six), "Our other branch".

**Branch data** (`data/site.ts`):
- **Ebute** (FROM GOOGLE LISTING, client to confirm): 62 Beach Road, Ebute Ipakodo Road, beside Kingfield College, Ikorodu, Lagos 104101 · pin 6.6390909, 3.4734478 · place ID ChIJm-5QaI_vOxARHWLfjx849fI · phone TBC (shows the business line 0706 621 2933).
- **Nitel:** Obafemi Awolowo Road, Oke-Ota Ona, Ikorodu, Lagos (street number TBC) · no pin or place ID yet (Maps searches the address; a pin can be added later with no code change) · phone TBC (shows the business line). Do not use the Oba Sekumade Road listing.
- **Hours, both** (PROVISIONAL, client to confirm): Monday to Saturday 8:00 to 18:00, Sunday closed. Stored per day; drives the hours tables, booking times and JSON-LD.

**Google Maps** (no API key, no dependency):
- *Get directions* on every branch card and page: `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}&destination_place_id={place_id}`; without a pin, `destination=` the search text (Nitel: `Kikiewa+Obafemi+Awolowo+Road+Oke-Ota+Ona+Ikorodu+Lagos`). Opens the Maps app on phones.
- *Map* on branch pages, /locations and /contact: a click-to-load facade (styled card with the address and a *Show map* button). Only a tap loads the iframe: `https://maps.google.com/maps?q={lat},{lng}&z=16&output=embed` (without a pin: `q={address}&z=15`), title "Map showing Kikiewa {branch} branch", lazy, rounded, 16:10 (4:3 on phones). Never on initial page load.

**Book** `/book`: H1 *Book an appointment* · Sub: Choose your treatment and a time that suits you. We'll confirm on WhatsApp.
Steps: 1 *What would you like?* (service) → 2 *Which branch suits you?* (Ebute branch / Nitel branch; "Both branches offer every service.") → 3 *Preferred date & time* (from each branch's hours: hourly starts, last one hour before closing, no Sundays) → 4 *Your details* (notes: *Anything you'd like us to know?* · *Your goals, concerns or preferences.*) → 5 *Review & send*. Aesthetics items say: *This starts with a consultation. We'll book that first.* Confirmation: *Thank you. We'll message you to confirm your time and to hear a little more about what you'd like.*

**Contact** `/contact`: H1 *Contact us* · Sub: The quickest way to reach us is WhatsApp. Two branch cards (with maps) + a message form (What's it about? Services / Academy / Something else).

**Shop** `/shop`, `/shop/[product]`:
- Product: slug, name, category, summary, description?, size?, price? (naira, or TBC), image?, nafdacNumber?, howToUse?, inStock?. **No real products are seeded**; only what the client supplies, with no claims beyond it.
- Previews with no products show 3 cards labelled *Sample product, to be supplied*. Production with no products: Shop hidden from nav and footer, /shop is a 404, not in the sitemap.
- `/shop`: H1 *Shop* · Sub: Take the Kikiewa experience home. · category filter (`?category=`, built from the products present) · grid: image, name, size, price or *Price on request*, *Order on WhatsApp*.
- `/shop/[product]`: image, name, price, size, description, How to use (only if supplied), NAFDAC number (only if supplied), *Order on WhatsApp* (prefilled: "Hello Kikiewa, I'd like to order {product} ({size}). Sent from kikiewa.com"), related products.
- Phase 2: Paystack checkout.

**Booking policy, Privacy:** headings only, with content from the client. **404:** *We couldn't find that page.* Links to Home, Services, Book.

---

## 8. SEO

Primary location keyword: **Ikorodu**. Titles ≤ 60 chars, descriptions ≤ 155, no "TBC" or "{{", no en or em dashes in built pages.

| URL | Title | Description |
|---|---|---|
| / | Kikiewa \| Med Spa, Facials & Beauty in Ikorodu, Lagos | Your beauty, seen and felt. Facials, massage, aesthetics, hair, nails and makeup at Kikiewa in Ikorodu, Lagos. Book online or on WhatsApp. |
| /about | About Kikiewa \| Med Spa & Beauty in Ikorodu | Everyone is beautiful in their own way. Meet Kikiewa, the med spa and beauty studio in Ikorodu, Lagos, that brings it out. |
| /services | Med Spa & Beauty Services in Ikorodu \| Kikiewa | Facials, massage, aesthetics, hair and barbing, nails and makeup at Kikiewa's two branches in Ikorodu, Lagos. See prices and book. |
| /services/facials | Facials in Ikorodu, Lagos \| Kikiewa | Deep cleansing, hydrating and glow facials at Kikiewa in Ikorodu, Lagos, matched to your skin. See prices and book online. |
| /services/massage | Massage & Spa in Ikorodu, Lagos \| Kikiewa | Relaxing and deep tissue massage at Kikiewa in Ikorodu, Lagos. Switch off, breathe out. See prices and book online. |
| /services/aesthetics | Aesthetic Skin Treatments in Ikorodu \| Kikiewa | Advanced aesthetic skin treatments at Kikiewa in Ikorodu, Lagos, always starting with a consultation. Book a consultation online. |
| /services/hair | Hair Salon & Barbing in Ikorodu \| Kikiewa | Hair styling, treatments, braids and barbing at Kikiewa in Ikorodu, Lagos. See prices and book online or on WhatsApp. |
| /services/nails | Nails, Manicure & Pedicure in Ikorodu \| Kikiewa | Manicures, pedicures, gel and nail art at Kikiewa in Ikorodu, Lagos. See prices and book online or on WhatsApp. |
| /services/makeup | Makeup Artist in Ikorodu, Lagos \| Kikiewa | Bridal, event and photoshoot makeup at Kikiewa in Ikorodu, Lagos, matched to your skin and occasion. Book online. |
| /shop | Skincare & Beauty Products in Ikorodu \| Kikiewa | Shop skincare and beauty products from Kikiewa in Ikorodu, Lagos. Order on WhatsApp. |
| /shop/[product] | {Product} \| Kikiewa Shop | {Description or summary} Order on WhatsApp from Kikiewa, Ikorodu. |
| /academy | Beauty School in Ikorodu, Lagos \| Kikiewa Academy | Practical cosmetology and aesthetics courses at Kikiewa Academy, Ikorodu. Learn from the people who practise the craft. |
| /academy/cosmetology | Cosmetology Course in Ikorodu \| Kikiewa Academy | Learn hair styling, barbing, nails, makeup, manicure and pedicure at Kikiewa Academy in Ikorodu, Lagos. See fees and how to apply. |
| /academy/aesthetics | Aesthetics Course in Ikorodu \| Kikiewa Academy | Learn facials and massage at Kikiewa Academy in Ikorodu, Lagos. Practical training from working professionals. See how to apply. |
| /gallery | Our Work \| Kikiewa Ikorodu | Recent facials, hair, nails, makeup and more from the team at Kikiewa in Ikorodu, Lagos. |
| /locations | Kikiewa Branches in Ikorodu, Lagos | Visit Kikiewa at our Ebute or Nitel branch in Ikorodu, Lagos: addresses, opening hours, phone numbers and directions. |
| /locations/ebute | Kikiewa Ebute Branch, Ikorodu \| Med Spa & Beauty | Kikiewa's Ebute branch in Ikorodu: facials, massage, aesthetics, hair, nails and makeup. Address, hours and directions. |
| /locations/nitel | Kikiewa Nitel Branch, Ikorodu \| Med Spa & Beauty | Kikiewa's Nitel branch in Ikorodu: facials, massage, aesthetics, hair, nails and makeup. Address, hours and directions. |
| /book | Book an Appointment \| Kikiewa Ikorodu | Book facials, massage, aesthetics, hair, nails or makeup at Kikiewa in Ikorodu, Lagos. Choose a time; we'll confirm on WhatsApp. |
| /contact | Contact Kikiewa \| Ikorodu, Lagos | Call, WhatsApp or message Kikiewa, or visit our Ebute or Nitel branch in Ikorodu, Lagos. |

**Structured data:** `Organization` site-wide. On each branch page, `BeautySalon` named "Kikiewa Ebute" / "Kikiewa Nitel" (switch to `MedicalClinic` only if the client confirms a medical licence) with only verified fields: address, telephone, `openingHoursSpecification` from the per-day hours, and `geo` + `hasMap` (`https://www.google.com/maps/place/?q=place_id:{id}`) only for a branch with a pin (Ebute today). `Service` on service pages (no `offers` until prices are confirmed). `Product` on product pages (offers only when the price is confirmed; no rating or review markup). `Course` on course pages. `BreadcrumbList` on nested pages. `FAQPage` only for rendered, confirmed FAQs. No review schema until real reviews are shown.

**Google Business Profile:** one per branch, named to match the signage at each (likely "Kikiewa"). Both list the same categories (primary: Medical spa or Beauty salon, depending on licence; secondary: Facial spa, Massage spa, Hair salon, Nail salon). Name, address and phone identical to the site.

---

## 9. Client checklist (before launch)

1. Registered business name
2. **Ebute:** confirm the Google listing address, pin, landmark, and its own phone/WhatsApp. **Nitel:** street number, landmark, a Google Maps pin (place ID), phone/WhatsApp. **Both:** confirm the provisional hours (Mon to Sat 8:00 to 18:00, Sun closed)
3. Confirm all services are offered at both branches (or say which aren't)
4. Service menus: names, durations and from-prices
5. Aesthetics: written list of treatments that are licensed and safe to advertise
6. What "face ammunization" is
7. Academy: course durations, fees, schedule, intakes and certificate
8. Founder story, the meaning of "Kikiewa", year founded
9. Team names and roles (optional)
10. 3–6 real testimonials with permission, or a Google reviews link
11. Photos: hero slides (4), service images (6+), past work (6+), academy classes (4+)
12. Social links
13. Booking and cancellation policy
14. Approve the "How we work" copy and the per-service "What to expect" lines
15. Shop: products with name, category, size, price, photo, NAFDAC number, description and how to use, exactly as on the pack
