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
 * Alt text pattern: "{what is shown} at Kikiewa {division}, {location}, Ikorodu".
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
  salon: "Hello Kikiewa, I'd like to book an appointment at Salon & Spa, Ebute.",
  medical: "Hello Kikiewa Medical Spa, I'd like to book a consultation.",
  institute:
    "Hello Kikiewa Beauty Institute, I'd like to know more about your courses and the next intake.",
} as const;

/** Pre-filled WhatsApp message for the header and mobile action bar. */
export const whatsappGreeting = whatsappMessages.general;

/** WhatsApp link with the general greeting (falls back to /contact while TBC). */
export const whatsappHref = whatsappLink(contact.whatsapp, whatsappGreeting);

// DRAFT COPY - client approval needed
export const primaryNav: NavItem[] = [
  {
    label: "Salon & Spa",
    href: "/salon-spa",
    children: [
      { label: "Services", href: "/salon-spa/services" },
      { label: "Gallery", href: "/gallery#salon-spa" },
      { label: "Ebute location", href: "/locations/ebute" },
    ],
  },
  {
    label: "Medical Spa",
    href: "/medical-spa",
    children: [
      { label: "Treatments", href: "/medical-spa/treatments" },
      { label: "Concerns", href: "/medical-spa/concerns" },
      { label: "Your consultation", href: "/medical-spa/consultation" },
      { label: "Nitel location", href: "/locations/nitel" },
    ],
  },
  {
    label: "Beauty Institute",
    href: "/beauty-institute",
    children: [
      { label: "Courses", href: "/beauty-institute/courses" },
      { label: "Admissions", href: "/beauty-institute/admissions" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Locations", href: "/locations" },
];

export const hoursLink: NavLink = { label: "Opening hours", href: "/locations" };

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
      "Salon & Spa in Ebute, a consultation-led Medical Spa in Nitel and a Beauty Institute, all in Ikorodu, Lagos. Book online or on WhatsApp.",
  },
  salonSpa: {
    path: "/salon-spa",
    title: "Salon & Spa in Ikorodu, Lagos | Kikiewa",
    description:
      "Hair, nails, massage and spa rituals at Kikiewa Salon & Spa, Ebute, Ikorodu. See services and prices, then book online or on WhatsApp.",
  },
  salonServices: {
    path: "/salon-spa/services",
    title: "Salon & Spa Services in Ikorodu | Kikiewa",
    description:
      "The service menu at Kikiewa Salon & Spa, Ebute, Ikorodu: hair, nails, massage and spa. See durations and starting prices, then book on WhatsApp.",
  },
  medicalSpa: {
    path: "/medical-spa",
    title: "Medical Spa in Ikorodu, Lagos | Kikiewa",
    description:
      "Consultation-led skin and aesthetic treatments at Kikiewa Medical Spa, Nitel, Ikorodu. Book a consultation online or on WhatsApp.",
  },
  treatments: {
    path: "/medical-spa/treatments",
    title: "Medical Spa Treatments in Ikorodu | Kikiewa",
    description:
      "Skin and aesthetic treatments at Kikiewa Medical Spa, Nitel, Ikorodu. Every treatment starts with a consultation to assess suitability.",
  },
  concerns: {
    path: "/medical-spa/concerns",
    title: "Skin Concerns | Kikiewa Medical Spa, Ikorodu",
    description:
      "Start with your concern. Book a consultation at Kikiewa Medical Spa in Nitel, Ikorodu, to find the approach that suits your skin.",
  },
  consultation: {
    path: "/medical-spa/consultation",
    title: "Your Consultation | Kikiewa Medical Spa, Ikorodu",
    description:
      "What happens at a consultation at Kikiewa Medical Spa, Nitel, Ikorodu: your concerns, medical history, suitable options, costs and aftercare.",
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
      "Compare beauty courses at the Kikiewa Beauty Institute, Ikorodu: level, entry requirements, duration, fees and next intake.",
  },
  admissions: {
    path: "/beauty-institute/admissions",
    title: "Admissions | Kikiewa Beauty Institute, Ikorodu",
    description:
      "How to apply to the Kikiewa Beauty Institute in Ikorodu, Lagos: choose a course, book a visit, then apply and enrol.",
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
      "Licence and registration details for Kikiewa in Ikorodu, Lagos, published here once verified.",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy | Kikiewa",
    description: "How Kikiewa collects, uses and protects your personal information.",
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
  /** Division and area, e.g. "Salon & Spa, Ebute". */
  shortName: string;
  /** What happens at this location, e.g. "Salon & Spa". */
  services: string;
  badge: string;
  icon: IconName;
  title: string;
  body: string;
  address: OrTBC<string>;
  hours: OrTBC<string>;
  phone: OrTBC<string>;
  phoneLabel: string;
  primaryCta: NavLink;
  href: string;
};

// DRAFT COPY - client approval needed
export const locationsIntro: { eyebrow: string; heading: string; body?: string } = {
  eyebrow: "Locations",
  heading: "Two locations in Ikorodu",
};

// DRAFT COPY - client approval needed
export const ebuteLocation: Location = {
  id: "ebute",
  name: "Ebute",
  area: "Ebute, Ikorodu",
  shortName: "Salon & Spa, Ebute",
  services: "Salon & Spa",
  badge: "Hair · Nails · Massage · Spa",
  icon: "pin",
  title: "Salon & Spa in Ebute, Ikorodu",
  body: "Our Ebute location is home to the Kikiewa Salon & Spa: hair, nails, massage and spa rituals, delivered without rushing.",
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
  shortName: "Medical Spa, Nitel",
  services: "Medical Spa & Makeover",
  badge: "Consultation-led skin care",
  icon: "hospital",
  title: "Medical Spa in Nitel, Ikorodu",
  body: "Our Nitel location is home to the Kikiewa Medical Spa & Makeover, where every treatment begins with a consultation.",
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
    slug: "massage-body",
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
    category: "massage-body",
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

// DRAFT COPY - client approval needed
export const hero: {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: NavLink;
  secondaryCta: NavLink;
  image: { caption: string; body: string; alt: string; asset?: ImageAsset };
  /** Hidden while the body is TBC. */
  badge: { title: string; body: OrTBC<string> };
} = {
  eyebrow: "Salon & Spa · Medical Spa · Beauty Institute",
  heading: "Three houses of care. One standard.",
  body: "A salon and spa in Ebute, a medical spa in Nitel, and an institute training the next generation, all in Ikorodu, Lagos.",
  primaryCta: { label: "Book an appointment", href: bookingHref },
  secondaryCta: { label: "Chat on WhatsApp", href: whatsappHref },
  image: {
    caption: "The Kikiewa experience",
    body: "Time set aside, just for you.",
    alt: "Treatment room at Kikiewa Salon & Spa, Ebute, Ikorodu",
  },
  badge: {
    title: "Licensed premises",
    body: TBC,
  },
};

export type Division = {
  index: string;
  icon: IconName;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  imageAlt: string;
  image?: ImageAsset;
};

// DRAFT COPY - client approval needed
export const divisionsIntro: { eyebrow: string; heading: string; body?: string } = {
  eyebrow: "Three divisions",
  heading: "Choose your Kikiewa",
};

/** `index` is the card name (on the image), `title` the card heading. */
// DRAFT COPY - client approval needed
export const divisions: Division[] = [
  {
    index: "Salon & Spa",
    icon: "spa",
    eyebrow: "Ebute",
    title: "Unhurried beauty, beautifully finished",
    body: "Hair, nails, massage and spa rituals in a space designed for you to slow down.",
    cta: "Explore Salon & Spa",
    href: "/salon-spa",
    imageAlt: "Styling station at Kikiewa Salon & Spa, Ebute, Ikorodu",
  },
  {
    index: "Medical Spa",
    icon: "medical",
    eyebrow: "Nitel",
    title: "Clinical care, gently delivered",
    body: "Consultation-led skin and aesthetic treatments, planned around you and explained at every step.",
    cta: "Explore the Medical Spa",
    href: "/medical-spa",
    imageAlt: "Treatment room at Kikiewa Medical Spa, Nitel, Ikorodu",
  },
  {
    index: "Beauty Institute",
    icon: "school",
    eyebrow: "Training",
    title: "Learn the craft where it's practised",
    body: "Practical beauty training shaped by a working salon, spa and clinic.",
    cta: "Explore the Institute",
    href: "/beauty-institute",
    imageAlt: "Training room at Kikiewa Beauty Institute, Ikorodu",
  },
];

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

// DRAFT COPY - client approval needed
export const enrolment: {
  flagLabel: string;
  /** Hidden while TBC. */
  flag: OrTBC<string>;
  heading: string;
  body: string;
  primaryCta: NavLink;
  secondaryCta: NavLink;
  programmesTitle: string;
} = {
  flagLabel: "Next intake",
  flag: TBC,
  heading: "Your pathway",
  body: "Learn the foundations, build skills to a professional standard, then specialise, refresh your skills or move into new techniques.",
  primaryCta: { label: "View courses", href: "/beauty-institute/courses" },
  secondaryCta: { label: "Book a visit", href: "/beauty-institute/admissions" },
  programmesTitle: "Courses",
};

// DRAFT COPY - client approval needed
export const ctaBand = {
  eyebrow: "Appointments",
  heading: "Your appointment, at your pace.",
  body: "Book online in a few steps, or message us and we'll help you choose.",
  cta: { label: "Book an appointment", href: bookingHref },
  secondaryCta: { label: "Chat on WhatsApp", href: whatsappHref },
} as const;

/* ---------------------------------------------------------------------------
   Footer
--------------------------------------------------------------------------- */

// DRAFT COPY - client approval needed
export const footer: {
  blurb: string;
  /** Hidden while TBC. */
  licence: { label: string; value: OrTBC<string> };
  exploreHeading: string;
  divisionLinks: NavLink[];
  visitHeading: string;
  helpHeading: string;
  helpLinks: NavLink[];
  legalLinks: NavLink[];
  rights: string;
  medicalNote: string;
} = {
  blurb:
    "Care, considered. Salon & Spa, Medical Spa & Makeover, and Beauty Institute, Ikorodu, Lagos.",
  licence: { label: "Licence", value: TBC },
  exploreHeading: "Explore",
  divisionLinks: [
    { label: "Salon & Spa", href: "/salon-spa" },
    { label: "Medical Spa", href: "/medical-spa" },
    { label: "Beauty Institute", href: "/beauty-institute" },
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
    "Medical treatments are provided following consultation and assessment of suitability. Individual results vary.",
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
    eyebrow: "Medical Spa & Makeover · Nitel",
    heading: "Every treatment begins with a conversation.",
    body: "Consultation-led skin and aesthetic care in Nitel, Ikorodu. We assess, explain and plan with you before any treatment begins.",
    cta: {
      label: "Book a consultation",
      href: bookingHref + "?location=nitel&service=consultation",
    },
    secondaryCta: {
      label: "Chat on WhatsApp",
      href: whatsappLink(contact.whatsapp, whatsappMessages.medical),
    },
    image: {
      alt: "Consultation room at Kikiewa Medical Spa, Nitel, Ikorodu",
    },
  },

  // DRAFT COPY - client approval needed
  intro: {
    body: "Choosing a treatment is a personal decision. We take time to understand your concerns, your skin and your expectations, then recommend only what is suitable for you.",
    licenceLabel: "Facility licence",
    licenceValue: TBC,
    note: "Every treatment follows a consultation and suitability assessment. If a treatment isn't right for you, we'll tell you.",
  },

  // DRAFT COPY - client approval needed
  treatmentsIntro: {
    eyebrow: "Medical Spa & Makeover",
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
    mapAlt: "Map showing Kikiewa Medical Spa, Nitel, Ikorodu",
    whatsappLabel: "Chat on WhatsApp",
    whatsappMessage: whatsappMessages.medical,
  },
};

/* ---------------------------------------------------------------------------
   /salon-spa
   Warmer register than /medical-spa, same restraint on facts.
--------------------------------------------------------------------------- */

export type ExpectationPoint = { icon: IconName; title: string; body: string };
/** A gallery position with its alt text, waiting for a photograph. */
export type GallerySlot = { alt: string; image?: ImageAsset };

export const salonSpa: {
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    cta: NavLink;
    secondaryCta: NavLink;
    image: { alt: string; asset?: ImageAsset };
  };
  categoriesIntro: { eyebrow: string; heading: string; body: string };
  expectIntro: { eyebrow: string; heading: string; body?: string };
  expectations: ExpectationPoint[];
  gallery: { eyebrow: string; heading: string; items: GallerySlot[] };
  location: LocationBlockCopy;
} = {
  // DRAFT COPY - client approval needed
  hero: {
    eyebrow: "Salon & Spa · Ebute",
    heading: "Unhurried care, from the first wash to the final finish.",
    body: "Hair, nails, massage and spa rituals in Ebute, Ikorodu. Come in for one service or stay for the afternoon.",
    cta: {
      label: "Book an appointment",
      href: bookingHref + "?location=ebute&service=salon-spa",
    },
    secondaryCta: {
      label: "Chat on WhatsApp",
      href: whatsappLink(contact.whatsapp, whatsappMessages.salon),
    },
    image: {
      alt: "Styling and treatment room at Kikiewa Salon & Spa, Ebute, Ikorodu",
    },
  },

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
      { alt: "Reception and waiting area at Kikiewa Salon & Spa, Ebute, Ikorodu" },
      { alt: "Styling station at Kikiewa Salon & Spa, Ebute, Ikorodu" },
      { alt: "Manicure and pedicure area at Kikiewa Salon & Spa, Ebute, Ikorodu" },
      { alt: "Treatment room at Kikiewa Salon & Spa, Ebute, Ikorodu" },
    ],
  },

  // DRAFT COPY - client approval needed
  location: {
    eyebrow: "Ebute location",
    heading: "Visit us in Ebute, Ikorodu",
    mapAlt: "Map showing Kikiewa Salon & Spa, Ebute, Ikorodu",
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
  eyebrow: "Locations",
  heading: "Our locations",
  body: "Two locations in Ikorodu, Lagos, each focused on what it does best.",
};

// DRAFT COPY - client approval needed
export const pages = {
  salonServices: {
    eyebrow: "Salon & Spa · Ebute",
    heading: "Services",
    body: "Choose a category to see durations and starting prices.",
  },
  treatments: {
    eyebrow: "Medical Spa · Nitel",
    heading: "Treatments",
    body: "Prices are a guide. Your final plan and cost are confirmed at consultation.",
  },
  concerns: {
    eyebrow: "Medical Spa · Nitel",
    heading: "What would you like to address?",
    body: "Start with your concern. We'll recommend the right approach at your consultation.",
  },
  consultation: {
    eyebrow: "Medical Spa · Nitel",
    heading: "Your consultation",
    body: "We discuss your concerns and medical history, assess your skin, and explain suitable options, costs and aftercare. There's no obligation to go ahead.",
  },
  institute: {
    eyebrow: "Kikiewa Beauty Institute · Ikorodu",
    heading: "Learn the craft where it's practised.",
    body: "Practical beauty training from people who do this work every day.",
  },
  courses: {
    eyebrow: "Beauty Institute",
    heading: "Courses",
    body: "Compare courses at a glance. Every detail is confirmed at enrolment.",
  },
  admissions: {
    eyebrow: "Beauty Institute",
    heading: "How to apply",
    body: "Choose a course and check the next intake date, then book a visit or call to ask questions and see where you'll train.",
  },
  gallery: {
    eyebrow: "Gallery",
    heading: "Inside Kikiewa",
    body: "Our spaces, our work and the moments in between.",
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

/** /institute and /admissions actions (copy deck CTA library). */
// DRAFT COPY - client approval needed
export const instituteActions = {
  viewCourses: { label: "View courses", href: "/beauty-institute/courses" },
  bookVisit: { label: "Book a visit", href: "/beauty-institute/admissions" },
  whatsappLabel: "Chat on WhatsApp",
  whatsappMessage: whatsappMessages.institute,
} as const;

/** Sections of /gallery. */
// DRAFT COPY - client approval needed
export const gallerySections: { division: DivisionSlug; title: string }[] = [
  { division: "salon-spa", title: "Salon & Spa" },
  { division: "medical-spa", title: "Medical Spa" },
  { division: "institute", title: "Institute" },
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
    title: "Salon & Spa, Ebute",
    body: "Hair, nails, massage and spa.",
    location: "ebute",
    whatsappMessage: whatsappMessages.salon,
    cta: "Chat on WhatsApp",
  },
  {
    title: "Medical Spa, Nitel",
    body: "Consultation-led skin and aesthetic care. Medical treatments begin with a consultation.",
    location: "nitel",
    whatsappMessage: whatsappMessages.medical,
    cta: "Book a consultation",
  },
  {
    title: "Beauty Institute",
    body: "Ask about a course, the next intake or a visit to see where you'll train.",
    location: null,
    whatsappMessage: whatsappMessages.institute,
    cta: "Book a visit",
  },
];
