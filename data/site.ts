import type { IconName } from "@/components/Icon";

/**
 * Single source of content for the site. Every page reads from here.
 *
 * Content rules (reference/design-tokens.md):
 * - No invented credentials, statistics, prices, durations, treatment claims
 *   or testimonials. Anything unconfirmed is the literal `TBC`, which renders
 *   as a small muted "To be confirmed" label (components/Confirmable.tsx).
 *   Never print a TBC value directly.
 * - Marketing copy written before client sign-off is marked
 *   `// DRAFT COPY - client approval needed`.
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
  | "ageing"
  | "texture";

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

/** Placeholders only until the client supplies names and verified roles. */
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
  tagline: "Aesthetics • Lagos",
  city: "Lagos, Nigeria",
  copyrightYear: 2025,
} as const;

/** Business-wide contact details. Branch details live on each location. */
export const contact: {
  whatsapp: OrTBC<string>;
  /** Main line for the mobile Call action. Falls back to /contact while TBC. */
  phone: OrTBC<string>;
  email: OrTBC<string>;
} = {
  whatsapp: TBC,
  phone: TBC,
  email: TBC,
};

export const bookingHref = "/book";
export const contactHref = "/contact";

/** Pre-filled WhatsApp message for the header and mobile action bar. */
// DRAFT COPY - client approval needed
export const whatsappGreeting =
  "Hello Kikiewa, I'd like some help booking an appointment.";

