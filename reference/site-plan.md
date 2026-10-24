# Kikiewa — Site Plan & Copy (v3)

**This file replaces `copy-deck.md` and `seo-plan.md`.** It is the single source for structure, copy and SEO. Written 24 Oct 2026 from the client's brief form.

Status: DRAFT copy for client approval. Store all copy in `data/site.ts`, marked `// DRAFT COPY - client approval needed`.

---

## 0. What we know (from the client)

- **Kikiewa is one business.** A med spa at its core, with beauty services (hair, barbing, nails, makeup) alongside, and an academy. Registered name: to be confirmed (something like "Kikiewa Beauty & Spa"). On screen, the brand is simply **Kikiewa**.
- **Two locations, both in Ikorodu, Lagos: Ebute and Nitel.** They are equals. Never call either one a head office, a branch, or a location for one type of service.
- **Customers:** within Lagos.
- **Vision (her words):** everyone is beautiful in their own way, and Kikiewa brings that beauty out.
- **Mission (her words):** bringing expertise and professional know-how to work on you, so your beauty can be seen and felt.
- **Services she most wants booked** that we can show: **facials** and **massage**.
- **Courses:** (1) **Cosmetology:** hair dressing and styling, barbing, nails and nail artistry, makeup, manicure and pedicure. (2) **Aesthetics:** facials and massage.

### Not on the website (decided)
These carry legal or reputational risk, so they are deliberately left off the site. The client can still offer them in person.
- Buttock injectables, body fillers, and any filler or injectable named by product
- Weight-loss injections or medication
- "Face ammunization" (unclear what it is; add only once clarified and confirmed safe to advertise)
- Before/after photos without the client's written consent
- Outcome promises ("results guaranteed", "permanent", "painless")

---

## 1. The brand in one line

> # Your beauty, seen and felt.
> *Everyone is beautiful in their own way. We bring it out.*

This comes straight from her vision and mission. It also matches the peacock in the logo, a bird made to be seen.

**Voice:** warm, assured, simple. Short sentences. Talk to "you". No hype words (best, No. 1, world-class, flawless, perfect, guaranteed, miracle, painless). No "division", "house", "branch" or "head office" on screen.

**How we work** (three values, reused across the site):
1. **We take our time.** No rushing you to make room for the next booking.
2. **We're honest with you.** We tell you what will suit you, what it costs and what to expect.
3. **We do it beautifully.** Careful work, and a finish you'll be proud to show.

**CTA labels:** Book an appointment · Book · Chat on WhatsApp · Call us · View services · See our work · See our courses · Get directions · Book a consultation (aesthetics only).

---

## 2. Site structure

### Navigation
**Home · About · Services ▾ · Academy · Gallery · Locations · Contact** + **Book** button + WhatsApp icon

Services dropdown: Facials · Massage & Spa · Aesthetics · Hair & Barbing · Nails · Makeup

Mobile action bar: **Book · WhatsApp · Call** (Call asks "Which location?": Ebute / Nitel)

### Pages
```
/                         Home
/about                    About Kikiewa
/services                 All services
/services/facials
/services/massage
/services/aesthetics
/services/hair            (includes barbing)
/services/nails
/services/makeup
/academy                  Kikiewa Academy
/academy/cosmetology
/academy/aesthetics
/gallery                  Our work
/locations                Both locations
/locations/ebute          (same layout as Nitel: equal pages, for local search)
/locations/nitel
/book
/contact
/booking-policy
/privacy
```

