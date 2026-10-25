import type { IconName } from "@/components/Icon";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Single source of content for the site. Every page reads from here.
 *
 * Source: reference/site-plan.md (v3). Content rules:
 * - Kikiewa is one business. Ebute and Nitel are two equal locations in
 *   Ikorodu offering the same services. Nothing here ties a service to one
 *   location unless a service sets `locations` (only when the client says so).
 * - Never "branch", "head office", "division" or "house" on screen.
 * - Not on the website (site plan, section 0): buttock injectables, body
 *   fillers, any filler or injectable named by product, weight-loss
 *   injections or medication, "face ammunization", before/after photos
 *   without written consent, outcome promises.
 * - No invented facts. Anything unconfirmed is the literal `TBC`; never print
 *   it directly. Prices, durations, addresses, hours, phones and course facts
 *   show "To be confirmed" (components/Confirmable.tsx). Story, team, socials
 *   and testimonials are hidden until real.
 * - Copy written before client sign-off is marked
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

/** True when at least one value is confirmed. Used to hide all-TBC sections. */
export function hasConfirmed(values: unknown[]): boolean {
  return values.some((value) => value !== undefined && !isTBC(value));
}

export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children?: NavLink[] };

/** Copy for a page's opening section. */
export type PageCopy = { eyebrow: string; heading: string; body: string };

/** A question and answer. Questions whose answer is TBC are not shown. */
export type FaqItem = { question: string; answer: OrTBC<string> };

/** A titled point (values, steps, reasons). */
export type Point = { title: string; body?: string };

/**
 * Where a photograph comes from. The two temp sources are stand-ins until the
 * photoshoot: `npm run check:images` lists every one still referenced and
 * fails a production build, and previews badge them "Temp image".
 * - "final": cleared, final photography (the default).
 * - "stock": an Unsplash photo approved to keep. Allowed in production.
 * - "stock-temp": an Unsplash photo still to be replaced.
 * - "instagram-temp": a client photo taken from Kikiewa's Instagram.
 * Every stock photo, kept or temp, has a row in public/images/CREDITS.md.
 */
export type ImageSource = "final" | "stock" | "stock-temp" | "instagram-temp";

/**
 * A photograph, stored under public/images/{folder}/. `source` defaults to
 * "final".
 *
 * Alt text for Kikiewa's own photographs: "{what is shown} at Kikiewa,
 * Ikorodu". Stock photographs describe only what is shown, never claiming
 * to be Kikiewa.
 */
export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  source?: ImageSource;
};

/**
 * A photograph of Kikiewa's own work, people or places: Our work, Gallery,
 * Inside our classes, the team, Locations, Testimonials. Stock is a type
 * error here.
 */
export type OwnImageAsset = ImageAsset & { source?: Exclude<ImageSource, "stock" | "stock-temp"> };

/** A picture position with its alt text, waiting for a photograph. */
export type ImageSlot = { alt: string; image?: ImageAsset };

/* ---------------------------------------------------------------------------
   Site, contact
--------------------------------------------------------------------------- */

export const site = {
  name: "Kikiewa",
  /** Registered business name, for structured data. */
  legalName: TBC as OrTBC<string>,
  url: "https://kikiewa.com",
  /** Where both locations are. Confirmed in the brief. */
  area: "Ikorodu, Lagos",
  region: "Lagos State",
  lang: "en-NG",
  ogLocale: "en_NG",
  /** Static: cacheComponents rejects new Date() during prerender. */
  copyrightYear: 2026,
} as const;

/**
 * Business-wide contact details. `phone` is the main line (from the client's
 * Instagram) and also the WhatsApp line. Numbers are written in the local
 * form shown on screen; tel: and wa.me links convert them to +234
 * (lib/phone.ts, lib/whatsapp.ts). Each location keeps its own numbers, TBC
 * until confirmed, and falls back to these meanwhile.
 */
export const contact: { phone: OrTBC<string>; whatsapp: OrTBC<string>; email: OrTBC<string> } = {
  phone: "0706 621 2933",
  whatsapp: "0706 621 2933",
  email: TBC,
};

/** Social profiles. The footer's Follow column is hidden while empty. */
export const socials: NavLink[] = [];

export const bookingHref = "/book";
export const contactHref = "/contact";
/** Every aesthetic treatment starts with a consultation. */
export const consultationHref = bookingHref + "?service=aesthetic-consultation";

// DRAFT COPY - client approval needed
/** Pre-filled WhatsApp messages. */
export const whatsappMessages = {
  general: "Hello Kikiewa, I'd like some help choosing a service.",
  consultation: "Hello Kikiewa, I'd like to book an aesthetic consultation.",
  academy: "Hello Kikiewa, I'd like to know more about the Academy courses.",
} as const;

/** WhatsApp link with the general greeting (falls back to /contact if the number is TBC). */
export const whatsappHref = whatsappLink(contact.whatsapp, whatsappMessages.general);

/** Every CTA label (site plan, section 1). */
// DRAFT COPY - client approval needed
export const cta = {
  book: "Book an appointment",
  bookShort: "Book",
  whatsapp: "Chat on WhatsApp",
  call: "Call us",
  viewServices: "View services",
  seeWork: "See our work",
  seeCourses: "See our courses",
  directions: "Get directions",
  consultation: "Book a consultation",
  bookHere: "Book here",
  viewCourse: "View course",
} as const;

/* ---------------------------------------------------------------------------
   SEO: one row per route (site plan, section 8).
   Titles ≤ 60 characters, descriptions ≤ 155, never "TBC" or "{{".
   `npm run check:seo` checks the built pages against these rules.
--------------------------------------------------------------------------- */

export type PageMeta = { title: string; description: string; path: string };

