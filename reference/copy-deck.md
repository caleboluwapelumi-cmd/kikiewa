# Kikiewa — Copy Deck (v1, draft)

Status: **DRAFT for client approval.** Written 24 Oct 2026 from the competitor study and the project brief.

## Rules for whoever builds from this

1. **Facts are tokens, never prose.** Anything in `{{double braces}}` is an unverified fact. It goes into `data/site.ts` as `'TBC'` and renders as "To be confirmed" until the client supplies it. Never replace a token with a guess.
2. **Every string here is marketing copy.** Store it in `data/site.ts`, not in components. Mark the block `// DRAFT COPY - client approval needed`.
3. **Medical wording is fixed.** Don't strengthen any Medical Spa line. No outcomes, no "safe", no "painless", no "results guaranteed", no before/after promises.
4. **British/Nigerian English spelling** (colour, centre, programme, enquire). Naira as `₦` with no decimals: `₦45,000`.
5. **Sentence case** for headings and buttons. Uppercase only for small eyebrow labels, done in CSS.
6. **One idea per paragraph.** Keep card text to two sentences.

Facts confirmed in the brief: name **Kikiewa**; divisions **Salon & Spa**, **Medical Spa & Makeover**, **Beauty Institute**; locations **Ebute** (Salon & Spa) and **Nitel** (Medical Spa & Makeover); both in **Ikorodu, Lagos State**. Nothing else is confirmed.

---

## Brand voice

**Professional, warm, reassuring. Calm confidence, never hype.**

| We sound like | We never sound like |
|---|---|
| A trusted practitioner explaining what happens next | An advert shouting "best in Lagos" |
| Specific: what, how long, what it costs | Vague: "luxury experience like no other" |
| Unhurried, short sentences | Exclamation marks, emoji, ALL CAPS |
| "Results vary; we'll assess suitability first" (medical) | "Flawless skin guaranteed" |
| Warm and sensory (salon) | Clinical in the salon, chatty in the clinic |

**Banned words:** best, No. 1, world-class, guaranteed, flawless, perfect, miracle, painless, risk-free, permanent (medical), cheap, affordable luxury, "slay".

**House vocabulary:** care, considered, unhurried, finish, ritual (salon); consultation, assessment, plan, aftercare, suitability (clinic); craft, practice, pathway, certified (institute, when true).

### CTA library (use these exact labels)

| Situation | Label |
|---|---|
| Primary booking, anywhere | Book an appointment |
| Short, header and mobile bar | Book |
| Any Medical Spa treatment | Book a consultation |
| WhatsApp | Chat on WhatsApp |
| Phone | Call {{location}} |
| Division card | Explore Salon & Spa / Explore the Medical Spa / Explore the Institute |
| Service row | Book this service |
| Course card | View course |
| Institute enquiry | Book a visit |
| Directions | Get directions |
| Gallery | View the gallery |

---

## Global elements

### Header
- Logo: Kikiewa (accessible name)
- Nav: Salon & Spa · Medical Spa · Beauty Institute · Gallery · Locations
- Dropdown labels:
  - **Salon & Spa:** Services · Gallery · Ebute location
  - **Medical Spa:** Treatments · Concerns · Your consultation · Nitel location
  - **Beauty Institute:** Courses · Admissions
- Buttons: **Book** · WhatsApp (icon, accessible name "Chat on WhatsApp")
- Utility bar: `Salon & Spa — Ebute · {{ebute.phone}}` · `Medical Spa — Nitel · {{nitel.phone}}` · `Opening hours`

### Mobile action bar
Book · WhatsApp · Call

The Call button opens a small sheet titled "Which location?" with two rows: Salon & Spa, Ebute / Medical Spa, Nitel.

### Footer
- Line under the logo: **Care, considered. Salon & Spa, Medical Spa & Makeover, and Beauty Institute, Ikorodu, Lagos.**
- Columns:
  - **Visit:** Ebute: {{ebute.address}} · {{ebute.hours}} | Nitel: {{nitel.address}} · {{nitel.hours}}
  - **Explore:** Salon & Spa · Medical Spa · Beauty Institute · Gallery · Journal
  - **Help:** Book an appointment · Contact · Booking & cancellation policy · Privacy
  - **Follow:** {{instagram}} · {{tiktok}} · {{facebook}}
- Legal line: © {year} Kikiewa. All rights reserved.
- Medical line (Medical Spa pages and footer): *Medical treatments are provided following consultation and assessment of suitability. Individual results vary.*