### Redirects (permanent, 308)
| Old | New |
|---|---|
| /salon-spa, /salon-spa/* | /services |
| /medical-spa, /medical-spa/* | /services/aesthetics |
| /beauty-institute, /beauty-institute/* | /academy |
| /licensing | /about |

### Data model change
Services no longer belong to a location. Every service is offered at **both** locations unless a service has `locations: ['ebute']` or `['nitel']` set explicitly (only when the client says so). Remove any copy that ties a service type to one location.

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
- Beside it: one portrait image and the three values as a small list (We take our time · We're honest with you · We do it beautifully)

### 3.3 What we do
- **H2:** What we do
- Intro: Whatever brings you in, it's the same care and the same standards.
- Six cards (image, name, one line, link):

| Card | Line | Link |
|---|---|---|
| Facials | Deep-cleansing, hydrating and glow facials, matched to your skin. | /services/facials |
| Massage & Spa | Massages that release tension and help you fully switch off. | /services/massage |
| Aesthetics | Advanced skin treatments, always starting with a consultation. | /services/aesthetics |
| Hair & Barbing | Styling, treatments and clean, sharp cuts. | /services/hair |
| Nails | Manicures, pedicures and nail art, finished with precision. | /services/nails |
| Makeup | For your big day, a night out, or a photoshoot. | /services/makeup |

### 3.4 Our work
- **H2:** Our work
- Intro: A few recent favourites from our team.
- Grid of 6–8 images; each tile shows the service name on hover/focus and links to that service page. Button: See our work → /gallery

### 3.5 Academy
- Eyebrow: Kikiewa Academy
- **H2:** Learn the craft from the people who practise it.
- Body: Hands-on training in cosmetology and aesthetics, taught by the team behind Kikiewa.
- Left: slideshow of class photos (same slider component; captions optional; same accessibility rules)
- Right: two course cards: **Cosmetology** (Hair, barbing, nails, makeup, manicure and pedicure) · **Aesthetics** (Facials and massage). Each: View course. Main button: See our courses.

### 3.6 Testimonials
- **H2:** What our clients say
- Slider of quote cards: quote, first name + last initial, service (optional), star rating only if it comes from Google.
- **Only real testimonials, with permission.** Sources: Google reviews, WhatsApp/Instagram messages the client has received (with the customer's OK).
- Until real ones exist: the section renders only when `NEXT_PUBLIC_SITE_ENV !== 'production'`, showing clearly labelled placeholders ("Client testimonial — to be supplied"). In production with no testimonials, the section is hidden.

### 3.7 Locations
- **H2:** Visit us in Ikorodu
- Intro: Two locations, the same Kikiewa. Choose whichever is closer.
- Two equal cards: **Kikiewa Ebute** · **Kikiewa Nitel**: address, hours, phone, Get directions, Book here. (Addresses, hours, phones TBC.)

### 3.8 Closing CTA band (all pages)
- **H2:** Come in. Leave in full feather.
- Body: Book in a few taps, or message us and we'll help you choose.
- Buttons: Book an appointment · Chat on WhatsApp

### 3.9 Footer
- Logo + line: *Your beauty, seen and felt.*
- Columns: **Services** (six links) · **Kikiewa** (About, Academy, Gallery, Contact) · **Visit** (Ebute address/hours, Nitel address/hours) · **Follow** (socials when confirmed)
- Bottom: © {year} Kikiewa · Booking policy · Privacy
- Small note: Aesthetic treatments follow a consultation and suitability assessment. Results vary from person to person.

---

## 4. About `/about`

1. **Hero:** H1 *Everyone is beautiful in their own way.* Sub: We exist to bring that beauty out.
2. **Our story:** H2 *Our story*. {{client: how Kikiewa started, founder name, year, the meaning of "Kikiewa"}}. Hidden until supplied. (ORÍKÌ's story works because it is personal, with a real moment, a name meaning and a founder doing the work. Ask her for that.)
3. **Vision & mission:** two side-by-side statements.
   - **Our vision:** A world where everyone sees the beauty they already have, and is helped to bring it out.
   - **Our mission:** To bring expertise and professional know-how to every client, so their beauty can be seen and felt.
4. **How we work:** the three values, each with one line.
5. **Our team:** hidden until real names and roles exist.
6. **Two locations:** short strip linking to /locations.
7. Closing band.

---

## 5. Services

### `/services` (hub)
- **H1:** Our services
- Sub: Facials, massage, aesthetics, hair, nails and makeup, available at both our Ikorodu locations.
- Six large cards (same as Home §3.3), then a short "Not sure what to book?" block: *Tell us what you'd like and we'll recommend the right treatment.* Button: Chat on WhatsApp.

### Service page template (all six)
1. **Hero:** image, eyebrow "Services", H1, one line, Book an appointment · Chat on WhatsApp
2. **Intro:** 2–3 sentences
3. **Menu:** each item = name · one line · duration · from price (TBC allowed) · Book. Name items by benefit (as ORÍKÌ does: "Hydrating Facial", not "Facial B"). Item names below are **suggestions for the client to confirm or replace**; show only confirmed ones in production.
4. **What to expect:** 3–4 short steps
5. **Our work:** gallery filtered to this service (hidden if empty)
6. **FAQs:** 3–4 (render only questions with confirmed answers)
7. **Testimonials** for this service (same rules as Home)
8. Closing band

### Per-page copy

**Facials** `/services/facials`
- H1: Facials · Line: Skin that feels as good as it looks.
- Intro: Every facial starts with a look at your skin and a chat about what you'd like. Then we cleanse, treat and finish with care, and send you home with simple advice to keep the glow going.
- Suggested menu: Deep-Cleansing Facial · Hydrating Facial · Glow Facial · Facial for Men
- Expect: Skin check → Cleanse & exfoliate → Treat & massage → Finish & advice
- FAQs: How often should I have a facial? · Can I wear makeup afterwards? · Is it suitable for sensitive skin?

**Massage & Spa** `/services/massage`
- H1: Massage & Spa · Line: Switch off. Breathe out.
- Intro: Choose the pressure and the pace. Our therapists work with you to release tension, ease tired muscles and give your mind a proper rest.
- Suggested menu: Relaxing Massage · Deep Tissue Massage · Couples Massage · Body Scrub
- Expect: Settle in → Tell us what you need → Your massage → Take your time afterwards
- FAQs: What should I wear? · Can I choose a male or female therapist? · Can I book for two?

**Aesthetics** `/services/aesthetics`
- H1: Aesthetics · Line: Advanced skin care, always starting with a consultation.
- Intro: For concerns a facial can't reach, our aesthetic treatments go further. Every one begins with a consultation, so you only ever get what's right for your skin.
- Menu: **only treatments the client confirms in writing are licensed and safe to advertise.** Placeholder until then: "Aesthetic consultation". Every item shows "Consultation required" and uses **Book a consultation**.
- Expect: Consultation → Assessment & plan → Treatment → Aftercare
- FAQs: What happens at a consultation? · Is there a consultation fee? · Will I see results after one session? (Answer: Results vary from person to person; we'll talk you through what's realistic.)
- Disclaimer on this page: Treatments follow a consultation and suitability assessment. Results vary from person to person.

**Hair & Barbing** `/services/hair`
- H1: Hair & Barbing · Line: Styled, cut and cared for.
- Intro: From protective styles and treatments to clean, sharp cuts, our stylists and barbers take the time to get it right for your hair.
- Suggested menu: Styling · Hair Treatment · Braids & Protective Styles · Haircut & Barbing
- Expect: Consultation → Wash & prep → Style or cut → Finish & aftercare tips

**Nails** `/services/nails`
- H1: Nails · Line: Finished with precision.
- Intro: Clean shapes, neat cuticles and colour that lasts. Keep it simple or ask for nail art.
- Suggested menu: Manicure · Pedicure · Gel Polish · Nail Art

**Makeup** `/services/makeup`
- H1: Makeup · Line: For the moments you want to remember.
- Intro: Bridal, events, photoshoots or just because. We match your makeup to your skin, your outfit and the occasion.
- Suggested menu: Bridal Makeup · Event Makeup · Photoshoot Makeup
- FAQs: Do you offer trials? · Can you come to my venue? · How early should I book for a wedding?

---

## 6. Academy `/academy`

1. **Hero:** H1 *Learn the craft from the people who practise it.* Sub: Hands-on courses in cosmetology and aesthetics at Kikiewa, Ikorodu. Buttons: See our courses · Chat on WhatsApp
2. **Why train with us:** three points: *Taught by working professionals* · *Hands-on, practical classes* · *Small groups* {{confirm}}
3. **Courses:** two cards, each with: what you'll learn, duration {{TBC}}, fee {{TBC}}, next intake {{TBC}}, certificate {{TBC}}, View course
   - **Cosmetology:** Hair dressing and styling, barbing, nails and nail artistry, makeup, manicure and pedicure.
   - **Aesthetics:** Facials and massage.
4. **Inside our classes:** photo slideshow
5. **How to apply:** Choose your course → Visit or message us → Enrol {{requirements TBC}}
6. **Student testimonials** (real only, same rules)
7. **FAQs:** Do I need experience? · Are classes weekdays or weekends? · Do I get a certificate? (render only confirmed answers)

**Course pages** `/academy/cosmetology`, `/academy/aesthetics`: H1 course name, overview, "What you'll learn" (the modules above as a list), facts table (duration, schedule, fee, intake, certificate, all TBC-aware), how to apply, CTA.

---

## 7. Other pages

**Gallery** `/gallery`: H1 *Our work* · Sub: Recent work from our team. Filters: All · Facials · Massage & Spa · Aesthetics · Hair & Barbing · Nails · Makeup · Academy. Native `<dialog>` lightbox. No client faces or before/afters without written consent.

**Locations** `/locations`: H1 *Visit us in Ikorodu* · Sub: Two locations, the same Kikiewa. Two equal cards plus map links. `/locations/ebute` and `/locations/nitel` use identical layouts: H1 *Kikiewa Ebute, Ikorodu* / *Kikiewa Nitel, Ikorodu*; address, landmark, hours table, phone, directions, "Services at this location" (all six), Book here.

**Book** `/book`: H1 *Book an appointment* · Sub: Choose your treatment and a time that suits you. We'll confirm on WhatsApp.
Steps: 1 *What would you like?* (service) → 2 *Which location suits you?* (Ebute / Nitel) → 3 *Preferred date & time* → 4 *Your details* → 5 *Review & send*. Aesthetics items say: *This starts with a consultation. We'll book that first.*

**Contact** `/contact`: H1 *Contact us* · Sub: The quickest way to reach us is WhatsApp. Two location cards + a message form (What's it about? Services / Academy / Something else).

**Booking policy, Privacy:** headings only, with content from the client. **404:** *We couldn't find that page.* Links to Home, Services, Book.

---

## 8. SEO

Primary location keyword: **Ikorodu**. Titles ≤ 60 chars, descriptions ≤ 155, no "TBC" or "{{".

| URL | Title | Description |
|---|---|---|
| / | Kikiewa \| Med Spa, Facials & Beauty in Ikorodu, Lagos | Your beauty, seen and felt. Facials, massage, aesthetics, hair, nails and makeup at Kikiewa in Ikorodu, Lagos. Book online or on WhatsApp. |
| /about | About Kikiewa \| Med Spa & Beauty in Ikorodu | Everyone is beautiful in their own way. Meet Kikiewa, the med spa and beauty studio in Ikorodu, Lagos, that brings it out. |
| /services | Med Spa & Beauty Services in Ikorodu \| Kikiewa | Facials, massage, aesthetics, hair and barbing, nails and makeup at Kikiewa's two locations in Ikorodu, Lagos. See prices and book. |
| /services/facials | Facials in Ikorodu, Lagos \| Kikiewa | Deep-cleansing, hydrating and glow facials at Kikiewa in Ikorodu, Lagos, matched to your skin. See prices and book online. |
| /services/massage | Massage & Spa in Ikorodu, Lagos \| Kikiewa | Relaxing and deep tissue massage at Kikiewa in Ikorodu, Lagos. Switch off, breathe out. See prices and book online. |
| /services/aesthetics | Aesthetic Skin Treatments in Ikorodu \| Kikiewa | Advanced aesthetic skin treatments at Kikiewa in Ikorodu, Lagos, always starting with a consultation. Book a consultation online. |
| /services/hair | Hair Salon & Barbing in Ikorodu \| Kikiewa | Hair styling, treatments, braids and barbing at Kikiewa in Ikorodu, Lagos. See prices and book online or on WhatsApp. |
| /services/nails | Nails, Manicure & Pedicure in Ikorodu \| Kikiewa | Manicures, pedicures, gel and nail art at Kikiewa in Ikorodu, Lagos. See prices and book online or on WhatsApp. |
| /services/makeup | Makeup Artist in Ikorodu, Lagos \| Kikiewa | Bridal, event and photoshoot makeup at Kikiewa in Ikorodu, Lagos, matched to your skin and occasion. Book online. |
| /academy | Beauty School in Ikorodu, Lagos \| Kikiewa Academy | Hands-on cosmetology and aesthetics courses at Kikiewa Academy, Ikorodu. Learn from the people who practise the craft. |
| /academy/cosmetology | Cosmetology Course in Ikorodu \| Kikiewa Academy | Learn hair styling, barbing, nails, makeup, manicure and pedicure at Kikiewa Academy in Ikorodu, Lagos. See fees and how to apply. |
| /academy/aesthetics | Aesthetics Course in Ikorodu \| Kikiewa Academy | Learn facials and massage at Kikiewa Academy in Ikorodu, Lagos. Hands-on training from working professionals. See how to apply. |
| /gallery | Our Work \| Kikiewa Ikorodu | Recent facials, hair, nails, makeup and more from the team at Kikiewa in Ikorodu, Lagos. |
| /locations | Kikiewa Locations in Ikorodu, Lagos | Visit Kikiewa at Ebute or Nitel, Ikorodu: addresses, opening hours, phone numbers and directions. |
| /locations/ebute | Kikiewa Ebute, Ikorodu \| Med Spa & Beauty | Kikiewa in Ebute, Ikorodu: facials, massage, aesthetics, hair, nails and makeup. Address, hours and directions. |
| /locations/nitel | Kikiewa Nitel, Ikorodu \| Med Spa & Beauty | Kikiewa in Nitel, Ikorodu: facials, massage, aesthetics, hair, nails and makeup. Address, hours and directions. |
| /book | Book an Appointment \| Kikiewa Ikorodu | Book facials, massage, aesthetics, hair, nails or makeup at Kikiewa in Ikorodu, Lagos. Choose a time; we'll confirm on WhatsApp. |
| /contact | Contact Kikiewa \| Ikorodu, Lagos | Call, WhatsApp or message Kikiewa at Ebute or Nitel, Ikorodu, Lagos. |

**Structured data:** `Organization` site-wide. On each location page, `BeautySalon` (switch to `MedicalClinic` only if the client confirms a medical licence) with only verified fields. `Service` on service pages (no `offers` until prices are confirmed). `Course` on course pages. `BreadcrumbList` on nested pages. `FAQPage` only for rendered, confirmed FAQs. No review schema until real reviews are shown.

**Google Business Profile:** one per location, named to match the signage at each (likely "Kikiewa"). Both list the same categories (primary: Medical spa or Beauty salon, depending on licence; secondary: Facial spa, Massage spa, Hair salon, Nail salon). Name, address and phone identical to the site.

---

## 9. Client checklist (before launch)

1. Registered business name
2. Addresses, landmarks, Google Maps pins, hours and phone/WhatsApp for **Ebute** and **Nitel**
3. Confirm all services are offered at both locations (or say which aren't)
4. Service menus: names, durations and from-prices
5. Aesthetics: written list of treatments that are licensed and safe to advertise
6. What "face ammunization" is
7. Academy: course durations, fees, schedule, intakes and certificate
8. Founder story, the meaning of "Kikiewa", year founded
9. Team names and roles (optional)
10. 3–6 real testimonials with permission, or a Google reviews link
11. Photos: hero slides (4), service images (6+), past work (8+), academy classes (4+)
12. Social links
13. Booking and cancellation policy