// DRAFT COPY - client approval needed
export const seo = {
  home: {
    path: "/",
    title: "Kikiewa | Med Spa, Facials & Beauty in Ikorodu, Lagos",
    description:
      "Your beauty, seen and felt. Facials, massage, aesthetics, hair, nails and makeup at Kikiewa in Ikorodu, Lagos. Book online or on WhatsApp.",
  },
  about: {
    path: "/about",
    title: "About Kikiewa | Med Spa & Beauty in Ikorodu",
    description:
      "Everyone is beautiful in their own way. Meet Kikiewa, the med spa and beauty studio in Ikorodu, Lagos, that brings it out.",
  },
  services: {
    path: "/services",
    title: "Med Spa & Beauty Services in Ikorodu | Kikiewa",
    description:
      "Facials, massage, aesthetics, hair and barbing, nails and makeup at Kikiewa's two locations in Ikorodu, Lagos. See prices and book.",
  },
  facials: {
    path: "/services/facials",
    title: "Facials in Ikorodu, Lagos | Kikiewa",
    description:
      "Deep cleansing, hydrating and glow facials at Kikiewa in Ikorodu, Lagos, matched to your skin. See prices and book online.",
  },
  massage: {
    path: "/services/massage",
    title: "Massage & Spa in Ikorodu, Lagos | Kikiewa",
    description:
      "Relaxing and deep tissue massage at Kikiewa in Ikorodu, Lagos. Switch off, breathe out. See prices and book online.",
  },
  aesthetics: {
    path: "/services/aesthetics",
    title: "Aesthetic Skin Treatments in Ikorodu | Kikiewa",
    description:
      "Advanced aesthetic skin treatments at Kikiewa in Ikorodu, Lagos, always starting with a consultation. Book a consultation online.",
  },
  hair: {
    path: "/services/hair",
    title: "Hair Salon & Barbing in Ikorodu | Kikiewa",
    description:
      "Hair styling, treatments, braids and barbing at Kikiewa in Ikorodu, Lagos. See prices and book online or on WhatsApp.",
  },
  nails: {
    path: "/services/nails",
    title: "Nails, Manicure & Pedicure in Ikorodu | Kikiewa",
    description:
      "Manicures, pedicures, gel and nail art at Kikiewa in Ikorodu, Lagos. See prices and book online or on WhatsApp.",
  },
  makeup: {
    path: "/services/makeup",
    title: "Makeup Artist in Ikorodu, Lagos | Kikiewa",
    description:
      "Bridal, event and photoshoot makeup at Kikiewa in Ikorodu, Lagos, matched to your skin and occasion. Book online.",
  },
  academy: {
    path: "/academy",
    title: "Beauty School in Ikorodu, Lagos | Kikiewa Academy",
    description:
      "Practical cosmetology and aesthetics courses at Kikiewa Academy, Ikorodu. Learn from the people who practise the craft.",
  },
  cosmetology: {
    path: "/academy/cosmetology",
    title: "Cosmetology Course in Ikorodu | Kikiewa Academy",
    description:
      "Learn hair styling, barbing, nails, makeup, manicure and pedicure at Kikiewa Academy in Ikorodu, Lagos. See fees and how to apply.",
  },
  aestheticsCourse: {
    path: "/academy/aesthetics",
    title: "Aesthetics Course in Ikorodu | Kikiewa Academy",
    description:
      "Learn facials and massage at Kikiewa Academy in Ikorodu, Lagos. Practical training from working professionals. See how to apply.",
  },
  gallery: {
    path: "/gallery",
    title: "Our Work | Kikiewa Ikorodu",
    description:
      "Recent facials, hair, nails, makeup and more from the team at Kikiewa in Ikorodu, Lagos.",
  },
  locations: {
    path: "/locations",
    title: "Kikiewa Locations in Ikorodu, Lagos",
    description:
      "Visit Kikiewa at Ebute or Nitel, Ikorodu: addresses, opening hours, phone numbers and directions.",
  },
  ebute: {
    path: "/locations/ebute",
    title: "Kikiewa Ebute, Ikorodu | Med Spa & Beauty",
    description:
      "Kikiewa in Ebute, Ikorodu: facials, massage, aesthetics, hair, nails and makeup. Address, hours and directions.",
  },
  nitel: {
    path: "/locations/nitel",
    title: "Kikiewa Nitel, Ikorodu | Med Spa & Beauty",
    description:
      "Kikiewa in Nitel, Ikorodu: facials, massage, aesthetics, hair, nails and makeup. Address, hours and directions.",
  },
  book: {
    path: "/book",
    title: "Book an Appointment | Kikiewa Ikorodu",
    description:
      "Book facials, massage, aesthetics, hair, nails or makeup at Kikiewa in Ikorodu, Lagos. Choose a time; we'll confirm on WhatsApp.",
  },
  contact: {
    path: "/contact",
    title: "Contact Kikiewa | Ikorodu, Lagos",
    description: "Call, WhatsApp or message Kikiewa at Ebute or Nitel, Ikorodu, Lagos.",
  },
  // Not in the site plan's table: written to the same rules.
  bookingPolicy: {
    path: "/booking-policy",
    title: "Booking Policy | Kikiewa Ikorodu",
    description:
      "How booking, rescheduling and cancellation work at Kikiewa in Ikorodu, Lagos.",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy | Kikiewa",
    description:
      "How Kikiewa collects, uses and protects your personal information when you book, enquire or visit us in Ikorodu, Lagos.",
  },
} satisfies Record<string, PageMeta>;

/* ---------------------------------------------------------------------------
   Locations: two equals. Identical fields, identical pages.
--------------------------------------------------------------------------- */

export type LocationId = "ebute" | "nitel";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

/**
 * One row of opening hours: the days it covers, and 24-hour "HH:MM" times.
 * Structured so the hours table, the booking times and the BeautySalon
 * JSON-LD all read the same confirmed values.
 * Example: { days: ["monday", "tuesday"], opens: "09:00", closes: "18:00" }
 */
export type OpeningHours = { days: Weekday[]; opens: string; closes: string };

export type Location = {
  id: LocationId;
  /** Area name: "Ebute". */
  name: string;
  /** Card title and call-sheet row: "Kikiewa Ebute". */
  title: string;
  /** The location page's H1: "Kikiewa Ebute, Ikorodu". */
  heading: string;
  /** Area and town: "Ebute, Ikorodu". */
  area: string;
  address: OrTBC<string>;
  landmark: OrTBC<string>;
  hours: OrTBC<OpeningHours[]>;
  phone: OrTBC<string>;
  /**
   * WhatsApp number for booking requests at this location, written locally
   * ("0706 621 2933"). While TBC, requests use the business number.
   */
  whatsapp: OrTBC<string>;
  /** Google Maps link for "Get directions". */
  mapUrl: OrTBC<string>;
  href: string;
  bookHref: string;
  seo: PageMeta;
};

export const ebuteLocation: Location = {
  id: "ebute",
  name: "Ebute",
  title: "Kikiewa Ebute",
  heading: "Kikiewa Ebute, Ikorodu",
  area: "Ebute, Ikorodu",
  address: TBC,
  landmark: TBC,
  hours: TBC,
  phone: TBC,
  whatsapp: TBC,
  mapUrl: TBC,
  href: "/locations/ebute",
  bookHref: bookingHref + "?location=ebute",
  seo: seo.ebute,
};

export const nitelLocation: Location = {
  id: "nitel",
  name: "Nitel",
  title: "Kikiewa Nitel",
  heading: "Kikiewa Nitel, Ikorodu",
  area: "Nitel, Ikorodu",
  address: TBC,
  landmark: TBC,
  hours: TBC,
  phone: TBC,
  whatsapp: TBC,
  mapUrl: TBC,
  href: "/locations/nitel",
  bookHref: bookingHref + "?location=nitel",
  seo: seo.nitel,
};

/** Alphabetical, so neither reads as the main one. */
export const locations: Location[] = [ebuteLocation, nitelLocation];

/**
 * The mobile Call sheet: the main line first, then one row per location.
 * Rows with a TBC phone open /contact instead.
 */
// DRAFT COPY - client approval needed
export const callSheet = {
  trigger: "Call",
  title: "Call Kikiewa",
  close: "Close",
  /** Row label for the business-wide number (contact.phone). */
  mainLine: "Main line",
  /** Shown under a row while that location's phone is TBC. */
  fallback: "See contact details",
} as const;

/** Labels shared by location cards and pages. */
// DRAFT COPY - client approval needed
export const locationLabels = {
  address: "Address",
  landmark: "Landmark",
  hours: "Opening hours",
  phone: "Phone",
  directionsTbc: "Directions to be confirmed",
  servicesHeading: "Services at this location",
  call: "Call this location",
  otherHeading: "Also in Ikorodu",
  otherLink: "Visit page",
  closed: "Closed",
} as const;