### Closing CTA band (all pages)
- **Heading:** Your appointment, at your pace.
- **Body:** Book online in a few steps, or message us and we'll help you choose.
- **Buttons:** Book an appointment · Chat on WhatsApp

---

## 1. Home `/`

**Hero**
- Eyebrow: Salon & Spa · Medical Spa · Beauty Institute
- **H1:** Three houses of care. One standard.
- Sub: A salon and spa in Ebute, a medical spa in Nitel, and an institute training the next generation, all in Ikorodu, Lagos.
- Buttons: Book an appointment · Chat on WhatsApp

**Division split** (section H2: *Choose your Kikiewa*)

| Card | Eyebrow | Heading | Body | Link |
|---|---|---|---|---|
| Salon & Spa | Ebute | Unhurried beauty, beautifully finished | Hair, nails, massage and spa rituals in a space designed for you to slow down. | Explore Salon & Spa |
| Medical Spa | Nitel | Clinical care, gently delivered | Consultation-led skin and aesthetic treatments, planned around you and explained at every step. | Explore the Medical Spa |
| Beauty Institute | Training | Learn the craft where it's practised | Practical beauty training shaped by a working salon, spa and clinic. | Explore the Institute |

**Experience** (image left, text right)
- Eyebrow: The Kikiewa experience
- **H2:** Time set aside, just for you.
- Body: Lagos moves fast. Your appointment shouldn't. Every visit starts with a conversation about what you want, and moves at a pace that lets you enjoy it.
- Body 2: From the welcome to the final finish, we explain what we're doing and why, so you leave knowing exactly how to care for the result.

**Signature services** (H2: *Signature services*)
- Intro: A few of the treatments our guests ask for most.
- Cards are pulled from data. Medical rows show "Book a consultation".

**Gallery strip** (H2: *Inside Kikiewa*)
- Line: A look at our spaces, our work and the care behind it.
- Link: View the gallery

**Reviews:** hidden until real, approved reviews exist. Draft heading for later: *In their words.*

**Locations** (H2: *Two locations in Ikorodu*)
- Ebute card: "Salon & Spa" · {{ebute.address}} · {{ebute.hours}} · Get directions · Call Ebute
- Nitel card: "Medical Spa & Makeover" · {{nitel.address}} · {{nitel.hours}} · Get directions · Call Nitel

**About strip** (only once the client supplies the story)
- **H2:** The story behind the name
- Body: {{brand.story — origin and meaning of "Kikiewa", founder, year}}
- Note: like ORÍKÌ's name story, this is a strong differentiator. Ask the client for it.

---

## 2. Salon & Spa `/salon-spa`

**Hero**
- Eyebrow: Salon & Spa · Ebute
- **H1:** Unhurried care, from the first wash to the final finish.
- Sub: Hair, nails, massage and spa rituals in Ebute, Ikorodu. Come in for one service or stay for the afternoon.
- Buttons: Book an appointment · Chat on WhatsApp

**Intro** (large serif paragraph)
> Good beauty work takes time. We give it that time, with a consultation before we begin, techniques suited to your hair and skin, and a finish you'll want to keep.

