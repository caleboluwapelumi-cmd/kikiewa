import type { IconName } from "@/components/Icon";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Single source of content for the site. Every page reads from here.
 *
 * Content rules (reference/design-tokens.md, reference/copy-deck.md):
 * - No invented credentials, statistics, prices, durations, treatment claims
 *   or testimonials. Anything unconfirmed is the literal `TBC`. Never print a
 *   TBC value directly.
 * - "To be confirmed" (components/Confirmable.tsx) is shown only for prices
 *   and durations in service and treatment rows, and in fact tables.
 *   Anything else that is TBC (credentials, licence, team, reviews, intake
 *   flags) is hidden until confirmed.
 * - Marketing copy written before client sign-off is marked
 *   `// DRAFT COPY - client approval needed`. Copy comes from
 *   reference/copy-deck.md; `{{tokens}}` there are `TBC` here.
 * - Both locations are in Ikorodu, Lagos State.
 */

/* ---------------------------------------------------------------------------
   Primitives
--------------------------------------------------------------------------- */

/** A value the client has not confirmed yet. */
export const TBC = "TBC" as const;
export type TBC = typeof TBC;
export type OrTBC<T> = T | TBC;

export function isTBC(value: unknown): value is TBC {
  return value === TBC;
}

/** True when at least one value is confirmed. Used to hide all-TBC sections. */
export function hasConfirmed(values: unknown[]): boolean {
  return values.some((value) => value !== undefined && !isTBC(value));
}

export type DivisionSlug = "salon-spa" | "medical-spa" | "institute";
export type ServiceDivision = Exclude<DivisionSlug, "institute">;

export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children?: NavLink[] };

/* ---------------------------------------------------------------------------
   Content model
--------------------------------------------------------------------------- */

/**
 * A photograph. `source` defaults to "final"; "instagram-temp" marks a
 * stand-in taken from Instagram, stored under public/images/{division}/temp/.
 * `npm run check:images` lists every temp image still referenced.
 *
 * Alt text pattern: "{what is shown} at Kikiewa, {location}, Ikorodu".
 */
export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  division?: DivisionSlug;
  category?: string;
  source?: "final" | "instagram-temp";
};

export interface GalleryItem extends ImageAsset {
  caption?: string;
}

export type ConcernSlug =
  | "pigmentation"
  | "acne-scarring"
  | "texture"
  | "hydration"
  | "ageing"
  | "unwanted-hair";

/** Medical spa only. */
export type Concern = { slug: ConcernSlug; name: string; summary: string };

export type ServiceCategory = {
  slug: string;
  division: ServiceDivision;
  name: string;
  icon: IconName;
  summary: OrTBC<string>;
};

export type Service = {
  slug: string;
  division: ServiceDivision;
  /** A ServiceCategory slug in the same division. */
  category: string;
  name: string;
  summary: string;
  durationMins?: OrTBC<number>;
  priceFrom?: OrTBC<number>;
  currency: "NGN";
  requiresConsultation: boolean;
  concerns?: ConcernSlug[];
  image?: ImageAsset;
};

export type Course = {
  slug: string;
  name: string;
  summary: OrTBC<string>;
  level: OrTBC<string>;
  entryRequirements: OrTBC<string>;
  duration: OrTBC<string>;
  /** In naira. */
  fee: OrTBC<number>;
  nextIntake: OrTBC<string>;
  certifyingBody: OrTBC<string>;
};

/** Hidden until the client supplies names and verified roles. */
export type TeamMember = {
  name: OrTBC<string>;
  role: string;
  division: DivisionSlug;
  bio: OrTBC<string>;
  image?: ImageAsset;
};

/* ---------------------------------------------------------------------------
   Site, contact, navigation
--------------------------------------------------------------------------- */

export const site = {
  name: "Kikiewa",
  url: "https://kikiewa.com",
  /** Where both locations are. Confirmed in the brief. */
  area: "Ikorodu, Lagos State",
  lang: "en-NG",
  ogLocale: "en_NG",
  /** Static: cacheComponents rejects new Date() during prerender. */
  copyrightYear: 2026,
} as const;

/** Business-wide contact details. Location details live on each location. */
export const contact: {
  whatsapp: OrTBC<string>;
  /** Main line, shown on /contact. */
  phone: OrTBC<string>;
  email: OrTBC<string>;
} = {
  whatsapp: TBC,
  phone: TBC,
  email: TBC,
};

export const bookingHref = "/book";
export const contactHref = "/contact";

// DRAFT COPY - client approval needed
/** Pre-filled WhatsApp messages (copy deck, "WhatsApp prefilled messages"). */
export const whatsappMessages = {
  general: "Hello Kikiewa, I'd like some help choosing a service.",
  salon: "Hello Kikiewa, I'd like to book an appointment in Ebute.",
  medical: "Hello Kikiewa Medical Spa, I'd like to book a consultation.",
  institute:
    "Hello Kikiewa Beauty Institute, I'd like to know more about your courses and the next intake.",
} as const;

/** Pre-filled WhatsApp message for the header and mobile action bar. */
export const whatsappGreeting = whatsappMessages.general;

/** WhatsApp link with the general greeting (falls back to /contact while TBC). */
export const whatsappHref = whatsappLink(contact.whatsapp, whatsappGreeting);

/**
 * Nav labels are what people see; the URLs stay /salon-spa, /medical-spa and
 * /beauty-institute for search. The Hair & Beauty dropdown jumps to the
 * category anchors on /salon-spa (ids are the category slugs).
 */
