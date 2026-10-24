# Kikiewa — Copy Deck (v2, draft)

Status: **DRAFT for client approval.** Written 24 Oct 2026 from the competitor study and the project brief.

## Rules for whoever builds from this

1. **Facts are tokens, never prose.** Anything in `{{double braces}}` is an unverified fact. It goes into `data/site.ts` as `'TBC'` and renders as "To be confirmed" until the client supplies it. Never replace a token with a guess.
2. **Every string here is marketing copy.** Store it in `data/site.ts`, not in components. Mark the block `// DRAFT COPY - client approval needed`.
3. **Medical wording is fixed.** Don't strengthen any Medical Spa line. No outcomes, no "safe", no "painless", no "results guaranteed", no before/after promises.
4. **British/Nigerian English spelling** (colour, centre, programme, enquire). Naira as `₦` with no decimals: `₦45,000`.
5. **Sentence case** for headings and buttons. Uppercase only for small eyebrow labels, done in CSS.
6. **One idea per paragraph.** Keep card text to two sentences.

Facts confirmed in the brief: name **Kikiewa**; services covering hair and beauty, spa, skin and aesthetics (the Medical Spa & Makeover), and training (the Beauty Institute); locations **Ebute** (hair, nails and spa) and **Nitel** (skin, aesthetics and makeover); both in **Ikorodu, Lagos State**. Nothing else is confirmed.

---

## The brand idea

**Kikiewa is one brand, not three businesses.** Hair, nails, makeup, spa, skin and aesthetic treatments, and training are all part of one promise. The two locations are just where you go for each service.

### The line
# Beauty, in good hands.

The line works because the brand's work is literally done by hand: the stylist, the therapist, the clinician and the tutor. It promises care and skill together, and it holds for everything she offers, from a pedicure to a clinical skin treatment to a course.

### Positioning (internal: guides the copy, not published)
For women and men in Ikorodu who want to look and feel their best, Kikiewa is the one beauty destination where everything, from your hair to your skin, is done carefully, honestly and beautifully. Unlike the rush-in, rush-out salon, Kikiewa takes its time, tells you the truth about what will suit you, and backs its everyday beauty with clinical skin care and a training institute.

### Three promises (the proof points under the line)
1. **Unhurried.** Time is part of the treatment. Nobody rushes you to make room for the next booking.
2. **Honest.** We tell you what will suit you, what it costs and what to expect, including when something isn't right for you.
3. **Beautifully done.** Careful work, and a finish you'll want to show off.

These run through every page. A heading, a FAQ answer or a service description should always prove at least one of them.

### The peacock, in words
The logo is a peacock: the bird that's made to be seen. Use that idea **once per page at most**, never as a pun in every heading:
- "Made to be seen" (gallery)
- "Leave in full feather" (closing CTA)
- "Show it off" (finish and aftercare moments)

### What we stole, and from where
| Move | Taken from | How we changed it |
|---|---|---|
| One promise over many services | milk + honey ("feel elevated, stay grounded" above spa, medSPA and salon) | Our line is about hands and care, not mood, because Kikiewa's difference is skill |
| A short, ownable line instead of a description | Hershesons ("Great Hair Made Easy") | Same length, but warmer and covering more than hair |
| Philosophy before services | Bamford (calm philosophy paragraph first) | Shorter, and turned into three promises a client can check |
| Everything under one roof, with help choosing | Trosuit ("Not sure where to start?" plus WhatsApp) | Same helpfulness, without the eight-category mall menu |
| The name as a story | ORÍKÌ (explains its Yoruba name) | Waiting on the client: see the note below |

**About the name:** *ẹwà* is Yoruba for "beauty". If "Kikiewa" comes from it, that's the most ownable story the brand has, and the About section should be built on it. **Ask the client what the name means before using this.** Don't publish it as a guess.

---

## Brand voice

**Warm, assured, unhurried. A trusted expert who also happens to be kind.**

| We sound like | We never sound like |
|---|---|
| Someone who has done this a thousand times and still cares | An advert shouting "best in Lagos" |
| Specific: what, how long, what it costs | Vague: "luxury experience like no other" |
| Short sentences with room to breathe | Exclamation marks, emoji, ALL CAPS |
| "We'll check it suits your skin first" | "Flawless skin guaranteed" |
| The same voice everywhere, a little more precise on skin treatments | A salon voice here and a hospital voice there |

**One voice, one dial.** Kikiewa speaks the same way on every page. On skin and aesthetic pages, the dial turns up on precision (consultation, assessment, aftercare), but the warmth stays. It's the same people, being careful.

**Banned words:** best, No. 1, world-class, guaranteed, flawless, perfect, miracle, painless, risk-free, permanent (medical), cheap, affordable luxury, "slay", "house"/"houses" (for parts of the business), "division" (on screen).

**Say this, not that:**
| Not | Instead |
|---|---|
| Our Salon & Spa division | Hair, nails and spa at Kikiewa |
| Our Medical Spa house | Skin & aesthetics at Kikiewa |
| Visit our three brands | Everything under one name |
| Medical Spa clients | You (the same client, booking a skin treatment) |