**Services** (H2: *Services*)
- Intro: Choose a category to see durations and starting prices.
- Categories (the **client must confirm** which ones exist; delete any that don't):

| Category | One-line description |
|---|---|
| Hair | Cuts, styling, colour and treatments for every texture, natural hair included. |
| Nails | Manicures, pedicures and nail care, finished with precision. |
| Massage & body | Massages and body rituals to release tension and restore calm. |
| Facials | Relaxing, results-minded facials for a fresh, healthy glow. |
| Makeup | Event, bridal and everyday makeup, matched to your skin and occasion. |
| Brows & lashes | Shaping, tinting and lash services, kept natural or made bold. |

- Row format: **{{service.name}}** · {{duration}} · from {{price}} · Book this service

**What to expect** (H2: *Your visit, step by step*)
1. **Arrive and settle.** A warm welcome and a few minutes to unwind.
2. **Talk it through.** We ask what you'd like and check what suits your hair or skin.
3. **Your service.** Careful, unhurried work, with no rushing to the next client.
4. **The finish.** A final check together, plus simple tips for caring for it at home.

**Meet the team** (H2: *The people behind the work*)
- Intro: Skilled, attentive and happy to talk you through anything.
- Card: {{name}} · {{role}} · one-line personality bio from the client (e.g. "Known for patient, precise braiding"). Hidden until real.

**Gallery** (H2: *Recent work*) · Link: See more in the gallery

**Ebute location block**
- **H2:** Visit us in Ebute, Ikorodu
- Body: {{ebute.address}} · {{ebute.hours}} · {{ebute.landmark — "near X", if the client wants it}}
- Buttons: Get directions · Call Ebute · Chat on WhatsApp

**FAQ** (H2: *Good to know*)
- *How early should I arrive?* Ten minutes before your appointment gives you time to settle in.
- *Can I book more than one service?* Yes. Add services as you book, or message us and we'll arrange them back to back.
- *What if I need to cancel or reschedule?* Please let us know as early as you can. Our full policy is here: {{policy link}}.
- *Do you work with natural hair?* {{client to confirm}}
- *Do you offer bridal or group bookings?* {{client to confirm}}

### Service detail `/salon-spa/[service]` (template)
- Eyebrow: {{category}} · Salon & Spa, Ebute
- **H1:** {{service.name}}
- Summary: {{one or two sentences from the client's service description}}
- Fact row: Duration {{duration}} · From {{price}} · Location: Ebute, Ikorodu
- **H2:** What happens during your appointment (generic, from the category's steps)
- **H2:** Before you come (generic: arrive 10 minutes early; tell us about any allergies or sensitivities)
- **H2:** You might also like (related services)
- CTA: Book this service · Chat on WhatsApp

---

## 3. Medical Spa `/medical-spa`

**Hero** (cool and restrained)
- Eyebrow: Medical Spa & Makeover · Nitel
- **H1:** Every treatment begins with a conversation.
- Sub: Consultation-led skin and aesthetic care in Nitel, Ikorodu. We assess, explain and plan with you before any treatment begins.
- Buttons: Book a consultation · Chat on WhatsApp

**Intro** (large serif paragraph)
> Choosing a treatment is a personal decision. We take time to understand your concerns, your skin and your expectations, then recommend only what is suitable for you.

**How it works** (H2: *How it works*)
1. **Consultation.** We listen to what you'd like to address and take a short medical history.
2. **Assessment & plan.** We check suitability, explain your options, costs and what to expect, and agree a plan.
3. **Treatment.** Carried out by {{practitioner role — e.g. "our clinical team", until roles are confirmed}}, at a pace you're comfortable with.
4. **Aftercare.** Clear written aftercare and a follow-up where your treatment calls for one.

**Browse by concern** (H2: *What would you like to address?*)
- Intro: Start with your concern. We'll recommend the right approach at your consultation.
- Concern cards: **only those the client confirms the licence allows.** Draft card copy:
  - **Pigmentation & uneven tone:** for dark spots, patches and uneven skin tone.
  - **Acne & scarring:** for active breakouts and the marks they leave behind.
  - **Texture & pores:** for rough texture and enlarged pores.
  - **Hydration & glow:** for dull, dehydrated or tired-looking skin.
  - **Fine lines & firmness:** for early signs of ageing.
  - **Unwanted hair:** for longer-term hair reduction.
- Card link label: See treatments

**Treatments** (H2: *Treatments*)
- Intro: Prices are a guide. Your final plan and cost are confirmed at consultation.
- Row: **{{treatment}}** · {{duration}} · from {{price}} · tag "Consultation required"
- Treatment names come **only** from the client's licence-approved list.

**Your clinical team** (H2: *Your clinical team*)
- Card: {{name}} · {{role}} · Registration: {{registration body and number}}
- Hidden until real. Never show a role or qualification that isn't verified.

**Licence & safety** (H2: *Our standards*)
- Record card: Facility licence {{licence}} · Regulatory body {{body}} · Medical oversight {{lead practitioner}}
- Body: Every treatment follows a consultation and suitability assessment. If a treatment isn't right for you, we'll tell you.

**FAQ** (H2: *Before your consultation*)
- *What happens at a consultation?* We discuss your concerns and medical history, assess your skin, and explain suitable options, costs and aftercare. There's no obligation to go ahead.
- *Is there a consultation fee?* {{client to confirm; if credited against treatment, say so}}
- *How should I prepare?* Come with clean skin if possible, and bring a list of any medication or skincare you use.
- *Will I see results after one session?* Results vary from person to person. Some treatments need a course of sessions, and we'll talk you through what's realistic for you.
- *Is it suitable during pregnancy or breastfeeding?* Some treatments aren't. Please tell us at consultation and we'll advise you.

**Nitel location block**
- **H2:** Visit us in Nitel, Ikorodu
- Body: {{nitel.address}} · {{nitel.hours}}
- Buttons: Book a consultation · Get directions · Call Nitel

**Footer note (this page):** Medical treatments are provided following consultation and assessment of suitability. Individual results vary.

### Treatment detail `/medical-spa/[treatment]` (template)
- Eyebrow: Medical Spa · Nitel
- **H1:** {{treatment.name}}
- Summary: {{client-approved, one or two sentences: what it is and what it's used for}}
- Fact row: Duration {{duration}} · From {{price}} · Consultation required
- **H2:** Who it may suit (from the client; "suitability is confirmed at consultation")
- **H2:** What to expect (generic: consultation → treatment → aftercare)
- **H2:** Aftercare (client's written aftercare only)
- **H2:** Related concerns (links)
- Disclaimer: Individual results vary. Suitability is assessed at consultation.
- CTA: Book a consultation

### Concern detail `/medical-spa/concerns/[concern]` (template)
- **H1:** {{concern.name}} treatment in Ikorodu
- Intro: {{concern summary}}. At your consultation, we'll look at the cause and recommend the approach that suits your skin.
- **H2:** Treatments we may recommend (linked list)
- **H2:** Your first step: book a consultation

---

## 4. Beauty Institute `/beauty-institute`

**Hero**
- Eyebrow: Kikiewa Beauty Institute · Ikorodu
- **H1:** Learn the craft where it's practised.
- Sub: Practical beauty training from people who do this work every day.
- Buttons: View courses · Book a visit

**Intro** (large serif paragraph)
> Great beauty professionals are made with practice, patience and good teaching. Our courses combine all three, with time on real techniques and clear standards for every skill you learn.

**Courses** (H2: *Courses*)
- Intro: Compare courses at a glance. Every detail is confirmed at enrolment.
- Card: **{{course.name}}** · one-line summary · Level {{level}} · Entry requirements {{entry}} · Duration {{duration}} · Fee {{fee}} · Next intake {{intake}} · View course
- Groups (**client must confirm**): Hair · Nails · Makeup · Beauty therapy & skincare

**Your pathway** (H2: *Your pathway*)
1. **Start:** learn the foundations, with no experience needed {{confirm}}.
2. **Qualify:** build skills to a professional standard and earn your certificate {{certifying body}}.
3. **Advance:** specialise, refresh your skills or move into new techniques.

**Learning environment** (H2: *Where you'll learn*)
- Body: Training takes place at {{location}}, alongside a working salon and spa, so you see professional standards up close. {{confirm with client}}

**Admissions** (H2: *How to apply*)
1. **Choose a course** and check the next intake date.
2. **Book a visit or call** to ask questions and see where you'll train.
3. **Apply and enrol:** {{documents and deposit, from client}}.
- CTA: Book a visit · Chat on WhatsApp

### Course detail `/beauty-institute/[course]` (template)
- **H1:** {{course.name}}
- Summary, then a fact table: Level · Entry requirements · Duration · Schedule (weekday/weekend) · Fee · Next intake · Certificate
- **H2:** What you'll learn (client's syllabus)
- **H2:** Who it's for
- **H2:** After the course (progression, never job or income promises)
- CTA: Book a visit · Chat on WhatsApp

---

## 5. Gallery `/gallery`
- **H1:** Inside Kikiewa
- Sub: Our spaces, our work and the moments in between.
- Filters: All · Salon & Spa · Medical Spa · Institute
- Empty state: New photographs are on the way. Follow us on Instagram for the latest.
- Caption rule: describe what's shown, e.g. "Treatment room at our Nitel medical spa". No client names.

---

## 6. Locations `/locations`
- **H1:** Our locations
- Sub: Two locations in Ikorodu, Lagos, each focused on what it does best.
- Ebute card: Salon & Spa · hair, nails, massage and spa · address · hours · Get directions
- Nitel card: Medical Spa & Makeover · consultation-led skin and aesthetic care · address · hours · Get directions

### `/locations/ebute`
- **H1:** Salon & Spa in Ebute, Ikorodu
- Intro: Our Ebute location is home to the Kikiewa Salon & Spa: hair, nails, massage and spa rituals, delivered without rushing.
- Blocks: Address & directions {{landmark, parking, nearest bus stop}} · Opening hours table · Services at this location (links) · Photo strip · CTA

### `/locations/nitel`
- **H1:** Medical Spa in Nitel, Ikorodu
- Intro: Our Nitel location is home to the Kikiewa Medical Spa & Makeover, where every treatment begins with a consultation.
- Blocks: same as Ebute, with treatments in place of services

---

## 7. Book `/book`
- **H1:** Book an appointment
- Sub: Choose a service and your preferred time. We'll confirm on WhatsApp.
- Step headings: 1 Choose a location · 2 Choose a service · 3 Preferred date & time · 4 Your details · 5 Review & send
- Step 1 options: **Salon & Spa, Ebute** (hair, nails, massage and spa) / **Medical Spa, Nitel** (consultation-led skin and aesthetic care)
- Medical note (step 2): Medical treatments begin with a consultation. Choose the treatment you're interested in and we'll book your consultation first.
- Step 3 helper: These are preferred times. We'll confirm availability before your booking is final.
- Step 4 labels: Full name · Phone number · Email (optional) · Anything we should know? (helper: allergies, sensitivities or special requests)
- Consent: I agree to Kikiewa contacting me about this booking.
- Review note: Prices shown are starting prices. Your final price is confirmed {{at the salon / at consultation}}.
- Submit: Send booking request
- Confirmation H2: Thank you, {{first name}}.
- Confirmation body: Your request has been sent on WhatsApp. We'll confirm your appointment shortly. If WhatsApp didn't open, call us on {{location phone}}.

**Errors**
- Name: Please enter your name.
- Phone: Please enter a Nigerian phone number, for example 0803 123 4567.
- Service: Please choose a service.
- Time: Please choose a preferred time.
- Consent: Please confirm we can contact you about this booking.

**WhatsApp prefilled messages**
- Booking: `Hello Kikiewa, I'd like to book {{service}} at {{location}} on {{date}} at {{time}}. Name: {{name}}. Phone: {{phone}}. Notes: {{notes}}`
- General: `Hello Kikiewa, I'd like some help choosing a service.`
- Medical: `Hello Kikiewa Medical Spa, I'd like to book a consultation about {{concern or treatment}}.`
- Institute: `Hello Kikiewa Beauty Institute, I'd like to know more about {{course}} and the next intake.`

---

## 8. Contact `/contact`
- **H1:** Contact us
- Sub: The quickest way to reach us is WhatsApp. We reply during opening hours.
- Two cards (Ebute / Nitel): phone · WhatsApp · email · address · hours
- Form heading: Send us a message
- Form labels: Name · Phone · Email (optional) · Which team? (Salon & Spa / Medical Spa / Beauty Institute / Something else) · Message
- Submit: Send message
- Success: Thanks for getting in touch. We'll reply as soon as we can during opening hours.

---

## 9. Policies `/policies`
- **H1:** Booking & cancellation policy
- Sections, all {{from client}}: Deposits · Cancelling or rescheduling · Late arrivals · Missed appointments · Refunds · Medical consultations · Privacy
- Draft intro: We keep our policies simple, so everyone gets the time they booked.

---

## 10. 404
- **H1:** We couldn't find that page.
- Body: It may have moved. Try one of these instead.
- Links: Home · Salon & Spa · Medical Spa · Book an appointment

---

## 11. Image alt text pattern
`{{what is shown}} at Kikiewa {{division}}, {{location}}, Ikorodu`
- Good: "Treatment room with a reclining bed at Kikiewa Medical Spa, Nitel, Ikorodu"
- Good: "Stylist finishing a silk press at Kikiewa Salon & Spa, Ebute, Ikorodu"
- Never: "image1", "beautiful salon", or keyword stuffing.

---

## 12. Facts to collect from the client (blocks launch)

1. Full street addresses for both locations (Ebute and Nitel, Ikorodu), plus the nearest landmark or bus stop and a Google Maps pin.
2. Phone and WhatsApp numbers per location, and email.
3. Opening hours per location.
4. The brand story: meaning of "Kikiewa", founder, year founded.
5. Salon & Spa service list with durations and from-prices.
6. Medical Spa: the **licence-approved** treatment list, practitioner names, roles and registration numbers, facility licence details, and the consultation fee.
7. Institute: courses, levels, entry requirements, duration, fees, intakes, certificate or certifying body.
8. Team names, roles and one-line bios.
9. Booking policy: deposit, cancellation, refunds.
10. Social media links.
11. Real reviews, with written permission (or the Google Business Profile link).