/* ---------------------------------------------------------------------------
   Services: six categories, every one offered at both locations.
--------------------------------------------------------------------------- */

export type ServiceSlug = "facials" | "massage" | "aesthetics" | "hair" | "nails" | "makeup";

export type ServiceItem = {
  slug: string;
  /** Named by benefit: "Hydrating Facial", not "Facial B". */
  name: string;
  summary: string;
  durationMins: OrTBC<number>;
  priceFrom: OrTBC<number>;
  /** False for the site plan's suggested names: hidden in production. */
  confirmed: boolean;
  /** Books a consultation first (aesthetics). */
  requiresConsultation?: boolean;
  /** Only when the client says a service is at one location. Default: both. */
  locations?: LocationId[];
};

export type ServiceCategory = {
  slug: ServiceSlug;
  /** Nav, card and filter label: "Massage & Spa". */
  name: string;
  href: string;
  icon: IconName;
  /** One line for the cards on Home and /services. */
  cardLine: string;
  /** Card photograph, and the service page's hero unless `heroImage` is set. */
  image: ImageSlot;
  /** Service page hero, when it should differ from the card. */
  heroImage?: ImageSlot;
  /** The service page's H1 and line. */
  heading: string;
  line: string;
  intro: string;
  /** "What to expect", 3–4 short steps. Left out where the plan has none. */
  expect?: Point[];
  /** A titled list beside a photograph, after "What to expect" (facials). */
  signs?: ServiceSigns;
  faqs: FaqItem[];
  /** Small print on the page (aesthetics). */
  disclaimer?: string;
  /** Aesthetics: every booking is a consultation. */
  consultationLed: boolean;
  seo: PageMeta;
};

export type ServiceSigns = {
  heading: string;
  items: Point[];
  cta: NavLink;
  image: ImageSlot;
};

export function serviceHref(slug: ServiceSlug): string {
  return "/services/" + slug;
}

// DRAFT COPY - client approval needed
export const serviceCategories: ServiceCategory[] = [
  {
    slug: "facials",
    name: "Facials",
    href: serviceHref("facials"),
    icon: "face",
    cardLine: "Deep cleansing, hydrating and glow facials, matched to your skin.",
    image: {
      alt: "Facial treatment at Kikiewa, Ikorodu",
      image: {
        src: "/images/services/facials.jpg",
        alt: "A woman smoothing a dab of cream onto her cheek",
        width: 1600,
        height: 2400,
        source: "stock",
      },
    },
    heading: "Facials",
    line: "Skin that feels as good as it looks.",
    intro:
      "Every facial starts with a look at your skin and a chat about what you'd like. Then we cleanse, treat and finish with care, and send you home with simple advice to keep the glow going.",
    expect: [
      { title: "Skin check" },
      { title: "Cleanse & exfoliate" },
      { title: "Treat & massage" },
      { title: "Finish & advice" },
    ],
    signs: {
      heading: "Signs your facial is overdue",
      items: [
        {
          title: "Your makeup looks patchy.",
          body: "Uneven texture stops makeup sitting smoothly; a facial with dermaplaning can help it apply more evenly.",
        },
        { title: "Dry or rough patches.", body: "Usually dead skin that's ready to come off." },
        {
          title: "Blackheads or congestion.",
          body: "Pores clogged with dirt and oil look bigger; a facial helps clear them.",
        },
        {
          title: "It's been more than four weeks.",
          body: "Facials work best as part of a regular routine.",
        },
      ],
      cta: { label: "Book a facial", href: bookingHref + "?service=facials" },
      image: {
        alt: "Signs your facial is overdue, from Kikiewa's Instagram",
        image: {
          src: "/images/services/facials-overdue-cover.jpg",
          alt: "A close view of a woman's glowing skin under the Kikiewa logo, with the words \"Signs that your facials are overdue\"",
          width: 864,
          height: 1079,
          source: "instagram-temp",
        },
      },
    },
    faqs: [
      {
        question: "How often should I have a facial?",
        answer: "Every four weeks or so works well for most skin. We'll suggest a rhythm that suits yours.",
      },
      { question: "Can I wear makeup afterwards?", answer: TBC },
      { question: "Is it suitable for sensitive skin?", answer: TBC },
    ],
    consultationLed: false,
    seo: seo.facials,
  },
  {
    slug: "massage",
    name: "Massage & Spa",
    href: serviceHref("massage"),
    icon: "spa",
    cardLine: "Massages that release tension and help you fully switch off.",
    image: {
      alt: "Massage treatment at Kikiewa, Ikorodu",
      image: {
        src: "/images/services/massage.jpg",
        alt: "A woman resting on a massage table beside warm stones, towels and a candle",
        width: 1600,
        height: 1036,
        source: "stock",
      },
    },
    heading: "Massage & Spa",
    line: "Switch off. Breathe out.",
    intro:
      "Choose the pressure and the pace. Our therapists work with you to release tension, ease tired muscles and give your mind a proper rest.",
    expect: [
      { title: "Settle in" },
      { title: "Tell us what you need" },
      { title: "Your massage" },
      { title: "Take your time afterwards" },
    ],
    faqs: [
      { question: "What should I wear?", answer: TBC },
      { question: "Can I choose a male or female therapist?", answer: TBC },
      { question: "Can I book for two?", answer: TBC },
    ],
    consultationLed: false,
    seo: seo.massage,
  },
  {
    slug: "aesthetics",
    name: "Aesthetics",
    href: serviceHref("aesthetics"),
    icon: "sparkle",
    cardLine: "Advanced skin treatments, always starting with a consultation.",
    image: {
      alt: "Aesthetic skin consultation at Kikiewa, Ikorodu",
      image: {
        src: "/images/services/aesthetics.jpg",
        alt: "A clean, white skincare treatment room with a freshly made treatment bed",
        width: 1600,
        height: 1988,
        source: "stock",
      },
    },
    heading: "Aesthetics",
    line: "Advanced skin care, always starting with a consultation.",
    intro:
      "For concerns a facial can't reach, our aesthetic treatments go further. Every one begins with a consultation, so you only ever get what's right for your skin.",
    expect: [
      {
        title: "Consultation",
        body: "We listen to what you'd like to address and take a short medical history.",
      },
      {
        title: "Assessment & plan",
        body: "We check suitability, explain your options, costs and what to expect, and agree a plan.",
      },
      {
        title: "Treatment",
        body: "Carried out by our team, at a pace you're comfortable with.",
      },
      {
        title: "Aftercare",
        body: "Clear aftercare advice, and we check in afterwards where your treatment calls for it.",
      },
    ],
    faqs: [
      {
        question: "What happens at a consultation?",
        answer:
          "We discuss your concerns and medical history, assess your skin, and explain suitable options, costs and aftercare. There's no obligation to go ahead.",
      },
      { question: "Is there a consultation fee?", answer: TBC },
      {
        question: "Will I see results after one session?",
        answer: "Results vary from person to person; we'll talk you through what's realistic.",
      },
    ],
    disclaimer:
      "Treatments follow a consultation and suitability assessment. Results vary from person to person.",
    consultationLed: true,
    seo: seo.aesthetics,
  },
  {
    slug: "hair",
    name: "Hair & Barbing",
    href: serviceHref("hair"),
    icon: "scissors",
    cardLine: "Styling, treatments and clean, sharp cuts.",
    image: {
      alt: "Hair styling at Kikiewa, Ikorodu",
      image: {
        src: "/images/services/hair.jpg",
        alt: "A close view of hands braiding neat rows into dark hair",
        width: 1600,
        height: 2000,
        source: "stock",
      },
    },
    heroImage: {
      alt: "Barbering at Kikiewa, Ikorodu",
      image: {
        src: "/images/services/hair-barber.jpg",
        alt: "A barber shaping a man's curly high top fade",
        width: 1600,
        height: 1840,
        source: "stock",
      },
    },
    heading: "Hair & Barbing",
    line: "Styled, cut and cared for.",
    intro:
      "From protective styles and treatments to clean, sharp cuts, our stylists and barbers take the time to get it right for your hair.",
    expect: [
      { title: "Consultation" },
      { title: "Wash & prep" },
      { title: "Style or cut" },
      { title: "Finish & aftercare tips" },
    ],
    faqs: [
      {
        question: "How long will my appointment take?",
        answer: "It depends on the style and your hair length. We'll give you a time when you book.",
      },
      {
        question: "Do you cut men's hair?",
        answer: "Yes. Our barbers offer cuts and grooming for men.",
      },
    ],
    consultationLed: false,
    seo: seo.hair,
  },
  {
    slug: "nails",
    name: "Nails",
    href: serviceHref("nails"),
    icon: "hand",
    cardLine: "Manicures, pedicures and nail art, finished with precision.",
    image: {
      alt: "Manicure at Kikiewa, Ikorodu",
      image: {
        src: "/images/services/nails.jpg",
        alt: "A smiling woman with short nails in white polish, resting her hand at her chin",
        width: 1600,
        height: 2400,
        source: "stock",
      },
    },
    heading: "Nails",
    line: "Finished with precision.",
    intro:
      "Clean shapes, neat cuticles and colour that lasts. Keep it simple or ask for nail art.",
    expect: [
      { title: "Choose your look" },
      { title: "Shape & prep" },
      { title: "Colour or art" },
      { title: "Finish & care tips" },
    ],
    faqs: [
      {
        question: "Can I bring a design I like?",
        answer: "Yes. Bring a photo and we'll talk it through before we start.",
      },
      {
        question: "How long does gel polish last?",
        answer:
          "Longer than regular polish. How long depends on your nails and your daily routine; we'll give you tips to make it last.",
      },
    ],
    consultationLed: false,
    seo: seo.nails,
  },
  {
    slug: "makeup",
    name: "Makeup",
    href: serviceHref("makeup"),
    icon: "brush",
    cardLine: "For your big day, a night out, or a photoshoot.",
    image: {
      alt: "Makeup artist at work at Kikiewa, Ikorodu",
      image: {
        src: "/images/services/makeup.jpg",
        alt: "A woman with shimmering eyeshadow lining her lips with a pencil",
        width: 1600,
        height: 2400,
        source: "stock",
      },
    },
    heading: "Makeup",
    line: "For the moments you want to remember.",
    intro:
      "Bridal, events, photoshoots or just because. We match your makeup to your skin, your outfit and the occasion.",
    expect: [
      { title: "Tell us the occasion" },
      { title: "Skin prep" },
      { title: "Your look" },
      { title: "Final touches" },
    ],
    faqs: [
      { question: "Do you offer trials?", answer: TBC },
      { question: "Can you come to my venue?", answer: TBC },
      { question: "How early should I book for a wedding?", answer: TBC },
    ],
    consultationLed: false,
    seo: seo.makeup,
  },
];