### CTA library (use these exact labels)
| Situation | Label |
|---|---|
| Primary booking, anywhere | Book an appointment |
| Short, header and mobile bar | Book |
| Any skin or aesthetic treatment | Book a consultation |
| WhatsApp | Chat on WhatsApp |
| Help choosing | Help me choose (opens WhatsApp) |
| Phone | Call us |
| Service area link | See hair services / See skin treatments / See our courses |
| Service row | Book this service |
| Course card | View course |
| Institute enquiry | Book a visit |
| Directions | Get directions |
| Gallery | See more work |

---

## Global elements

### Header
- Logo: Kikiewa (accessible name)
- **Nav:** Hair & Beauty · Skin & Aesthetics · Academy · Gallery · Visit us
  - These are the labels people see. URLs stay `/salon-spa`, `/medical-spa` and `/beauty-institute` for SEO.
- Dropdowns:
  - **Hair & Beauty:** Hair · Nails · Makeup · Spa & massage · Facials · Brows & lashes
  - **Skin & Aesthetics:** Treatments · By concern · Your consultation
  - **Academy:** Courses · How to apply
- Buttons: **Book** · WhatsApp (icon, accessible name "Chat on WhatsApp")
- Utility bar (desktop): `Ikorodu, Lagos · {{phone}} · Opening hours · Contact`

### Mobile action bar
Book · WhatsApp · Call. The Call button opens "Which location?": **Ebute** (hair, nails & spa) / **Nitel** (skin & aesthetics).

### Footer
- Under the logo: **Beauty, in good hands.** Ikorodu, Lagos.
- Columns:
  - **Visit:** Ebute, Ikorodu: {{ebute.address}} · {{ebute.hours}} | Nitel, Ikorodu: {{nitel.address}} · {{nitel.hours}}
  - **Explore:** Hair & Beauty · Skin & Aesthetics · Academy · Gallery · Journal
  - **Help:** Book an appointment · Contact · Booking & cancellation policy · Privacy
  - **Follow:** {{instagram}} · {{tiktok}} · {{facebook}}
- Legal: © {year} Kikiewa. All rights reserved.
- Skin-treatment note (footer and Skin & Aesthetics pages): *Skin and aesthetic treatments follow a consultation and suitability assessment. Individual results vary.*

### Closing CTA band (all pages)
- **Heading:** Come in. Leave in full feather.
- **Body:** Book online in a minute, or message us and we'll help you choose.
- **Buttons:** Book an appointment · Chat on WhatsApp

---

## 1. Home `/`

**Hero**
- Eyebrow: Kikiewa · Ikorodu, Lagos
- **H1:** Beauty, in good hands.
- Sub: Hair, nails, spa, skin and aesthetic care, all under one name in Ikorodu, from people who take your beauty as seriously as you do.
- Buttons: Book an appointment · Help me choose