export const primaryNav: NavItem[] = [
  {
    label: "Salon & Spa",
    href: "/salon-spa",
    children: [
      { label: "Services", href: "/salon-spa/services" },
      { label: "Gallery", href: "/gallery#salon-spa" },
    ],
  },
  {
    label: "Medical Spa",
    href: "/medical-spa",
    children: [
      { label: "Treatments", href: "/medical-spa/treatments" },
      { label: "Concerns", href: "/medical-spa/concerns" },
      { label: "Consultation", href: "/medical-spa/consultation" },
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
   Locations
--------------------------------------------------------------------------- */

export type LocationId = "ebute" | "nitel";

export type Location = {
  id: LocationId;
  /** Area name, e.g. "Ebute". */
  name: string;
  /** What happens at this branch, e.g. "Salon & Spa". */
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

export const locationsIntro = {
  eyebrow: "Physical Enclaves",
  heading: "Choose Your Location",
  // DRAFT COPY - client approval needed
  body: "Two spaces across Lagos dedicated to your aesthetic journey.",
} as const;

export const ebuteLocation: Location = {
  id: "ebute",
  name: "Ebute",
  services: "Salon & Spa",
  badge: "Salon • Spa Suites",
  icon: "pin",
  title: "Ebute Branch — Salon & Spa",
  // DRAFT COPY - client approval needed
  body: "A restorative space for hair rituals and quiet body treatments, away from the pace of the city.",
  address: TBC,
  hours: TBC,
  phone: TBC,
  phoneLabel: "Contact & Concierge",
  primaryCta: { label: "Book at Ebute", href: bookingHref + "?location=ebute" },
  href: "/locations/ebute",
};

/** The clinical practice. Read by the home page and by /medical-spa. */
export const nitelLocation: Location = {
  id: "nitel",
  name: "Nitel",
  services: "Medical Spa & Makeover",
  badge: "Clinical Spa • Institute",
  icon: "hospital",
  title: "Nitel Branch — Medical Spa & Makeover",
  // DRAFT COPY - client approval needed
  body: "Consultations, skin treatments, makeovers and the institute's teaching rooms.",
  address: TBC,
  hours: TBC,
  phone: TBC,
  phoneLabel: "Direct Desk",
  primaryCta: {
    label: "Book a consultation",
    href: bookingHref + "?location=nitel",
  },
  href: "/locations/nitel",
};

export const locations: Location[] = [ebuteLocation, nitelLocation];

export type LocationBlockCopy = {
  eyebrow: string;
  heading: string;
  body: string;
  mapAlt: string;
  whatsappLabel: string;
  whatsappMessage: string;
  /** Shown while the WhatsApp number is TBC, after "WhatsApp number: To be confirmed." */
  fallbackNote: string;
};

/* ---------------------------------------------------------------------------
   Services, concerns, courses, team, gallery
--------------------------------------------------------------------------- */

/** Category names group the menus. Service lists are TBC with the client. */
export const serviceCategories: ServiceCategory[] = [
  // Salon & Spa (Ebute)
  { slug: "hair", division: "salon-spa", name: "Hair", icon: "scissors", summary: TBC },
  { slug: "nails", division: "salon-spa", name: "Nails", icon: "hand", summary: TBC },
  { slug: "skin-facials", division: "salon-spa", name: "Skin & Facials", icon: "face", summary: TBC },
  { slug: "massage-spa", division: "salon-spa", name: "Massage & Spa", icon: "spa", summary: TBC },
  { slug: "grooming", division: "salon-spa", name: "Grooming", icon: "brush", summary: TBC },
  { slug: "bridal-event", division: "salon-spa", name: "Bridal & Event Styling", icon: "sparkle", summary: TBC },
  // Medical Spa & Makeover (Nitel)
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
    slug: "signature-facial",
    division: "salon-spa",
    category: "skin-facials",
    name: "Signature Facial",
    summary: "A cleansing, calming facial suited to your skin on the day.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: false,
  },
  {
    slug: "massage",
    division: "salon-spa",
    category: "massage-spa",
    name: "Massage",
    summary: "Time to unwind, with pressure and focus agreed with you first.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: false,
  },
  {
    slug: "grooming",
    division: "salon-spa",
    category: "grooming",
    name: "Grooming",
    summary: "Tidy, considered grooming for a clean finish.",
    durationMins: TBC,
    priceFrom: TBC,
    currency: "NGN",
    requiresConsultation: false,
  },
  {
    slug: "bridal-styling",
    division: "salon-spa",
    category: "bridal-event",
    name: "Bridal & Event Styling",
    summary: "Hair and styling for your day, planned with you in advance.",
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
    concerns: ["pigmentation", "acne-scarring", "ageing", "texture"],
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
 * Concern list for the medical spa. Which concerns may be advertised, and
 * which treatments address them, needs client approval.
 */
// DRAFT COPY - client approval needed
export const concerns: Concern[] = [
  {
    slug: "pigmentation",
    name: "Pigmentation & uneven tone",
    summary: "Dark patches and uneven tone. What may help is decided at consultation.",
  },
  {
    slug: "acne-scarring",
    name: "Acne & scarring",
    summary: "Active breakouts and the marks they leave. Assessed in person before any plan.",
  },
  {
    slug: "ageing",
    name: "Signs of ageing",
    summary: "Fine lines and changes in firmness. Options are discussed honestly at consultation.",
  },
  {
    slug: "texture",
    name: "Skin texture",
    summary: "Roughness, enlarged pores and dullness. Suitability is assessed in person.",
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

/** Placeholders only. Not rendered until the client supplies real people. */
export const team: TeamMember[] = [
  { name: TBC, role: "Salon & Spa team", division: "salon-spa", bio: TBC },
  { name: TBC, role: "Medical Spa practitioner", division: "medical-spa", bio: TBC },
  { name: TBC, role: "Institute tutor", division: "institute", bio: TBC },
];

/**
 * Gallery photographs. Empty until photography is supplied. No client faces
 * or before/after images without written consent (public/images/README.md).
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
  stats: { value: string; label: OrTBC<string> }[];
  image: { caption: string; body: string; alt: string; asset?: ImageAsset };
  badge: { title: string; body: OrTBC<string> };
} = {
  eyebrow: "Clinical Rigour • Restorative Wellness",
  heading:
    "Elevated beauty, clinical precision, and transformative aesthetic wellness in Lagos.",
  body: "A multidisciplinary sanctuary uniting bespoke salon rituals, medical spa treatments, and professional aesthetic education.",
  primaryCta: { label: "Book an appointment", href: bookingHref },
  secondaryCta: { label: "Explore services", href: "#divisions" },
  stats: [
    { value: "02 Locations", label: "Ebute and Nitel" },
    { value: "Clinical Protocol", label: TBC },
    { value: "Curriculum", label: TBC },
  ],
  image: {
    caption: "Sanctuary Architecture",
    body: "Ebute & Nitel • Quiet, considered rooms for unhurried care.",
    alt: "Editorial architectural photograph of the Kikiewa aesthetics sanctuary in Lagos",
  },
  badge: {
    title: "Clinical Premises",
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
export const divisionsIntro = {
  eyebrow: "Pillars of Practice",
  heading: "Three Multidisciplinary Divisions",
  body: "Personal care, clinical skin treatments and vocational training, each in its own dedicated space.",
} as const;

// DRAFT COPY - client approval needed
export const divisions: Division[] = [
  {
    index: "Division 01",
    icon: "spa",
    eyebrow: "Rituals • Restorative Care",
    title: "Salon & Spa",
    body: "Curated hair styling, wellness rituals, and restorative therapies crafted for calm.",
    cta: "Explore Salon & Spa",
    href: "/salon-spa",
    imageAlt:
      "Restorative scalp ritual and botanical hair conditioning at the Kikiewa salon",
  },
  {
    index: "Division 02",
    icon: "medical",
    eyebrow: "Consultation • Skin Care",
    title: "Medical Spa & Makeover",
    body: "Skin treatments, facial aesthetics and makeovers, each beginning with a consultation.",
    cta: "Explore Medical Spa",
    href: "/medical-spa",
    imageAlt: "Minimalist clinical treatment room with soft amber lighting",
  },
  {
    index: "Division 03",
    icon: "school",
    eyebrow: "Training • Practice",
    title: "Beauty Institute",
    body: "Courses for the next generation of beauty and aesthetics practitioners.",
    cta: "View Courses",
    href: "/beauty-institute",
    imageAlt: "Professional beauty and skin care training studio",
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
  eyebrow: "Assurance & Governance",
  heading: "Institutional Rigor and Standards",
} as const;

// DRAFT COPY - client approval needed
export const credibility: CredibilityItem[] = [
  {
    icon: "verified",
    title: "Clinical Facility",
    body: "A dedicated aesthetics practice in Lagos.",
    detailLabel: "Licence",
    detail: TBC,
    standard: "Standard 01",
  },
  {
    icon: "badge",
    title: "Practitioners & Staff",
    body: "The people who carry out your treatment.",
    detailLabel: "Credentials",
    detail: TBC,
    standard: "Standard 02",
  },
  {
    icon: "sanitizer",
    title: "Hygiene Protocol",
    body: "Sterilisation and hygiene procedures across both practices.",
    detailLabel: "Protocol",
    detail: TBC,
    standard: "Standard 03",
  },
  {
    icon: "book",
    title: "Institute Curriculum",
    body: "A structured syllabus for aspiring practitioners.",
    detailLabel: "Accreditation",
    detail: TBC,
    standard: "Standard 04",
  },
];

// DRAFT COPY - client approval needed
export const enrolment: {
  flagLabel: string;
  flag: OrTBC<string>;
  heading: string;
  body: string;
  primaryCta: NavLink;
  secondaryCta: NavLink;
  programmesTitle: string;
} = {
  flagLabel: "Next intake",
  flag: TBC,
  heading: "Shape the Future of Aesthetic Excellence",
  body: "Courses in skin and beauty, makeup artistry and spa therapy, taught where the work is practised.",
  primaryCta: { label: "Admissions", href: "/beauty-institute/admissions" },
  secondaryCta: { label: "View courses", href: "/beauty-institute/courses" },
  programmesTitle: "Courses",
};

// DRAFT COPY - client approval needed
export const ctaBand = {
  eyebrow: "Personalised Appointments",
  heading: "Experience Kikiewa in Person",
  body: "Reserve your consultation or ritual with our specialists.",
  cta: { label: "Book an appointment", href: bookingHref },
} as const;

/* ---------------------------------------------------------------------------
   Footer
--------------------------------------------------------------------------- */

// DRAFT COPY - client approval needed
export const footer: {
  blurb: string;
  licence: { label: string; value: OrTBC<string> };
  divisionLinks: NavLink[];
  inquiriesLabel: string;
  legalLinks: NavLink[];
} = {
  blurb:
    "Aesthetics, restorative wellness and beauty education, rooted in Lagos, Nigeria.",
  licence: { label: "Licence", value: TBC },
  divisionLinks: [
    { label: "Salon & Spa", href: "/salon-spa" },
    { label: "Medical Spa & Makeover", href: "/medical-spa" },
    { label: "Beauty Institute", href: "/beauty-institute" },
    { label: "Consultation", href: "/medical-spa/consultation" },
  ],
  inquiriesLabel: "Concierge & Appointments",
  legalLinks: [
    { label: "Contact", href: contactHref },
    { label: "Licensing & Compliance", href: "/licensing" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

/* ---------------------------------------------------------------------------
   /medical-spa
   Clinical register: no before/after imagery, result promises, statistics,
   testimonials or prices. Anything that would be a claim about scope of
   practice, outcome or credentials stays TBC.
--------------------------------------------------------------------------- */

export type ConsultationStep = {
  step: string;
  icon: IconName;
  title: string;
  body: string;
  note?: { label: string; value: OrTBC<string> };
};
export type Credential = { icon: IconName; label: string; value: OrTBC<string> };

export const medicalSpa: {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    cta: NavLink;
    image: { alt: string; asset?: ImageAsset };
  };
  intro: { body: string; licenceLabel: string; licenceValue: OrTBC<string>; note: string };
  treatmentsIntro: { eyebrow: string; heading: string; body: string };
  pathway: { eyebrow: string; heading: string; body: string };
  steps: ConsultationStep[];
  credentialsIntro: { eyebrow: string; heading: string; body: string };
  credentials: Credential[];
  location: LocationBlockCopy;
} = {
  // DRAFT COPY - client approval needed
  meta: {
    title: "Medical Spa & Makeover",
    description:
      "Medical spa and makeover services at the Kikiewa Nitel practice in Lagos. Every treatment begins with a consultation.",
  },

  // DRAFT COPY - client approval needed
  hero: {
    eyebrow: "Division 02 • Medical Spa & Makeover",
    heading: "Every treatment begins with a conversation.",
    body: "Skin, facial and makeover services at our Nitel practice. Every plan begins with a consultation rather than a recommendation.",
    cta: {
      label: "Book a consultation",
      href: bookingHref + "?location=nitel&service=consultation",
    },
    image: {
      alt: "Consultation room at the Kikiewa Nitel medical spa practice in Lagos",
    },
  },

  // DRAFT COPY - client approval needed
  intro: {
    body: "The medical spa shares the Nitel premises with our makeover studio. Services are delivered under clinical protocol, within a scope of practice we will publish here in full once it is confirmed. What is appropriate for you is decided in consultation, not in advance.",
    licenceLabel: "Licensing",
    licenceValue: TBC,
    note: "This page makes no claim about scope of practice, suitability or outcome until licence and practitioner records are verified.",
  },

  // DRAFT COPY - client approval needed
  treatmentsIntro: {
    eyebrow: "Scope of Service",
    heading: "Treatment Areas",
    body: "Six areas of practice at the Nitel premises. Specifics, suitability and sequencing are set out at consultation.",
  },

  // DRAFT COPY - client approval needed
  pathway: {
    eyebrow: "How Treatment Begins",
    heading: "Consultation First",
    body: "Nothing is administered on a first visit. The sequence below applies to every medical spa service.",
  },

  // DRAFT COPY - client approval needed
  steps: [
    {
      step: "01",
      icon: "calendar",
      title: "Consultation",
      body: "An assessment of your history, medication and what you are asking for. Nothing is booked or administered at this stage.",
    },
    {
      step: "02",
      icon: "notes",
      title: "Personalised plan",
      body: "A written plan setting out what is suitable, what is not, and what each step involves. You take it away before deciding.",
    },
    {
      step: "03",
      icon: "shield",
      title: "Treatment and aftercare",
      body: "Treatment at the Nitel practice, followed by written aftercare and a review appointment.",
      note: { label: "Aftercare protocol", value: TBC },
    },
  ],

  // DRAFT COPY - client approval needed
  credentialsIntro: {
    eyebrow: "Licence & Credentials",
    heading: "What We Will Publish Here",
    body: "Kikiewa lists credentials only once they are verified. Each record below stays unconfirmed until then, and documentation can be requested at your consultation.",
  },

  credentials: [
    { icon: "verified", label: "Practitioner licensing", value: TBC },
    { icon: "badge", label: "Practitioner credentials", value: TBC },
    { icon: "home", label: "Facility registration", value: TBC },
    { icon: "medical", label: "Clinical supervision", value: TBC },
    { icon: "sanitizer", label: "Hygiene and sterilisation", value: TBC },
  ],

  // DRAFT COPY - client approval needed
  location: {
    eyebrow: "The Practice",
    heading: "Where Treatment Takes Place",
    body: "Medical spa and makeover services are delivered at the Nitel practice only.",
    mapAlt: "Map showing the Kikiewa Nitel practice in Lagos",
    whatsappLabel: "Enquire on WhatsApp",
    whatsappMessage:
      "Hello Kikiewa, I would like to ask about a medical spa consultation at the Nitel practice.",
    fallbackNote: "Until it is, this enquiry opens our contact page.",
  },
};

/* ---------------------------------------------------------------------------
   /salon-spa
   Warmer register than /medical-spa, same restraint on facts: no prices,
   statistics, testimonials or service promises.
--------------------------------------------------------------------------- */

export type ExpectationPoint = { icon: IconName; title: string; body: string };
/** A gallery position with its alt text, waiting for a photograph. */
export type GallerySlot = { alt: string; image?: ImageAsset };

export const salonSpa: {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    cta: NavLink;
    image: { alt: string; asset?: ImageAsset };
  };
  categoriesIntro: { eyebrow: string; heading: string; body: string };
  expectIntro: { eyebrow: string; heading: string; body: string };
  expectations: ExpectationPoint[];
  gallery: { eyebrow: string; heading: string; items: GallerySlot[] };
  location: LocationBlockCopy;
} = {
  // DRAFT COPY - client approval needed
  meta: {
    title: "Salon & Spa",
    description:
      "Salon and spa care at the Kikiewa Ebute branch in Lagos. Hair, nails, skin, massage, grooming and event styling, by appointment.",
  },

  // DRAFT COPY - client approval needed
  hero: {
    eyebrow: "Division 01 • Salon & Spa",
    heading: "Unhurried care, from the first wash to the final finish.",
    body: "Our Ebute branch is a calm, welcoming space for hair, nails, skin and body care. You are seen by appointment, at your own pace, by a team that takes its time.",
    cta: {
      label: "Book an appointment",
      href: bookingHref + "?location=ebute&service=salon-spa",
    },
    image: {
      alt: "Styling and treatment room at the Kikiewa Ebute salon and spa in Lagos",
    },
  },

  // DRAFT COPY - client approval needed
  categoriesIntro: {
    eyebrow: "What We Offer",
    heading: "Six Areas of Care",
    body: "Each area is looked after by our Ebute team. The full service list for every category will be published here once confirmed.",
  },

  // DRAFT COPY - client approval needed
  expectIntro: {
    eyebrow: "Your Visit",
    heading: "What to Expect",
    body: "Three things hold true for every appointment at Ebute.",
  },

  // DRAFT COPY - client approval needed
  expectations: [
    {
      icon: "badge",
      title: "Professional team",
      body: "You are looked after by salon and spa staff who do this work every day.",
    },
    {
      icon: "sanitizer",
      title: "Clean environment",
      body: "Tools, linens and stations are prepared fresh between appointments.",
    },
    {
      icon: "notes",
      title: "Personalised service",
      body: "We talk through what you want before anything begins, and work to that.",
    },
  ],

  gallery: {
    eyebrow: "The Space",
    heading: "Inside Ebute",
    items: [
      { alt: "The reception and waiting area at the Kikiewa Ebute salon" },
      { alt: "A styling station at the Kikiewa Ebute salon" },
      { alt: "The manicure and pedicure area at the Kikiewa Ebute salon" },
      { alt: "A treatment room at the Kikiewa Ebute spa" },
    ],
  },

  // DRAFT COPY - client approval needed
  location: {
    eyebrow: "Visit Us",
    heading: "The Ebute Branch",
    body: "Salon and spa appointments are held at our Ebute branch. Message us and we will find a time that suits you.",
    mapAlt: "Map showing the Kikiewa Ebute salon and spa in Lagos",
    whatsappLabel: "Book on WhatsApp",
    whatsappMessage:
      "Hello Kikiewa, I would like to book a salon and spa appointment at Ebute.",
    fallbackNote: "Until it is, this booking opens our contact page.",
  },
};

/* ---------------------------------------------------------------------------
   Other pages. Short, honest pages for routes linked from the navigation.
   Each one says what it covers and where to go next; none ships a "coming
   soon" panel.
--------------------------------------------------------------------------- */

export type PageCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  heading: string;
  body: string;
};

// DRAFT COPY - client approval needed (all page copy below)
export const locationsPage: PageCopy = {
  meta: {
    title: "Locations",
    description:
      "The two Kikiewa branches in Lagos: salon and spa at Ebute, medical spa, makeover and the Beauty Institute at Nitel.",
  },
  eyebrow: "Physical Enclaves",
  heading: "Our Two Lagos Branches",
  body: "Salon and spa care is delivered at Ebute, and medical spa, makeover and institute work at Nitel. Each branch lists its own address, hours and contact details below.",
};

export const pages = {
  salonServices: {
    meta: {
      title: "Salon & Spa Services",
      description: "The service menu at the Kikiewa Ebute salon and spa in Lagos.",
    },
    eyebrow: "Salon & Spa • Ebute",
    heading: "Services",
    body: "The menu at our Ebute branch. Durations and prices are listed as they are confirmed.",
  },
  treatments: {
    meta: {
      title: "Medical Spa Treatments",
      description: "Treatments at the Kikiewa Nitel medical spa in Lagos. Every treatment begins with a consultation.",
    },
    eyebrow: "Medical Spa • Nitel",
    heading: "Treatments",
    body: "Every medical treatment begins with a consultation. Suitability is assessed in person, and results vary from person to person.",
  },
  concerns: {
    meta: {
      title: "Skin Concerns",
      description: "Common skin concerns we discuss at consultation at the Kikiewa Nitel medical spa.",
    },
    eyebrow: "Medical Spa • Nitel",
    heading: "Concerns",
    body: "Start with what you would like to change. We will talk through what may be suitable at your consultation.",
  },
  consultation: {
    meta: {
      title: "Consultation",
      description: "How a consultation works at the Kikiewa Nitel medical spa in Lagos.",
    },
    eyebrow: "Medical Spa • Nitel",
    heading: "Consultation",
    body: "Every medical spa treatment starts here: a conversation about your history, your goals and what is suitable for you.",
  },
  institute: {
    meta: {
      title: "Beauty Institute",
      description: "Courses at the Kikiewa Beauty Institute in Lagos.",
    },
    eyebrow: "Division 03 • Beauty Institute",
    heading: "Learn the craft where it's practised.",
    body: "Courses taught alongside our working salon, spa and medical spa. Course details are published as they are confirmed.",
  },
  courses: {
    meta: {
      title: "Courses",
      description: "Course catalogue for the Kikiewa Beauty Institute in Lagos.",
    },
    eyebrow: "Beauty Institute",
    heading: "Courses",
    body: "Each course lists its level, entry requirements, duration and fee, so you can compare them side by side.",
  },
  admissions: {
    meta: {
      title: "Admissions",
      description: "How to apply to the Kikiewa Beauty Institute in Lagos.",
    },
    eyebrow: "Beauty Institute",
    heading: "Admissions",
    body: "Message us to ask about a course or to arrange a visit. We will talk you through entry requirements and the next intake.",
  },
  gallery: {
    meta: {
      title: "Gallery",
      description: "Inside the Kikiewa salon and spa, medical spa and Beauty Institute in Lagos.",
    },
    eyebrow: "Gallery",
    heading: "Inside Kikiewa",
    body: "Photographs from our Ebute and Nitel branches, by division.",
  },
  book: {
    meta: {
      title: "Book",
      description: "Book an appointment at Kikiewa in Lagos.",
    },
    eyebrow: "Appointments",
    heading: "Book an appointment",
    body: "Choose where you would like to start. Medical spa treatments always begin with a consultation.",
  },
  contact: {
    meta: {
      title: "Contact",
      description: "Contact the Kikiewa Ebute and Nitel branches in Lagos.",
    },
    eyebrow: "Contact",
    heading: "Get in touch",
    body: "Message us on WhatsApp or contact the branch you would like to visit.",
  },
  licensing: {
    meta: {
      title: "Licensing & Compliance",
      description: "Licensing and compliance information for Kikiewa.",
    },
    eyebrow: "Licensing & Compliance",
    heading: "Licensing & Compliance",
    body: "Kikiewa publishes licence and registration details only once they are verified.",
  },
  privacy: {
    meta: {
      title: "Privacy Policy",
      description: "How Kikiewa handles your personal information.",
    },
    eyebrow: "Privacy",
    heading: "Privacy Policy",
    body: "How we collect, use and protect your personal information.",
  },
} satisfies Record<string, PageCopy>;

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
    title: "Salon & Spa",
    body: "Hair, nails, skin, massage and styling at our Ebute branch.",
    location: "ebute",
    whatsappMessage: "Hello Kikiewa, I would like to book a salon and spa appointment at Ebute.",
    cta: "Book on WhatsApp",
  },
  {
    title: "Medical Spa consultation",
    body: "Every medical spa treatment at Nitel begins with a consultation.",
    location: "nitel",
    whatsappMessage: "Hello Kikiewa, I would like to book a medical spa consultation at Nitel.",
    cta: "Book a consultation",
  },
  {
    title: "Beauty Institute",
    body: "Ask about a course or arrange a visit to the institute.",
    location: null,
    whatsappMessage: "Hello Kikiewa, I would like to ask about a course at the Beauty Institute.",
    cta: "Ask about a course",
  },
];