export function findServiceCategory(slug: ServiceSlug): ServiceCategory {
  const category = serviceCategories.find((item) => item.slug === slug);
  if (!category) throw new Error(`Unknown service category: ${slug}`);
  return category;
}

/** Services dropdown, footer column and gallery filters. */
export const serviceLinks: NavLink[] = serviceCategories.map((category) => ({
  label: category.name,
  href: category.href,
}));

/**
 * Menus, keyed by category. Every duration and price is TBC. Items with
 * `confirmed: false` are the site plan's suggested names for the client to
 * confirm or replace: shown (and marked) on previews, hidden in production.
 *
 * Aesthetics lists only treatments the client confirms in writing are
 * licensed and safe to advertise. Until then: the consultation alone.
 */
// DRAFT COPY - client approval needed (all summaries)
export const serviceMenus: Record<ServiceSlug, ServiceItem[]> = {
  facials: [
    {
      slug: "deep-cleansing-facial",
      name: "Deep Cleansing Facial",
      summary: "A thorough cleanse for congested or oily skin.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    {
      slug: "hydrating-facial",
      name: "Hydrating Facial",
      summary: "Moisture for dry, tight or tired skin.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    {
      slug: "glow-facial",
      name: "Glow Facial",
      summary: "A brightening facial for dull skin, before an event or just because.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    // Confirmed: offered on the client's Instagram.
    {
      slug: "dermaplaning",
      name: "Dermaplaning",
      summary: "Gently clears dead skin and fine facial hair for a smoother surface that makeup sits well on.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: true,
    },
    {
      slug: "facial-for-men",
      name: "Facial for Men",
      summary: "A facial suited to men's skin and shaving routines.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
  ],
  massage: [
    {
      slug: "relaxing-massage",
      name: "Relaxing Massage",
      summary: "Gentle, flowing pressure to help you unwind.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    {
      slug: "deep-tissue-massage",
      name: "Deep Tissue Massage",
      summary: "Firmer pressure for tight, tired muscles.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    {
      slug: "couples-massage",
      name: "Couples Massage",
      summary: "Side by side, at the same time, for two.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    {
      slug: "body-scrub",
      name: "Body Scrub",
      summary: "Exfoliation that leaves skin smooth and soft.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
  ],
  aesthetics: [
    {
      slug: "aesthetic-consultation",
      name: "Aesthetic consultation",
      summary: "Where every aesthetic treatment begins: your skin, your goals and what suits you.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: true,
      requiresConsultation: true,
    },
  ],
  hair: [
    {
      slug: "styling",
      name: "Styling",
      summary: "Wash, style and finish, talked through before we begin.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    {
      slug: "hair-treatment",
      name: "Hair Treatment",
      summary: "Treatments to nourish and care for your hair.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    {
      slug: "braids-protective-styles",
      name: "Braids & Protective Styles",
      summary: "Neat, comfortable protective styles.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    {
      slug: "haircut-barbing",
      name: "Haircut & Barbing",
      summary: "Clean, sharp cuts and crisp line ups.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
  ],
  nails: [
    {
      slug: "manicure",
      name: "Manicure",
      summary: "Shaping, cuticle care and a finish of your choice.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    {
      slug: "pedicure",
      name: "Pedicure",
      summary: "Foot care and polish, at an unhurried pace.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    {
      slug: "gel-polish",
      name: "Gel Polish",
      summary: "A glossy gel finish on hands or feet.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    {
      slug: "nail-art",
      name: "Nail Art",
      summary: "Designs from a simple accent to a full set.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
  ],
  makeup: [
    {
      slug: "bridal-makeup",
      name: "Bridal Makeup",
      summary: "Makeup for your wedding day, planned with you ahead of time.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    {
      slug: "event-makeup",
      name: "Event Makeup",
      summary: "For parties, celebrations and nights out.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
    {
      slug: "photoshoot-makeup",
      name: "Photoshoot Makeup",
      summary: "Makeup that works on camera and in person.",
      durationMins: TBC,
      priceFrom: TBC,
      confirmed: false,
    },
  ],
};

/** Where a menu item books: consultation-led items book the consultation. */
export function serviceBookingHref(item: ServiceItem): string {
  return item.requiresConsultation ? consultationHref : bookingHref + "?service=" + item.slug;
}

/** Labels for service pages. */
// DRAFT COPY - client approval needed
export const servicePage = {
  eyebrow: "Services",
  menuHeading: "Menu",
  duration: "Duration",
  price: "From",
  consultationTag: "Consultation required",
  suggestedTag: "Suggested name, to confirm",
  /** Shown when no menu item is confirmed yet. */
  menuEmpty: "Our full menu is on its way. Message us on WhatsApp and we'll talk you through it.",
  expectHeading: "What to expect",
  workHeading: "Our work",
  faqHeading: "Questions",
} as const;

/* ---------------------------------------------------------------------------
   Brand
--------------------------------------------------------------------------- */

/** How we work: the three values, reused across the site. */
// DRAFT COPY - client approval needed
export const values: Point[] = [
  {
    title: "We take our time.",
    body: "No rushing you to make room for the next booking.",
  },
  {
    title: "We're honest with you.",
    body: "We tell you what will suit you, what it costs and what to expect.",
  },
  {
    title: "We do it beautifully.",
    body: "Careful work, and a finish you'll be proud to show.",
  },
];

/* ---------------------------------------------------------------------------
   Home (site plan, section 3)
--------------------------------------------------------------------------- */

export type HeroSlide = {
  heading: string;
  line: string;
  cta: NavLink;
  image: ImageSlot;
};

// DRAFT COPY - client approval needed
export const hero: { label: string; slides: HeroSlide[] } = {
  label: "Welcome to Kikiewa",
  slides: [
    {
      heading: "Your beauty, seen and felt.",
      line: "Everyone is beautiful in their own way. At Kikiewa, we bring it out.",
      cta: { label: cta.book, href: bookingHref },
      image: {
        alt: "A calm treatment room at Kikiewa, Ikorodu",
        image: {
          src: "/images/home/hero-1.jpg",
          alt: "A candlelit steam room with warm lights over a stone bench",
          width: 2400,
          height: 1601,
          source: "stock",
        },
      },
    },
    {
      heading: "Skin that feels as good as it looks.",
      line: "Facials and skin treatments, matched to your skin.",
      cta: { label: "Explore facials", href: serviceHref("facials") },
      image: {
        alt: "Facial in progress at Kikiewa, Ikorodu",
        image: {
          src: "/images/home/hero-2.jpg",
          alt: "A therapist giving a woman a facial with a handheld skincare device",
          width: 2400,
          height: 1600,
          source: "stock",
        },
      },
    },
    {
      heading: "Switch off. Breathe out.",
      line: "Massage and spa treatments to release the week.",
      cta: { label: "Explore massage", href: serviceHref("massage") },
      image: {
        alt: "Massage treatment at Kikiewa, Ikorodu",
        image: {
          src: "/images/home/hero-3.jpg",
          alt: "A woman relaxing with her eyes closed during a back massage",
          width: 2400,
          height: 1600,
          source: "stock",
        },
      },
    },
    {
      heading: "Finished to be seen.",
      line: "Hair, barbing, nails and makeup, done with care.",
      cta: { label: cta.viewServices, href: "/services" },
      image: {
        alt: "Finished hair, nails and makeup at Kikiewa, Ikorodu",
        image: {
          src: "/images/home/hero-4.jpg",
          alt: "A smiling woman with her braids styled in a high, beaded updo",
          width: 2400,
          height: 1898,
          source: "stock",
        },
      },
    },
  ],
};

// DRAFT COPY - client approval needed
export const miniAbout = {
  eyebrow: "About Kikiewa",
  heading: "Everyone is beautiful in their own way.",
  body: "Kikiewa exists to bring that beauty out. We bring expertise and professional know-how to every treatment, so your beauty can be seen and felt. Facials, massage, aesthetics, hair, nails and makeup, all under one name in Ikorodu, Lagos.",
  link: { label: "More about us", href: "/about" },
  valuesHeading: "How we work",
  image: {
    alt: "A member of the Kikiewa team in Ikorodu",
    image: {
      src: "/images/home/about.jpg",
      alt: "Portrait of a woman with glowing skin, eyes closed, in warm light",
      width: 1600,
      height: 2400,
      source: "stock",
    },
  } as ImageSlot,
};

// DRAFT COPY - client approval needed
export const whatWeDo = {
  heading: "What we do",
  intro: "Whatever brings you in, it's the same care and the same standards.",
};

export type WorkItem = { category: ServiceSlug; alt: string; image?: OwnImageAsset };

/**
 * Home "Our work" tiles. Each links to its service page. No client faces or
 * before/afters without written consent (public/images/README.md).
 */
// DRAFT COPY - client approval needed
export const ourWork: { heading: string; intro: string; link: NavLink; items: WorkItem[] } = {
  heading: "Our work",
  intro: "A few recent favourites from our team.",
  link: { label: cta.seeWork, href: "/gallery" },
  items: [
    { category: "facials", alt: "Glowing skin after a facial at Kikiewa, Ikorodu" },
    { category: "hair", alt: "Finished hairstyle at Kikiewa, Ikorodu" },
    { category: "nails", alt: "Nail art at Kikiewa, Ikorodu" },
    { category: "makeup", alt: "Event makeup at Kikiewa, Ikorodu" },
    { category: "massage", alt: "Massage room at Kikiewa, Ikorodu" },
    { category: "hair", alt: "Fresh haircut at Kikiewa, Ikorodu" },
    { category: "aesthetics", alt: "Aesthetics treatment room at Kikiewa, Ikorodu" },
    { category: "makeup", alt: "Bridal makeup at Kikiewa, Ikorodu" },
  ],
};

export type ClassSlide = { alt: string; caption?: string; image?: OwnImageAsset };

// DRAFT COPY - client approval needed
export const academyHome = {
  eyebrow: "Kikiewa Academy",
  heading: "Learn the craft from the people who practise it.",
  body: "Practical training in cosmetology and aesthetics, taught by the team behind Kikiewa.",
  cta: { label: cta.seeCourses, href: "/academy" },
  slideshowLabel: "Inside our classes",
};

/** Class photos, shared by Home and /academy. Captions are optional. */
export const classSlides: ClassSlide[] = [
  { alt: "Students practising at Kikiewa Academy, Ikorodu" },
  { alt: "A hair styling class at Kikiewa Academy, Ikorodu" },
  { alt: "A nails class at Kikiewa Academy, Ikorodu" },
  { alt: "A facial training session at Kikiewa Academy, Ikorodu" },
];

export type Testimonial = {
  quote: string;
  /** First name and last initial: "Ada O." */
  name: string;
  service?: ServiceSlug;
  /** Only when the review comes from Google. */
  rating?: number;
  source: "google" | "whatsapp" | "instagram";
};

/**
 * Only real testimonials, shared with the customer's permission. While
 * empty, previews show labelled placeholders and production hides the
 * section (components/Testimonials.tsx).
 */
export const testimonials: Testimonial[] = [];

/** Academy students, same rules. */
export const studentTestimonials: Testimonial[] = [];

// DRAFT COPY - client approval needed
export const testimonialsSection = {
  heading: "What our clients say",
  label: "Client testimonials",
  placeholder: "Client testimonial, to be supplied",
  studentPlaceholder: "Student testimonial, to be supplied",
  placeholderCount: 3,
} as const;

// DRAFT COPY - client approval needed
export const locationsSection = {
  heading: "Visit us in Ikorodu",
  intro: "Two locations, the same Kikiewa. Choose whichever is closer.",
};

/** Closing band on every page (site plan, section 3.8). */
// DRAFT COPY - client approval needed
export const ctaBand = {
  heading: "Come in. Leave in full feather.",
  body: "Book in a few taps, or message us and we'll help you choose.",
  cta: { label: cta.book, href: bookingHref },
  secondaryCta: { label: cta.whatsapp, href: whatsappHref },
} as const;

/* ---------------------------------------------------------------------------
   Navigation and footer
--------------------------------------------------------------------------- */

// DRAFT COPY - client approval needed
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", children: serviceLinks },
  { label: "Academy", href: "/academy" },
  { label: "Gallery", href: "/gallery" },
  { label: "Locations", href: "/locations" },
  { label: "Contact", href: contactHref },
];

/** Desktop utility bar, above the header. */
export const utilityBar = {
  place: "Ikorodu, Lagos",
  locations: "Ebute · Nitel",
  hoursLink: { label: "Opening hours", href: "/locations" },
} as const;

// DRAFT COPY - client approval needed
export const footer = {
  tagline: "Your beauty, seen and felt.",
  /** Before the main line: "Call 0706 621 2933". */
  phoneLabel: "Call",
  servicesHeading: "Services",
  kikiewaHeading: "Kikiewa",
  kikiewaLinks: [
    { label: "About", href: "/about" },
    { label: "Academy", href: "/academy" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: contactHref },
  ] as NavLink[],
  visitHeading: "Visit",
  followHeading: "Follow",
  legalLinks: [
    { label: "Booking policy", href: "/booking-policy" },
    { label: "Privacy", href: "/privacy" },
  ] as NavLink[],
  note: "Aesthetic treatments follow a consultation and suitability assessment. Results vary from person to person.",
};

/** Breadcrumb roots for nested pages. */
export const breadcrumbRoots = {
  home: { label: "Home", href: "/" },
  services: { label: "Services", href: "/services" },
  academy: { label: "Academy", href: "/academy" },
  locations: { label: "Locations", href: "/locations" },
} as const satisfies Record<string, NavLink>;

/* ---------------------------------------------------------------------------
   About (site plan, section 4)
--------------------------------------------------------------------------- */

export type TeamMember = { name: string; role: string; image?: OwnImageAsset };

// DRAFT COPY - client approval needed
export const about = {
  intro: {
    eyebrow: "About Kikiewa",
    heading: "Everyone is beautiful in their own way.",
    body: "We exist to bring that beauty out.",
  } satisfies PageCopy,
  image: { alt: "Inside Kikiewa, Ikorodu, Lagos" } as ImageSlot,
  /** How Kikiewa started, the founder, the year, the name. Hidden while TBC. */
  story: { heading: "Our story", paragraphs: TBC as OrTBC<string[]> },
  vision: {
    heading: "Our vision",
    body: "A world where everyone sees the beauty they already have, and is helped to bring it out.",
  },
  mission: {
    heading: "Our mission",
    body: "To bring expertise and professional know-how to every client, so their beauty can be seen and felt.",
  },
  valuesHeading: "How we work",
  valuesImage: {
    alt: "A Kikiewa treatment in progress in Ikorodu",
    image: {
      src: "/images/home/about.jpg",
      alt: "Portrait of a woman with glowing skin, eyes closed, in warm light",
      width: 1600,
      height: 2400,
      source: "stock",
    },
  } as ImageSlot,
  /** After "How we work": the team's training, photographed by Kikiewa. */
  learning: {
    heading: "We keep learning",
    body: "To serve you better, our team keeps training and growing, inside the beauty industry and beyond.",
    images: [
      {
        alt: "Kikiewa team training",
        image: {
          src: "/images/about/learning-01.jpg",
          alt: "A member of the Kikiewa team holding a certificate of participation at a training workshop, with the two trainers",
          width: 1440,
          height: 1920,
          source: "instagram-temp",
        },
      },
      {
        alt: "Kikiewa team training",
        image: {
          src: "/images/about/learning-02.jpg",
          alt: "A member of the Kikiewa team smiling with a fellow participant at a training workshop",
          width: 1440,
          height: 1920,
          source: "instagram-temp",
        },
      },
    ] as ImageSlot[],
  },
  /** Hidden until real names and roles exist. */
  team: {
    heading: "Our team",
    body: "The people who'll look after you.",
    members: [] as TeamMember[],
  },
  locations: {
    eyebrow: "Visit us",
    heading: "Two locations, the same Kikiewa.",
    body: "Ebute and Nitel, both in Ikorodu, both offering every service.",
    link: { label: "Find us", href: "/locations" },
  },
};

/* ---------------------------------------------------------------------------
   /services hub (site plan, section 5)
--------------------------------------------------------------------------- */

// DRAFT COPY - client approval needed
export const servicesHub = {
  intro: {
    eyebrow: "Services",
    heading: "Our services",
    body: "Facials, massage, aesthetics, hair, nails and makeup, available at both our Ikorodu locations.",
  } satisfies PageCopy,
  help: {
    eyebrow: "Need a hand?",
    heading: "Not sure what to book?",
    body: "Tell us what you'd like and we'll recommend the right treatment.",
    cta: cta.whatsapp,
  },
};

/* ---------------------------------------------------------------------------
   Academy (site plan, section 6)
--------------------------------------------------------------------------- */

export type CourseSlug = "cosmetology" | "aesthetics";

export type Course = {
  slug: CourseSlug;
  name: string;
  href: string;
  /** Short list for cards: "Hair, barbing, nails, makeup, manicure and pedicure". */
  cardLine: string;
  image: ImageSlot;
  overview: string;
  /** "What you'll learn". */
  modules: string[];
  duration: OrTBC<string>;
  schedule: OrTBC<string>;
  /** In naira. */
  fee: OrTBC<number>;
  nextIntake: OrTBC<string>;
  certificate: OrTBC<string>;
  seo: PageMeta;
};

// DRAFT COPY - client approval needed
export const courses: Course[] = [
  {
    slug: "cosmetology",
    name: "Cosmetology",
    href: "/academy/cosmetology",
    cardLine: "Hair, barbing, nails, makeup, manicure and pedicure.",
    image: {
      alt: "A cosmetology class at Kikiewa Academy, Ikorodu",
      image: {
        src: "/images/academy/cosmetology.jpg",
        alt: "Hands with pink nails braiding a section of dark hair",
        width: 1600,
        height: 2000,
        source: "stock",
      },
    },
    overview:
      "A practical course across the beauty services we offer every day, taught by the team behind Kikiewa.",
    modules: [
      "Hair dressing and styling",
      "Barbing",
      "Nails and nail artistry",
      "Makeup",
      "Manicure and pedicure",
    ],
    duration: TBC,
    schedule: TBC,
    fee: TBC,
    nextIntake: TBC,
    certificate: TBC,
    seo: seo.cosmetology,
  },
  {
    slug: "aesthetics",
    name: "Aesthetics",
    href: "/academy/aesthetics",
    cardLine: "Facials and massage.",
    image: {
      alt: "An aesthetics class at Kikiewa Academy, Ikorodu",
      image: {
        src: "/images/academy/aesthetics.jpg",
        alt: "A therapist brushing a facial mask onto a woman's face",
        width: 1600,
        height: 1067,
        source: "stock",
      },
    },
    overview:
      "Practical training in facials and massage, taught by the people who give them at Kikiewa.",
    modules: ["Facials", "Massage"],
    duration: TBC,
    schedule: TBC,
    fee: TBC,
    nextIntake: TBC,
    certificate: TBC,
    seo: seo.aestheticsCourse,
  },
];

export function findCourse(slug: CourseSlug): Course {
  const course = courses.find((item) => item.slug === slug);
  if (!course) throw new Error(`Unknown course: ${slug}`);
  return course;
}

// DRAFT COPY - client approval needed
export const academy = {
  intro: {
    eyebrow: "Kikiewa Academy",
    heading: "Learn the craft from the people who practise it.",
    body: "Practical courses in cosmetology and aesthetics at Kikiewa, Ikorodu.",
  } satisfies PageCopy,
  image: {
    alt: "A class in progress at Kikiewa Academy, Ikorodu",
    image: {
      src: "/images/academy/hero.jpg",
      alt: "A close view of hands painting nail polish onto another person's nails",
      width: 2400,
      height: 1600,
      source: "stock",
    },
  } as ImageSlot,
  whyHeading: "Why train with us",
  /** `confirmed: false` points are hidden in production. */
  why: [
    { title: "Taught by working professionals", confirmed: true },
    { title: "Practical classes, learned by doing", confirmed: true },
    { title: "Small groups", confirmed: false },
  ],
  coursesHeading: "Our courses",
  classesHeading: "Inside our classes",
  applyHeading: "How to apply",
  apply: [
    { title: "Choose your course" },
    { title: "Visit or message us" },
    { title: "Enrol" },
  ] as Point[],
  /** Entry requirements, shown under the apply steps once confirmed. */
  requirements: TBC as OrTBC<string>,
  testimonialsHeading: "What our students say",
  faqHeading: "Questions",
  faqs: [
    { question: "Do I need experience?", answer: TBC },
    { question: "Are classes weekdays or weekends?", answer: TBC },
    { question: "Do I get a certificate?", answer: TBC },
  ] as FaqItem[],
  /** Course facts table labels. */
  facts: {
    duration: "Duration",
    schedule: "Schedule",
    fee: "Fee",
    nextIntake: "Next intake",
    certificate: "Certificate",
  },
  learnHeading: "What you'll learn",
  factsHeading: "Course details",
  overviewLabel: "Overview",
  /** Closing call to action on each course page. */
  courseCta: {
    heading: "Ask us about this course.",
    body: "Message us on WhatsApp, or visit either location, and we'll talk you through how to enrol.",
    secondary: { label: "Find us", href: "/locations" },
  },
  /** Link to the other course at the foot of a course page. */
  otherCourse: "Also at the Academy",
};

/* ---------------------------------------------------------------------------
   Gallery (site plan, section 7)
--------------------------------------------------------------------------- */

export type GalleryCategory = ServiceSlug | "academy";

export interface GalleryItem extends OwnImageAsset {
  category: GalleryCategory;
  caption?: string;
}

/**
 * Gallery photographs. Empty until photography is supplied. No client faces
 * or before/after images without written consent. Captions describe what is
 * shown, never client names.
 */
export const gallery: GalleryItem[] = [];

export const galleryFilters: { slug: GalleryCategory; label: string }[] = [
  ...serviceCategories.map((category) => ({ slug: category.slug, label: category.name })),
  { slug: "academy", label: "Academy" },
];

// DRAFT COPY - client approval needed
export const galleryPage = {
  intro: {
    eyebrow: "Gallery",
    heading: "Our work",
    body: "Recent work from our team.",
  } satisfies PageCopy,
  filtersLabel: "Filter our work",
  all: "All",
  empty: "New photographs are on the way.",
  emptyBody: "In the meantime, see what we offer or book a visit.",
  /** A shared ?service= link for a filter with no photographs yet. */
  filterEmpty: "No photographs here yet.",
  seeAll: "See all our work",
  /** Tile button label: "View larger: {alt}". */
  viewLarger: "View larger",
  lightbox: {
    label: "Photo viewer",
    close: "Close",
    previous: "Previous photo",
    next: "Next photo",
    /** "3 of 12" */
    of: "of",
  },
};

/* ---------------------------------------------------------------------------
   Other pages (site plan, section 7)
--------------------------------------------------------------------------- */

// DRAFT COPY - client approval needed
export const locationsPage: PageCopy = {
  eyebrow: "Locations",
  heading: "Visit us in Ikorodu",
  body: "Two locations, the same Kikiewa.",
};

// DRAFT COPY - client approval needed
export const bookPage = {
  intro: {
    eyebrow: "Appointments",
    heading: "Book an appointment",
    body: "Choose your treatment and a time that suits you. We'll confirm on WhatsApp.",
  } satisfies PageCopy,
  /** Step headings (site plan, section 7) and their short progress labels. */
  steps: [
    { heading: "What would you like?", short: "Service" },
    { heading: "Which location suits you?", short: "Location" },
    { heading: "Preferred date & time", short: "Date & time" },
    { heading: "Your details", short: "Details" },
    { heading: "Review & send", short: "Review" },
  ],
  progressLabel: "Booking progress",
  /** "Step 2 of 5" */
  stepWord: "Step",
  ofWord: "of",
  completed: "completed",
  continue: "Continue",
  back: "Back",
  change: "Change",
  /** Shown before the form has loaded. */
  loading: "Loading the booking form…",
  noscript: "The booking form needs JavaScript. You can book on WhatsApp or by phone instead.",
  service: {
    categoryLegend: "Choose a service",
    treatmentLegend: "Choose a treatment",
    notSure: "Not sure yet",
    notSureHint: "We'll help you choose when we confirm.",
    menuComing: "We'll talk you through the menu when we confirm your booking.",
    consultationNote: "This starts with a consultation. We'll book that first.",
  },
  location: {
    legend: "Choose a location",
    hint: "Both offer every service. Choose whichever is closer.",
  },
  dateTime: {
    dateLegend: "Preferred date",
    timeLegend: "Preferred time",
    hint: "These are your preferred times. We'll confirm availability on WhatsApp.",
    /** Shown while the location's opening hours are TBC. */
    exampleTimes: "Example times until opening hours are confirmed",
    chooseDateFirst: "Choose a date to see times.",
    noTimes: "No times left on this day. Please choose another date.",
    today: "Today",
    tomorrow: "Tomorrow",
  },
  details: {
    name: "Your name",
    phone: "Phone number",
    phoneHint: "A Nigerian number, starting with 0 or +234. We'll reply on WhatsApp.",
    email: "Email",
    notes: "Anything we should know?",
    notesHint: "For example, a style you'd like, or anything about your skin.",
    optional: "optional",
    /** Where details are kept until sent. */
    privacyNote: "Your details stay in this browser tab until you send them.",
  },
  review: {
    summaryHeading: "Your booking",
    /** The summary panel's value for a choice not made yet. */
    notChosen: "Not chosen yet",
    service: "Service",
    location: "Location",
    dateTime: "Preferred time",
    name: "Name",
    phone: "Phone",
    email: "Email",
    notes: "Notes",
    consent: "I agree to Kikiewa using these details to arrange my appointment.",
    policiesBefore: "Read our ",
    bookingPolicy: "booking policy",
    policiesAnd: " and ",
    privacy: "privacy policy",
    policiesAfter: ".",
    send: "Send on WhatsApp",
    sendNote: "WhatsApp opens with your request filled in. Nothing is sent until you press send there.",
  },
  errors: {
    summary: "Please check the following",
    service: "Choose a service.",
    location: "Choose a location.",
    date: "Choose a preferred date.",
    time: "Choose a preferred time.",
    name: "Enter your name.",
    phoneRequired: "Enter your phone number.",
    phoneInvalid: "Enter a Nigerian mobile number: 11 digits starting with 0, or +234 and 10 digits.",
    email: "Enter a valid email address, or leave it blank.",
    consent: "Tick the box to agree before sending.",
  },
  sent: {
    heading: "Your request is ready to send",
    body: "WhatsApp should have opened with your request filled in. Press send there and we'll reply to confirm your appointment.",
    reopen: "Open WhatsApp again",
    /** While the WhatsApp number is TBC: */
    fallbackHeading: "Almost there",
    fallbackBody: "Online requests open once our WhatsApp number is confirmed. For now, please contact us with the details below.",
    fallbackCta: "Contact us",
    another: "Make another booking",
  },
  callHeading: "Prefer to talk?",
  callBody: "Call us and we'll book you in.",
};

/**
 * The booking request as it reaches WhatsApp. One line per detail; empty
 * optional lines are left out. Keep it short: it is read on a phone.
 */
// DRAFT COPY - client approval needed
export const bookingMessage = {
  greeting: "Hello Kikiewa, I'd like to request an appointment.",
  service: "Service",
  category: "Category",
  helpChoose: "Not sure yet, please help me choose",
  location: "Location",
  preferred: "Preferred",
  name: "Name",
  phone: "Phone",
  email: "Email",
  notes: "Notes",
  /** Last line of every booking message, so the client can tell which
      bookings came from the website. */
  signature: "Sent from kikiewa.com",
} as const;

export type ContactTopic = "services" | "academy" | "other";

// DRAFT COPY - client approval needed
export const contactPage = {
  intro: {
    eyebrow: "Contact",
    heading: "Contact us",
    body: "The quickest way to reach us is WhatsApp.",
  } satisfies PageCopy,
  phoneLabel: "Phone",
  whatsappLabel: "WhatsApp",
  emailLabel: "Email",
  locationsHeading: "Our locations",
  form: {
    eyebrow: "Message us",
    heading: "Send us a message",
    body: "Write your message here and we'll open WhatsApp with it ready to send.",
    topicLegend: "What's it about?",
    topics: [
      { value: "services", label: "Services" },
      { value: "academy", label: "Academy" },
      { value: "other", label: "Something else" },
    ] as { value: ContactTopic; label: string }[],
    name: "Your name",
    phone: "Phone number",
    phoneHint: "A Nigerian number, starting with 0 or +234.",
    message: "Your message",
    send: "Send on WhatsApp",
    privacyBefore: "We use your details only to reply. See our ",
    privacyLink: "privacy policy",
    privacyAfter: ".",
    /** Shown while the WhatsApp number is TBC. */
    whatsappTbc: "WhatsApp number to be confirmed. For now, please call or visit either location.",
    opened: "WhatsApp should have opened with your message. Press send there and we'll reply.",
    reopen: "Open WhatsApp again",
    errors: {
      summary: "Please check the following",
      topic: "Choose what your message is about.",
      name: "Enter your name.",
      phoneRequired: "Enter your phone number.",
      phoneInvalid: "Enter a Nigerian mobile number: 11 digits starting with 0, or +234 and 10 digits.",
      message: "Enter your message.",
    },
  },
  /** The WhatsApp message: greeting, then labelled lines. */
  message: {
    greeting: "Hello Kikiewa.",
    topic: "About",
    name: "Name",
    phone: "Phone",
  },
};

/**
 * Policy pages (site plan, section 7: headings only, content from the
 * client). Each section's body is TBC until supplied: previews show
 * "To be supplied", production hides the empty block, and the page stays
 * noindex while any section is TBC.
 */
export type PolicySection = { heading: string; paragraphs: OrTBC<string[]> };
export type PolicyPage = { intro: PageCopy; sections: PolicySection[] };

// DRAFT COPY - client approval needed (headings; the text comes from the client)
export const legalPages = {
  bookingPolicy: {
    intro: {
      eyebrow: "Booking policy",
      heading: "Booking policy",
      body: "How booking, rescheduling and cancellation work at Kikiewa.",
    },
    sections: [
      { heading: "Booking and confirmation", paragraphs: TBC },
      { heading: "Payment", paragraphs: TBC },
      { heading: "Rescheduling", paragraphs: TBC },
      { heading: "Cancellations", paragraphs: TBC },
      { heading: "Late arrivals and missed appointments", paragraphs: TBC },
      { heading: "Aesthetic consultations", paragraphs: TBC },
      { heading: "Questions about your booking", paragraphs: TBC },
    ],
  } satisfies PolicyPage,
  privacy: {
    intro: {
      eyebrow: "Privacy",
      heading: "Privacy policy",
      body: "How we collect, use and protect your personal information.",
    },
    sections: [
      { heading: "Who we are", paragraphs: TBC },
      { heading: "What we collect", paragraphs: TBC },
      { heading: "How we use your information", paragraphs: TBC },
      { heading: "WhatsApp and other services we use", paragraphs: TBC },
      { heading: "How long we keep it", paragraphs: TBC },
      { heading: "Your rights", paragraphs: TBC },
      { heading: "Contact us about your data", paragraphs: TBC },
    ],
  } satisfies PolicyPage,
  /** The policy text itself must come from the client. */
  pending: "The full policy is being prepared and will be published here.",
  /** Previews only, in place of each section's text. */
  toBeSupplied: "To be supplied",
};

// DRAFT COPY - client approval needed
export const notFoundPage = {
  eyebrow: "Page not found",
  heading: "We couldn't find that page.",
  body: "It may have moved. These will get you back on track.",
  links: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Book", href: bookingHref },
  ] as NavLink[],
};