// DRAFT COPY - client approval needed
export const primaryNav: NavItem[] = [
  {
    label: "Hair & Beauty",
    href: "/salon-spa",
    children: [
      { label: "Hair", href: "/salon-spa#hair" },
      { label: "Nails", href: "/salon-spa#nails" },
      { label: "Makeup", href: "/salon-spa#makeup" },
      { label: "Spa & massage", href: "/salon-spa#spa" },
      { label: "Facials", href: "/salon-spa#facials" },
      { label: "Brows & lashes", href: "/salon-spa#brows-lashes" },
    ],
  },
  {
    label: "Skin & Aesthetics",
    href: "/medical-spa",
    children: [
      { label: "Treatments", href: "/medical-spa/treatments" },
      { label: "By concern", href: "/medical-spa/concerns" },
      { label: "Your consultation", href: "/medical-spa/consultation" },
    ],
  },
  {
    label: "Academy",
    href: "/beauty-institute",
    children: [
      { label: "Courses", href: "/beauty-institute/courses" },
      { label: "How to apply", href: "/beauty-institute/admissions" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Visit us", href: "/locations" },
];

export const hoursLink: NavLink = { label: "Opening hours", href: "/locations" };

/** Desktop utility bar: "Ikorodu, Lagos · {phone} · Opening hours · Contact". */
export const utilityBar = {
  place: "Ikorodu, Lagos",
} as const;

/* ---------------------------------------------------------------------------
   SEO: one row per route (reference/seo-plan.md, section 3).
   Titles ≤ 60 characters, descriptions ≤ 155, never "TBC" or "{{".
   `npm run check:seo` checks the built pages against these rules.
--------------------------------------------------------------------------- */

export type PageMeta = { title: string; description: string; path: string };

// DRAFT COPY - client approval needed
export const seo = {
  home: {
    path: "/",
    title: "Kikiewa | Salon, Spa & Medical Spa in Ikorodu, Lagos",
    description:
      "Beauty, in good hands. Hair, nails, spa, skin and aesthetic care at Kikiewa in Ikorodu, Lagos. Book online or chat on WhatsApp.",
  },
  salonSpa: {
    path: "/salon-spa",
    title: "Salon & Spa in Ikorodu, Lagos | Kikiewa",
    description:
      "Hair, nails, massage and spa rituals at Kikiewa, Ebute, Ikorodu. See services and prices, then book online or on WhatsApp.",
  },
  salonServices: {
    path: "/salon-spa/services",
    title: "Hair, Nails & Spa Services in Ikorodu | Kikiewa",
    description:
      "Hair, nails, makeup, massage and spa at Kikiewa in Ebute, Ikorodu. See durations and starting prices, then book online or on WhatsApp.",
  },
  medicalSpa: {
    path: "/medical-spa",
    title: "Medical Spa in Ikorodu, Lagos | Kikiewa",
    description:
      "Consultation-led skin and aesthetic treatments at Kikiewa, Nitel, Ikorodu. Book a consultation online or on WhatsApp.",
  },
  treatments: {
    path: "/medical-spa/treatments",
    title: "Skin & Aesthetic Treatments in Ikorodu | Kikiewa",
    description:
      "Skin and aesthetic treatments at Kikiewa in Nitel, Ikorodu. Every treatment begins with a consultation and a suitability assessment.",
  },
  concerns: {
    path: "/medical-spa/concerns",
    title: "Skin Concerns in Ikorodu, Lagos | Kikiewa",
    description:
      "Start with your concern: pigmentation, breakouts, texture and more. Book a consultation at Kikiewa in Nitel, Ikorodu, to find what suits your skin.",
  },
  consultation: {
    path: "/medical-spa/consultation",
    title: "Your Skin Consultation | Kikiewa Ikorodu",
    description:
      "What happens at a skin consultation at Kikiewa in Nitel, Ikorodu: your concerns, medical history, suitable options, costs and aftercare.",
  },
  institute: {
    path: "/beauty-institute",
    title: "Beauty School & Training in Ikorodu | Kikiewa",
    description:
      "Practical beauty courses in Ikorodu, Lagos: compare levels, duration, fees and intake dates at the Kikiewa Beauty Institute.",
  },
  courses: {
    path: "/beauty-institute/courses",
    title: "Beauty Courses in Ikorodu, Lagos | Kikiewa",
    description:
      "Compare beauty courses at the Kikiewa Beauty Institute in Ikorodu, Lagos: level, entry requirements, duration, fees and next intake.",
  },
  admissions: {
    path: "/beauty-institute/admissions",
    title: "How to Apply | Kikiewa Beauty Institute, Ikorodu",
    description:
      "How to apply to the Kikiewa Beauty Institute in Ikorodu, Lagos: choose a course, book a visit to see where you'll train, then apply and enrol.",
  },
  locations: {
    path: "/locations",
    title: "Our Locations in Ikorodu, Lagos | Kikiewa",
    description:
      "Kikiewa Salon & Spa in Ebute and Medical Spa in Nitel, both in Ikorodu, Lagos. Addresses, opening hours and directions.",
  },
  ebute: {
    path: "/locations/ebute",
    title: "Kikiewa Ebute, Ikorodu | Salon & Spa",
    description:
      "Find Kikiewa Salon & Spa in Ebute, Ikorodu: address, opening hours, directions and services. Book online or on WhatsApp.",
  },
  nitel: {
    path: "/locations/nitel",
    title: "Kikiewa Nitel, Ikorodu | Medical Spa",
    description:
      "Find Kikiewa Medical Spa in Nitel, Ikorodu: address, opening hours, directions and treatments. Book a consultation.",
  },
  gallery: {
    path: "/gallery",
    title: "Gallery | Kikiewa Ikorodu",
    description:
      "Inside Kikiewa: our salon, spa and medical spa spaces in Ikorodu, Lagos, and recent work from our team.",
  },
  book: {
    path: "/book",
    title: "Book an Appointment | Kikiewa Ikorodu",
    description:
      "Book a salon, spa or medical spa appointment at Kikiewa in Ikorodu, Lagos. Choose a service and time; we'll confirm on WhatsApp.",
  },
  contact: {
    path: "/contact",
    title: "Contact Kikiewa | Ikorodu, Lagos",
    description:
      "Call, WhatsApp or message Kikiewa Salon & Spa (Ebute) and Medical Spa (Nitel), Ikorodu, Lagos.",
  },
  licensing: {
    path: "/licensing",
    title: "Licensing & Compliance | Kikiewa",
    description:
      "Licence and registration details for Kikiewa in Ikorodu, Lagos. We publish each one here once it has been verified.",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy | Kikiewa",
    description:
      "How Kikiewa collects, uses and protects your personal information when you book, enquire or visit us in Ikorodu, Lagos.",
  },
} satisfies Record<string, PageMeta>;

/* ---------------------------------------------------------------------------
   Locations
--------------------------------------------------------------------------- */

export type LocationId = "ebute" | "nitel";

export type Location = {
  id: LocationId;
  /** Area name, e.g. "Ebute". */
  name: string;
  /** Area and town, e.g. "Ebute, Ikorodu". */
  area: string;
  /** What you come here for, short: "Hair, nails & spa". Footer and eyebrows. */
  services: string;
  /** What you come here for, in full: "Hair, nails, makeup and spa". Cards. */
  offer: string;
  /** Row label in the mobile "Which location?" sheet. */
  callLabel: string;
  icon: IconName;
  /** The location page's H1 (copy deck section 6). */
  title: string;
  /** The location page's intro. */
  body: string;
  address: OrTBC<string>;
  hours: OrTBC<string>;
  phone: OrTBC<string>;
  phoneLabel: string;
  primaryCta: NavLink;
  href: string;
};

// DRAFT COPY - client approval needed
export const ebuteLocation: Location = {
  id: "ebute",
  name: "Ebute",
  area: "Ebute, Ikorodu",
  services: "Hair, nails & spa",
  offer: "Hair, nails, makeup and spa",
  callLabel: "Ebute: hair, nails & spa",
  icon: "pin",
  title: "Salon & Spa in Ebute, Ikorodu",
  body: "Kikiewa in Ebute is where you'll find our hair, nails, makeup and spa services, delivered without rushing.",
  address: TBC,
  hours: TBC,
  phone: TBC,
  phoneLabel: "Phone",
  primaryCta: { label: "Book an appointment", href: bookingHref + "?location=ebute" },
  href: "/locations/ebute",
};

/** The medical spa. Read by the home page and by /medical-spa. */
// DRAFT COPY - client approval needed
export const nitelLocation: Location = {
  id: "nitel",
  name: "Nitel",
  area: "Nitel, Ikorodu",
  services: "Skin & aesthetics",
  offer: "Skin, aesthetics and makeover",
  callLabel: "Nitel: skin & aesthetics",
  icon: "hospital",
  title: "Medical Spa in Nitel, Ikorodu",
  body: "Kikiewa in Nitel is home to our Medical Spa & Makeover: skin and aesthetic treatments that always begin with a consultation.",
  address: TBC,
  hours: TBC,
  phone: TBC,
  phoneLabel: "Phone",
  primaryCta: {
    label: "Book a consultation",
    href: bookingHref + "?location=nitel",
  },
  href: "/locations/nitel",
};

export const locations: Location[] = [ebuteLocation, nitelLocation];

/** The mobile Call sheet. Rows with a TBC phone open /contact instead. */
// DRAFT COPY - client approval needed
export const callSheet = {
  trigger: "Call",
  title: "Which location?",
  close: "Close",
  /** Shown under a row while that location's phone is TBC. */
  fallback: "See contact details",
} as const;

export type LocationBlockCopy = {
  eyebrow: string;
  heading: string;
  body?: string;
  mapAlt: string;
  whatsappLabel: string;
  whatsappMessage: string;
};

/* ---------------------------------------------------------------------------
   Services, concerns, courses, team, gallery
--------------------------------------------------------------------------- */

/**
 * Category names group the menus. The client must confirm which salon
 * categories exist; delete any that don't.
 */
// DRAFT COPY - client approval needed (salon summaries)
export const serviceCategories: ServiceCategory[] = [
  // Salon & Spa (Ebute)
  {
    slug: "hair",
    division: "salon-spa",
    name: "Hair",
    icon: "scissors",
    summary: "Cuts, styling, colour and treatments for every texture, natural hair included.",
  },
  {
    slug: "nails",
    division: "salon-spa",
    name: "Nails",
    icon: "hand",
    summary: "Manicures, pedicures and nail care, finished with precision.",
  },
  {
    // Slug doubles as the /salon-spa anchor; the nav and Home link to #spa.
    slug: "spa",
    division: "salon-spa",
    name: "Massage & body",
    icon: "spa",
    summary: "Massages and body rituals to release tension and restore calm.",
  },
  {
    slug: "facials",
    division: "salon-spa",
    name: "Facials",
    icon: "face",
    summary: "Relaxing, results-minded facials for a fresh, healthy glow.",
  },
  {
    slug: "makeup",
    division: "salon-spa",
    name: "Makeup",
    icon: "brush",
    summary: "Event, bridal and everyday makeup, matched to your skin and occasion.",
  },
  {
    slug: "brows-lashes",
    division: "salon-spa",
    name: "Brows & lashes",
    icon: "sparkle",
    summary: "Shaping, tinting and lash services, kept natural or made bold.",
  },
  // Medical Spa & Makeover (Nitel). Names only from the licence-approved list.
  { slug: "injectables", division: "medical-spa", name: "Injectables", icon: "syringe", summary: TBC },
  { slug: "skin-treatments", division: "medical-spa", name: "Skin Treatments", icon: "spa", summary: TBC },
  { slug: "makeup-makeover", division: "medical-spa", name: "Makeup & Makeover", icon: "brush", summary: TBC },
  { slug: "bridal-makeover", division: "medical-spa", name: "Bridal Makeover", icon: "sparkle", summary: TBC },
  { slug: "facial-aesthetics", division: "medical-spa", name: "Facial Aesthetics", icon: "face", summary: TBC },
  { slug: "consultations", division: "medical-spa", name: "Consultations", icon: "notes", summary: TBC },
];

export function categoriesFor(division: ServiceDivision): ServiceCategory[] {
  return serviceCategories.filter((category) => category.division === division);
}

/**
 * Seed menu. Names are generic and every duration and price is TBC until the
 * client supplies the real list.
 */
// DRAFT COPY - client approval needed (all summaries)
export const services: Service[] = [
  // Salon & Spa
  {
    slug: "hair-styling",
    division: "salon-spa",
    category: "hair",
    name: "Hair Styling",
    summary: "Washing, styling and finishing, talked through with you before we begin.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: false,
  },
  {
    slug: "bridal-styling",
    division: "salon-spa",
    category: "hair",
    name: "Bridal & Event Styling",
    summary: "Hair and styling for your day, planned with you in advance.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: false,
  },
  {
    slug: "manicure",
    division: "salon-spa",
    category: "nails",
    name: "Manicure",
    summary: "Nail shaping, cuticle care and a finish of your choice.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: false,
  },
  {
    slug: "pedicure",
    division: "salon-spa",
    category: "nails",
    name: "Pedicure",
    summary: "Foot care and a finish of your choice, at an unhurried pace.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: false,
  },
  {
    slug: "massage",
    division: "salon-spa",
    category: "spa",
    name: "Massage",
    summary: "Time to unwind, with pressure and focus agreed with you first.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: false,
  },
  {
    slug: "signature-facial",
    division: "salon-spa",
    category: "facials",
    name: "Signature Facial",
    summary: "A cleansing, calming facial suited to your skin on the day.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: false,
  },
  // Medical Spa & Makeover
  {
    slug: "consultation",
    division: "medical-spa",
    category: "consultations",
    name: "Consultation",
    summary: "Where every medical spa treatment begins: your history, your goals and what is suitable for you.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: false,
    concerns: ["pigmentation", "acne-scarring", "texture", "hydration", "ageing", "unwanted-hair"],
  },
  {
    slug: "skin-treatment",
    division: "medical-spa",
    category: "skin-treatments",
    name: "Skin Treatment",
    summary: "Skin treatments planned at consultation. Suitability is assessed in person.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: true,
  },
  {
    slug: "injectable-treatment",
    division: "medical-spa",
    category: "injectables",
    name: "Injectable Treatment",
    summary: "Considered only after a consultation. Results vary from person to person.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: true,
  },
  {
    slug: "facial-aesthetics",
    division: "medical-spa",
    category: "facial-aesthetics",
    name: "Facial Aesthetics",
    summary: "Facial aesthetic treatments, agreed in a written plan after consultation.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: true,
  },
  {
    slug: "makeover-session",
    division: "medical-spa",
    category: "makeup-makeover",
    name: "Makeover Session",
    summary: "Makeup and styling for an occasion, or just for you.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: false,
  },
  {
    slug: "bridal-makeover",
    division: "medical-spa",
    category: "bridal-makeover",
    name: "Bridal Makeover",
    summary: "Bridal makeup planned with you ahead of the day.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: false,
  },
];

export function servicesFor(division: ServiceDivision): Service[] {
  return services.filter((service) => service.division === division);
}

/**
 * Concern cards for the medical spa. Show only those the client confirms the
 * licence allows. Concerns stay unlinked from treatments for now.
 */
// DRAFT COPY - client approval needed
export const concerns: Concern[] = [
  {
    slug: "pigmentation",
    name: "Pigmentation & uneven tone",
    summary: "For dark spots, patches and uneven skin tone.",
  },
  {
    slug: "acne-scarring",
    name: "Acne & scarring",
    summary: "For active breakouts and the marks they leave behind.",
  },
  {
    slug: "texture",
    name: "Texture & pores",
    summary: "For rough texture and enlarged pores.",
  },
  {
    slug: "hydration",
    name: "Hydration & glow",
    summary: "For dull, dehydrated or tired-looking skin.",
  },
  {
    slug: "ageing",
    name: "Fine lines & firmness",
    summary: "For early signs of ageing.",
  },
  {
    slug: "unwanted-hair",
    name: "Unwanted hair",
    summary: "For longer-term hair reduction.",
  },
];

/** Generic course names. Every course detail is TBC with the client. */
// DRAFT COPY - client approval needed (summaries)
export const courses: Course[] = [
  {
    slug: "cosmetology",
    name: "Cosmetology",
    summary: "Skin, hair and beauty foundations, taught in working rooms.",
    level: TBC,
    entryRequirements: TBC,
    duration: TBC,
    fee: TBC,
    nextIntake: TBC,
    certifyingBody: TBC,
  },
  {
    slug: "makeup-artistry",
    name: "Bridal & Editorial Makeup",
    summary: "Makeup for brides, events and camera.",
    level: TBC,
    entryRequirements: TBC,
    duration: TBC,
    fee: TBC,
    nextIntake: TBC,
    certifyingBody: TBC,
  },
  {
    slug: "spa-therapy",
    name: "Spa Therapy",
    summary: "Spa treatments and the running of a treatment room.",
    level: TBC,
    entryRequirements: TBC,
    duration: TBC,
    fee: TBC,
    nextIntake: TBC,
    certifyingBody: TBC,
  },
];

/** Hidden until the client supplies real people (copy deck: "Hidden until real"). */
export const team: TeamMember[] = [
  { name: TBC, role: "Salon & Spa team", division: "salon-spa", bio: TBC },
  { name: TBC, role: "Medical Spa practitioner", division: "medical-spa", bio: TBC },
  { name: TBC, role: "Institute tutor", division: "institute", bio: TBC },
];

/**
 * Gallery photographs. Empty until photography is supplied. No client faces
 * or before/after images without written consent (public/images/README.md).
 * Captions describe what is shown, never client names.
 */
export const gallery: GalleryItem[] = [];

/* ---------------------------------------------------------------------------
   Home
--------------------------------------------------------------------------- */

/**
 * Home, in the copy deck's v2 order: hero, promise, everything under one
 * roof, skin & aesthetics, your visit, favourites, gallery, Academy, visit
 * us, closing band. Kikiewa is one brand; Ebute and Nitel are just where
 * you go for each service.
 */

// DRAFT COPY - client approval needed
export const hero: {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: NavLink;
  /** "Help me choose" opens WhatsApp with the general greeting. */
  secondaryCta: NavLink;
  image: { alt: string; asset?: ImageAsset };
} = {
  eyebrow: "Kikiewa · Ikorodu, Lagos",
  heading: "Beauty, in good hands.",
  body: "Hair, nails, spa, skin and aesthetic care, all under one name in Ikorodu, from people who take your beauty as seriously as you do.",
  primaryCta: { label: "Book an appointment", href: bookingHref },
  secondaryCta: { label: "Help me choose", href: whatsappHref },
  image: {
    alt: "Stylist finishing a client's hair at Kikiewa, Ebute, Ikorodu",
  },
};

export type Pillar = { title: string; body: string };

/** The three promises under the line (copy deck, "The brand idea"). */
// DRAFT COPY - client approval needed
export const brandPromise: {
  /** Visually hidden: the section's heading for assistive tech. */
  heading: string;
  statement: string;
  pillars: Pillar[];
} = {
  heading: "Our promise",
  statement:
    "We believe beauty shouldn't be rushed, oversold or left to chance. So we take our time, we tell you the truth, and we do the work beautifully.",
  pillars: [
    {
      title: "Unhurried",
      body: "Time is part of the treatment. Nobody rushes you to make room for the next booking.",
    },
    {
      title: "Honest",
      body: "We tell you what will suit you, what it costs and what to expect, including when something isn't right for you.",
    },
    {
      title: "Beautifully done",
      body: "Careful work, and a finish you'll want to show off.",
    },
  ],
};

export type Offering = {
  name: string;
  line: string;
  href: string;
  imageAlt: string;
  image?: ImageAsset;
};

// DRAFT COPY - client approval needed
export const offeringsIntro: { heading: string; body: string } = {
  heading: "All of you, under one roof",
  body: "Book one thing or make a day of it. Whatever brings you in, it's the same care, the same standards and the same people.",
};

/**
 * Home tiles. The client must confirm which categories exist; remove any
 * that don't (and the matching anchor on /salon-spa).
 */
// DRAFT COPY - client approval needed
export const offerings: Offering[] = [
  {
    name: "Hair",
    line: "Cuts, colour, styling and treatments for every texture.",
    href: "/salon-spa#hair",
    imageAlt: "Stylist at work on a client's hair at Kikiewa, Ebute, Ikorodu",
  },
  {
    name: "Nails",
    line: "Manicures and pedicures, finished with precision.",
    href: "/salon-spa#nails",
    imageAlt: "Manicure in progress at Kikiewa, Ebute, Ikorodu",
  },
  {
    name: "Makeup",
    line: "For the big day, the big night and everything between.",
    href: "/salon-spa#makeup",
    imageAlt: "Makeup artist at work at Kikiewa, Ebute, Ikorodu",
  },
  {
    name: "Spa & massage",
    line: "Massages and body rituals to help you fully switch off.",
    href: "/salon-spa#spa",
    imageAlt: "Massage room at Kikiewa, Ebute, Ikorodu",
  },
  {
    name: "Facials",
    line: "Relaxing, results-minded facials for healthy, glowing skin.",
    href: "/salon-spa#facials",
    imageAlt: "Facial treatment at Kikiewa, Ebute, Ikorodu",
  },
  {
    name: "Skin & aesthetics",
    line: "Clinical skin treatments, always starting with a consultation.",
    href: "/medical-spa",
    imageAlt: "Consultation room at Kikiewa, Nitel, Ikorodu",
  },
];

export type FeatureCopy = {
  eyebrow: string;
  heading: string;
  body: string;
  note?: string;
  cta?: NavLink;
  imageAlt: string;
  image?: ImageAsset;
};

/** Where skin & aesthetics lives on Home: part of the brand, not a separate one. */
// DRAFT COPY - client approval needed
export const skinFeature: FeatureCopy = {
  eyebrow: "Skin & aesthetics",
  heading: "When your skin needs more than a facial.",
  body: "For pigmentation, breakouts, texture and more, our skin and aesthetic treatments bring clinical care into the same caring hands. Every treatment starts with a consultation, so you only ever get what's right for your skin.",
  note: "At our Nitel location, Ikorodu.",
  cta: {
    label: "Book a consultation",
    href: bookingHref + "?location=nitel&service=consultation",
  },
  imageAlt: "Consultation room at Kikiewa, Nitel, Ikorodu",
};

// DRAFT COPY - client approval needed
export const visitFeature: FeatureCopy = {
  eyebrow: "Your visit",
  heading: "Time set aside, just for you.",
  body: "Lagos moves fast. Your appointment shouldn't. Every visit starts with a conversation about what you'd like, and ends with a finish you'll want to show off, plus simple advice on keeping it that way.",
  imageAlt: "Quiet treatment room at Kikiewa, Ebute, Ikorodu",
};

/**
 * Signature services, mixing both locations. "What our guests come back for"
 * claims popularity: use it only once the client confirms the most-booked
 * services. Until then, "A few favourites".
 */
// DRAFT COPY - client approval needed
export const favourites: {
  heading: string;
  /** Service slugs, in display order. */
  slugs: string[];
  bookLabel: string;
  consultationLabel: string;
} = {
  heading: "A few favourites",
  slugs: [
    "hair-styling",
    "manicure",
    "massage",
    "signature-facial",
    "skin-treatment",
    "bridal-makeover",
  ],
  bookLabel: "Book this service",
  consultationLabel: "Book a consultation",
};

/** A gallery position with its alt text, waiting for a photograph. */
export type GallerySlot = { alt: string; image?: ImageAsset };

// DRAFT COPY - client approval needed
export const homeGallery: {
  heading: string;
  body: string;
  link: NavLink;
  items: GallerySlot[];
} = {
  heading: "Made to be seen",
  body: "Recent work, our spaces, and the moments in between.",
  link: { label: "See more work", href: "/gallery" },
  items: [
    { alt: "Finished hairstyle at Kikiewa, Ebute, Ikorodu" },
    { alt: "Treatment room at Kikiewa, Nitel, Ikorodu" },
    { alt: "Manicure and pedicure area at Kikiewa, Ebute, Ikorodu" },
    { alt: "Reception at Kikiewa, Ebute, Ikorodu" },
  ],
};

// DRAFT COPY - client approval needed
export const academyBand: {
  eyebrow: string;
  heading: string;
  body: string;
  cta: NavLink;
} = {
  eyebrow: "Kikiewa Beauty Institute",
  heading: "We teach what we practise.",
  body: "Our institute trains the next generation of beauty professionals to the same standards our clients see every day.",
  cta: { label: "See our courses", href: "/beauty-institute/courses" },
};

// DRAFT COPY - client approval needed
export const findUs: { heading: string; body: string } = {
  heading: "Find us in Ikorodu",
  body: "Two locations in Ikorodu, each set up for its own kind of care.",
};

export type CredibilityItem = {
  icon: IconName;
  title: string;
  body: string;
  detailLabel: string;
  detail: OrTBC<string>;
  standard: string;
};

export const credibilityIntro = {
  eyebrow: "Standards",
  heading: "Our standards",
} as const;

/** Hidden until at least one detail is confirmed. Not on Home for now. */
// DRAFT COPY - client approval needed
export const credibility: CredibilityItem[] = [
  {
    icon: "verified",
    title: "Clinical facility",
    body: "A dedicated medical spa in Nitel, Ikorodu.",
    detailLabel: "Licence",
    detail: TBC,
    standard: "Standard 01",
  },
  {
    icon: "badge",
    title: "Practitioners & staff",
    body: "The people who carry out your treatment.",
    detailLabel: "Credentials",
    detail: TBC,
    standard: "Standard 02",
  },
  {
    icon: "sanitizer",
    title: "Hygiene protocol",
    body: "Sterilisation and hygiene procedures across both locations.",
    detailLabel: "Protocol",
    detail: TBC,
    standard: "Standard 03",
  },
  {
    icon: "book",
    title: "Institute curriculum",
    body: "A structured syllabus for aspiring beauty professionals.",
    detailLabel: "Accreditation",
    detail: TBC,
    standard: "Standard 04",
  },
];

/** Closing band on every page (copy deck, "Global elements"). */
// DRAFT COPY - client approval needed
export const ctaBand = {
  heading: "Come in. Leave in full feather.",
  body: "Book online in a minute, or message us and we'll help you choose.",
  cta: { label: "Book an appointment", href: bookingHref },
  secondaryCta: { label: "Chat on WhatsApp", href: whatsappHref },
} as const;

/* ---------------------------------------------------------------------------
   Footer
--------------------------------------------------------------------------- */

// DRAFT COPY - client approval needed
export const footer: {
  /** The brand line, under the logo. */
  tagline: string;
  place: string;
  /** Hidden while TBC. */
  licence: { label: string; value: OrTBC<string> };
  exploreHeading: string;
  exploreLinks: NavLink[];
  visitHeading: string;
  helpHeading: string;
  helpLinks: NavLink[];
  legalLinks: NavLink[];
  rights: string;
  medicalNote: string;
} = {
  tagline: "Beauty, in good hands.",
  place: "Ikorodu, Lagos.",
  licence: { label: "Licence", value: TBC },
  exploreHeading: "Explore",
  // Journal joins this list once /journal exists.
  exploreLinks: [
    { label: "Hair & Beauty", href: "/salon-spa" },
    { label: "Skin & Aesthetics", href: "/medical-spa" },
    { label: "Academy", href: "/beauty-institute" },
    { label: "Gallery", href: "/gallery" },
  ],
  visitHeading: "Visit",
  helpHeading: "Help",
  helpLinks: [
    { label: "Book an appointment", href: bookingHref },
    { label: "Contact", href: contactHref },
    { label: "Opening hours", href: hoursLink.href },
  ],
  legalLinks: [
    { label: "Licensing & Compliance", href: "/licensing" },
    { label: "Privacy", href: "/privacy" },
  ],
  rights: "All rights reserved.",
  medicalNote:
    "Skin and aesthetic treatments follow a consultation and suitability assessment. Individual results vary.",
};

/* ---------------------------------------------------------------------------
   /medical-spa
   Clinical register: no before/after imagery, result promises, statistics,
   testimonials or prices. Don't strengthen any line here.
--------------------------------------------------------------------------- */

export type ConsultationStep = {
  step: string;
  icon: IconName;
  title: string;
  body: string;
  /** Hidden while the value is TBC. */
  note?: { label: string; value: OrTBC<string> };
};
export type Credential = { icon: IconName; label: string; value: OrTBC<string> };

export const medicalSpa: {
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    cta: NavLink;
    secondaryCta: NavLink;
    image: { alt: string; asset?: ImageAsset };
  };
  intro: {
    body: string;
    /** The licence panel is hidden while the value is TBC. */
    licenceLabel: string;
    licenceValue: OrTBC<string>;
    note: string;
  };
  treatmentsIntro: { eyebrow: string; heading: string; body: string };
  pathway: { eyebrow: string; heading: string; body?: string };
  steps: ConsultationStep[];
  credentialsIntro: { eyebrow: string; heading: string; body: string };
  /** The section is hidden until at least one value is confirmed. */
  credentials: Credential[];
  location: LocationBlockCopy;
} = {
  // DRAFT COPY - client approval needed
  hero: {
    eyebrow: "Skin & Aesthetics · Kikiewa Medical Spa, Nitel, Ikorodu",
    heading: "Every treatment begins with a conversation.",
    body: "The same Kikiewa care, with clinical standards. We assess, explain and plan with you before any treatment begins.",
    cta: {
      label: "Book a consultation",
      href: bookingHref + "?location=nitel&service=consultation",
    },
    secondaryCta: {
      label: "Chat on WhatsApp",
      href: whatsappLink(contact.whatsapp, whatsappMessages.medical),
    },
    image: {
      alt: "Consultation room at Kikiewa, Nitel, Ikorodu",
    },
  },

  // DRAFT COPY - client approval needed
  intro: {
    body: "Choosing a skin treatment is a personal decision. So we do what Kikiewa always does: take our time, tell you the truth, and recommend only what is suitable for you.",
    licenceLabel: "Facility licence",
    licenceValue: TBC,
    note: "Every treatment follows a consultation and suitability assessment. If a treatment isn't right for you, we'll tell you.",
  },

  // DRAFT COPY - client approval needed
  treatmentsIntro: {
    eyebrow: "Skin & Aesthetics",
    heading: "Treatments",
    body: "Prices are a guide. Your final plan and cost are confirmed at consultation.",
  },

  // DRAFT COPY - client approval needed
  pathway: {
    eyebrow: "Consultation first",
    heading: "How it works",
  },

  // DRAFT COPY - client approval needed
  steps: [
    {
      step: "01",
      icon: "calendar",
      title: "Consultation",
      body: "We listen to what you'd like to address and take a short medical history.",
    },
    {
      step: "02",
      icon: "notes",
      title: "Assessment & plan",
      body: "We check suitability, explain your options, costs and what to expect, and agree a plan.",
    },
    {
      step: "03",
      icon: "medical",
      title: "Treatment",
      // Copy deck: "our clinical team" until practitioner roles are confirmed.
      body: "Carried out by our clinical team, at a pace you're comfortable with.",
    },
    {
      step: "04",
      icon: "shield",
      title: "Aftercare",
      body: "Clear written aftercare and a follow-up where your treatment calls for one.",
      note: { label: "Aftercare protocol", value: TBC },
    },
  ],

  // DRAFT COPY - client approval needed
  credentialsIntro: {
    eyebrow: "Licence & safety",
    heading: "Our standards",
    body: "Every treatment follows a consultation and suitability assessment. If a treatment isn't right for you, we'll tell you.",
  },

  credentials: [
    { icon: "verified", label: "Facility licence", value: TBC },
    { icon: "home", label: "Regulatory body", value: TBC },
    { icon: "medical", label: "Medical oversight", value: TBC },
  ],

  // DRAFT COPY - client approval needed
  location: {
    eyebrow: "Nitel location",
    heading: "Visit us in Nitel, Ikorodu",
    mapAlt: "Map showing Kikiewa, Nitel, Ikorodu",
    whatsappLabel: "Chat on WhatsApp",
    whatsappMessage: whatsappMessages.medical,
  },
};

/* ---------------------------------------------------------------------------
   /salon-spa
   Warmer register than /medical-spa, same restraint on facts.
--------------------------------------------------------------------------- */

export type ExpectationPoint = { icon: IconName; title: string; body: string };

export const salonSpa: {
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    cta: NavLink;
    secondaryCta: NavLink;
    image: { alt: string; asset?: ImageAsset };
  };
  /** Large serif paragraph under the hero. */
  intro: string;
  categoriesIntro: { eyebrow: string; heading: string; body: string };
  expectIntro: { eyebrow: string; heading: string; body?: string };
  expectations: ExpectationPoint[];
  gallery: { eyebrow: string; heading: string; items: GallerySlot[] };
  location: LocationBlockCopy;
} = {
  // DRAFT COPY - client approval needed
  hero: {
    eyebrow: "Hair & Beauty · Ebute, Ikorodu",
    heading: "Unhurried care, from the first wash to the final finish.",
    body: "Hair, nails, makeup, massage and spa at Kikiewa in Ebute, Ikorodu. Come in for one service or stay for the afternoon.",
    cta: {
      label: "Book an appointment",
      href: bookingHref + "?location=ebute&service=salon-spa",
    },
    secondaryCta: {
      label: "Chat on WhatsApp",
      href: whatsappLink(contact.whatsapp, whatsappMessages.salon),
    },
    image: {
      alt: "Styling and treatment room at Kikiewa, Ebute, Ikorodu",
    },
  },

  // DRAFT COPY - client approval needed
  intro:
    "Good beauty work takes time. We give it that time: a conversation before we begin, techniques suited to your hair and skin, and a finish you'll want to show off.",

  // DRAFT COPY - client approval needed
  categoriesIntro: {
    eyebrow: "What we offer",
    heading: "Services",
    body: "Choose a category to see durations and starting prices.",
  },

  // DRAFT COPY - client approval needed
  expectIntro: {
    eyebrow: "What to expect",
    heading: "Your visit, step by step",
  },

  // DRAFT COPY - client approval needed
  expectations: [
    {
      icon: "home",
      title: "Arrive and settle.",
      body: "A warm welcome and a few minutes to unwind.",
    },
    {
      icon: "notes",
      title: "Talk it through.",
      body: "We ask what you'd like and check what suits your hair or skin.",
    },
    {
      icon: "scissors",
      title: "Your service.",
      body: "Careful, unhurried work, with no rushing to the next client.",
    },
    {
      icon: "sparkle",
      title: "The finish.",
      body: "A final check together, plus simple tips for caring for it at home.",
    },
  ],

  // DRAFT COPY - client approval needed
  gallery: {
    eyebrow: "Gallery",
    heading: "Recent work",
    items: [
      { alt: "Reception and waiting area at Kikiewa, Ebute, Ikorodu" },
      { alt: "Styling station at Kikiewa, Ebute, Ikorodu" },
      { alt: "Manicure and pedicure area at Kikiewa, Ebute, Ikorodu" },
      { alt: "Treatment room at Kikiewa, Ebute, Ikorodu" },
    ],
  },

  // DRAFT COPY - client approval needed
  location: {
    eyebrow: "Ebute location",
    heading: "Visit us in Ebute, Ikorodu",
    mapAlt: "Map showing Kikiewa, Ebute, Ikorodu",
    whatsappLabel: "Chat on WhatsApp",
    whatsappMessage: whatsappMessages.salon,
  },
};

/* ---------------------------------------------------------------------------
   Other pages. Short, honest pages for routes linked from the navigation.
   Metadata for every page lives in `seo` above.
--------------------------------------------------------------------------- */

export type PageCopy = {
  eyebrow: string;
  heading: string;
  body: string;
};

// DRAFT COPY - client approval needed (all page copy below)
export const locationsPage: PageCopy = {
  eyebrow: "Visit us",
  heading: "Visit us in Ikorodu",
  body: "One Kikiewa, two locations, each set up for its own kind of care.",
};

// DRAFT COPY - client approval needed
export const pages = {
  salonServices: {
    eyebrow: "Hair & Beauty · Ebute",
    heading: "Services",
    body: "Choose a category to see durations and starting prices.",
  },
  treatments: {
    eyebrow: "Skin & Aesthetics · Nitel",
    heading: "Treatments",
    body: "Prices are a guide. Your final plan and cost are confirmed at consultation.",
  },
  concerns: {
    eyebrow: "Skin & Aesthetics · Nitel",
    heading: "What would you like to address?",
    body: "Start with your concern. We'll recommend the right approach at your consultation.",
  },
  consultation: {
    eyebrow: "Skin & Aesthetics · Nitel",
    heading: "Your consultation",
    body: "We discuss your concerns and medical history, assess your skin, and explain suitable options, costs and aftercare. There's no obligation to go ahead.",
  },
  institute: {
    eyebrow: "Kikiewa Beauty Institute · Ikorodu",
    heading: "Learn the craft where it's practised.",
    body: "Practical training at the Kikiewa Beauty Institute, from the people whose work you see in our salon, spa and clinic every day.",
  },
  courses: {
    eyebrow: "Academy",
    heading: "Courses",
    body: "Compare courses at a glance. Every detail is confirmed at enrolment.",
  },
  admissions: {
    eyebrow: "Academy",
    heading: "How to apply",
    body: "Choose a course and check the next intake date, then book a visit or call to ask questions and see where you'll train.",
  },
  gallery: {
    eyebrow: "Gallery",
    heading: "Made to be seen",
    body: "Recent work, our spaces, and the moments in between.",
  },
  book: {
    eyebrow: "Appointments",
    heading: "Book an appointment",
    body: "Choose a service and your preferred time. We'll confirm on WhatsApp.",
  },
  contact: {
    eyebrow: "Contact",
    heading: "Contact us",
    body: "The quickest way to reach us is WhatsApp. We reply during opening hours.",
  },
  licensing: {
    eyebrow: "Licensing & Compliance",
    heading: "Licensing & Compliance",
    body: "Kikiewa publishes licence and registration details only once they are verified.",
  },
  privacy: {
    eyebrow: "Privacy",
    heading: "Privacy Policy",
    body: "How we collect, use and protect your personal information.",
  },
} satisfies Record<string, PageCopy>;

/** /beauty-institute: large serif paragraph under the hero. */
// DRAFT COPY - client approval needed
export const instituteIntro =
  "Great beauty professionals are made with practice, patience and good teaching. Our courses combine all three, with time on real techniques and clear standards for every skill you learn.";

/** /institute and /admissions actions (copy deck CTA library). */
// DRAFT COPY - client approval needed
export const instituteActions = {
  viewCourses: { label: "View courses", href: "/beauty-institute/courses" },
  bookVisit: { label: "Book a visit", href: "/beauty-institute/admissions" },
  whatsappLabel: "Chat on WhatsApp",
  whatsappMessage: whatsappMessages.institute,
} as const;

/** Sections of /gallery (copy deck filters: Hair & Beauty · Skin & Aesthetics · Academy). */
// DRAFT COPY - client approval needed
export const gallerySections: { division: DivisionSlug; title: string }[] = [
  { division: "salon-spa", title: "Hair & Beauty" },
  { division: "medical-spa", title: "Skin & Aesthetics" },
  { division: "institute", title: "Academy" },
];

// DRAFT COPY - client approval needed
export const galleryEmpty =
  "New photographs are on the way. Follow us on Instagram for the latest.";

/** Routes to the booking paths shown on /book. */
// DRAFT COPY - client approval needed
export const bookingPaths: {
  title: string;
  body: string;
  location: LocationId | null;
  whatsappMessage: string;
  cta: string;
}[] = [
  {
    title: "Hair, nails, makeup or spa",
    body: "Tell us what you'd like and when, and we'll confirm on WhatsApp.",
    location: "ebute",
    whatsappMessage: whatsappMessages.salon,
    cta: "Chat on WhatsApp",
  },
  {
    title: "Skin or aesthetic treatment",
    body: "Every skin and aesthetic treatment begins with a consultation.",
    location: "nitel",
    whatsappMessage: whatsappMessages.medical,
    cta: "Book a consultation",
  },
  {
    title: "Academy",
    body: "Ask about a course, the next intake or a visit to see where you'll train.",
    location: null,
    whatsappMessage: whatsappMessages.institute,
    cta: "Book a visit",
  },
];