**Promise** (straight after the hero: large serif statement, three short columns below)
- Statement: *We believe beauty shouldn't be rushed, oversold or left to chance. So we take our time, we tell you the truth, and we do the work beautifully.*
- Columns: **Unhurried** · **Honest** · **Beautifully done** (use the three promises' copy)

**Everything you come to us for** (H2: *All of you, under one roof*)
- Intro: Book one thing or make a day of it. Whatever brings you in, it's the same care, the same standards and the same people.
- Tiles (image, name, one line, link):

| Tile | Line | Links to |
|---|---|---|
| Hair | Cuts, colour, styling and treatments for every texture. | `/salon-spa#hair` |
| Nails | Manicures and pedicures, finished with precision. | `/salon-spa#nails` |
| Makeup | For the big day, the big night and everything between. | `/salon-spa#makeup` |
| Spa & massage | Massages and body rituals to help you fully switch off. | `/salon-spa#spa` |
| Facials | Relaxing, results-minded facials for healthy, glowing skin. | `/salon-spa#facials` |
| Skin & aesthetics | Clinical skin treatments, always starting with a consultation. | `/medical-spa` |

(The client must confirm which categories exist. Remove any that don't.)

**Skin & aesthetics feature** (split image/text: this is where the med spa lives on Home, as part of the brand, not a separate one)
- Eyebrow: Skin & aesthetics
- **H2:** When your skin needs more than a facial.
- Body: For pigmentation, breakouts, texture and more, our skin and aesthetic treatments bring clinical care into the same caring hands. Every treatment starts with a consultation, so you only ever get what's right for your skin.
- Small print: At our Nitel location, Ikorodu.
- Button: Book a consultation

**The finish** (experience section, image left)
- Eyebrow: Your visit
- **H2:** Time set aside, just for you.
- Body: Lagos moves fast. Your appointment shouldn't. Every visit starts with a conversation about what you'd like, and ends with a finish you'll want to show off, plus simple advice on keeping it that way.

**Signature services** (H2: *What our guests come back for*)
- Pulled from data, mixing both locations. Skin treatments show "Book a consultation".
- Note: "come back for" claims popularity. Use this heading only once the client confirms which services are most booked. Until then use *A few favourites*.

**Gallery strip** (H2: *Made to be seen*)
- Line: Recent work, our spaces, and the moments in between.
- Link: See more work

**Academy** (narrow band)
- Eyebrow: Kikiewa Beauty Institute
- **H2:** We teach what we practise.
- Body: Our institute trains the next generation of beauty professionals to the same standards our clients see every day.
- Button: See our courses

**Visit us** (H2: *Find us in Ikorodu*)
- Intro: Two locations in Ikorodu, each set up for its own kind of care.
- **Ebute:** Hair, nails, makeup and spa · {{ebute.address}} · {{ebute.hours}} · Get directions
- **Nitel:** Skin, aesthetics and makeover · {{nitel.address}} · {{nitel.hours}} · Get directions

**Reviews:** hidden until real, approved reviews exist. Heading for later: *In their words.*

**Our story** (only once the client supplies it)
- **H2:** What's in a name
- Body: {{brand.story: the meaning of "Kikiewa", the founder, the year founded}}

**Closing CTA band** (global)

---

## 2. Hair & Beauty `/salon-spa` (nav label: Hair & Beauty)

**Hero**
- Eyebrow: Hair & Beauty · Ebute, Ikorodu
- **H1:** Unhurried care, from the first wash to the final finish.
- Sub: Hair, nails, makeup, massage and spa at Kikiewa in Ebute, Ikorodu. Come in for one service or stay for the afternoon.
- Buttons: Book an appointment · Chat on WhatsApp

**Intro** (large serif paragraph)
> Good beauty work takes time. We give it that time: a conversation before we begin, techniques suited to your hair and skin, and a finish you'll want to show off.

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

## 3. Skin & Aesthetics `/medical-spa` (nav label: Skin & Aesthetics; SEO term: medical spa)

**Hero** (cool and restrained)
- Eyebrow: Skin & Aesthetics · Kikiewa Medical Spa, Nitel, Ikorodu
- **H1:** Every treatment begins with a conversation.
- Sub: The same Kikiewa care, with clinical standards. We assess, explain and plan with you before any treatment begins.
- Buttons: Book a consultation · Chat on WhatsApp

**Intro** (large serif paragraph)
> Choosing a skin treatment is a personal decision. So we do what Kikiewa always does: take our time, tell you the truth, and recommend only what is suitable for you.

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

## 4. Academy `/beauty-institute` (nav label: Academy; full name: Kikiewa Beauty Institute)

**Hero**
- Eyebrow: Kikiewa Beauty Institute · Ikorodu
- **H1:** Learn the craft where it's practised.
- Sub: Practical training at the Kikiewa Beauty Institute, from the people whose work you see in our salon, spa and clinic every day.
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
- **H1:** Made to be seen
- Sub: Recent work, our spaces, and the moments in between.
- Filters: All · Hair & Beauty · Skin & Aesthetics · Academy
- Empty state: New photographs are on the way. Follow us on Instagram for the latest.
- Caption rule: describe what's shown, e.g. "Treatment room at our Nitel medical spa". No client names.

---

## 6. Locations `/locations`
- **H1:** Visit us in Ikorodu
- Sub: One Kikiewa, two locations, each set up for its own kind of care.
- Ebute card: **Ebute** · hair, nails, makeup and spa · address · hours · Get directions
- Nitel card: **Nitel** · skin, aesthetics and makeover · address · hours · Get directions

### `/locations/ebute`
- **H1:** Salon & Spa in Ebute, Ikorodu
- Intro: Kikiewa in Ebute is where you'll find our hair, nails, makeup and spa services, delivered without rushing.
- Blocks: Address & directions {{landmark, parking, nearest bus stop}} · Opening hours table · Services at this location (links) · Photo strip · CTA

### `/locations/nitel`
- **H1:** Medical Spa in Nitel, Ikorodu
- Intro: Kikiewa in Nitel is home to our Medical Spa & Makeover: skin and aesthetic treatments that always begin with a consultation.
- Blocks: same as Ebute, with treatments in place of services

---

## 7. Book `/book`
- **H1:** Book an appointment
- Sub: Choose a service and your preferred time. We'll confirm on WhatsApp.
- Step headings: 1 Choose a location · 2 Choose a service · 3 Preferred date & time · 4 Your details · 5 Review & send
- Step 1 is **What would you like?**, not "which location". Options: **Hair, nails, makeup or spa** (at Ebute) / **Skin or aesthetic treatment** (at Nitel, starts with a consultation). The location follows from the choice.
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
- Form labels: Name · Phone · Email (optional) · What's it about? (Hair & beauty / Skin & aesthetics / Academy / Something else) · Message
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
- Links: Home · Hair & Beauty · Skin & Aesthetics · Book an appointment

---

## 11. Image alt text pattern
`{{what is shown}} at Kikiewa, {{location}}, Ikorodu`
- Good: "Treatment room with a reclining bed at Kikiewa, Nitel, Ikorodu"
- Good: "Stylist finishing a silk press at Kikiewa, Ebute, Ikorodu"
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
