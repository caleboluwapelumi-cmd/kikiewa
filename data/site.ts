import type { IconName } from "@/components/Icon";

/**
 * Single source of content for the site.
 *
 * Anything not yet verified with the client is written as a bracketed
 * placeholder, per the content rules in reference/design-tokens.md:
 * no invented credentials, statistics, prices, treatment claims or
 * testimonials.
 */

export const TBC = {
  licence: "[Licence details to be confirmed]",
  accreditation: "[Accreditation to be confirmed]",
  supervision: "[Supervision details to be confirmed]",
  treatments: "[Treatment list to be confirmed]",
  protocol: "[Protocol details to be confirmed]",
  duration: "[Duration to be confirmed]",
  hours: "[Opening hours to be confirmed]",
  phone: "[Phone number to be confirmed]",
  email: "[Email address to be confirmed]",
  address: "[Street address to be confirmed]",
  entity: "[Registered entity details to be confirmed]",
  cohort: "[Term / month to be confirmed]",
  whatsapp: "[WhatsApp number to be confirmed]",
  treatmentDetails: "[Treatment details to be confirmed]",
  aftercare: "[Aftercare protocol to be confirmed]",
  map: "[Map embed to be added]",
  practitioners: "[Practitioner credentials to be confirmed]",
  services: "[Service list to be confirmed]",
} as const;

export const site = {
  name: "Kikiewa",
  tagline: "Aesthetics • Lagos",
  city: "Lagos, Nigeria",
  copyrightYear: 2025,
} as const;

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Salon & Spa", href: "/salon-spa" },
  { label: "Medical Spa", href: "/medical-spa" },
  { label: "Beauty Institute", href: "/beauty-institute" },
  { label: "Locations", href: "/locations" },
  { label: "Contact", href: "/contact" },
];

export const bookingHref = "/book";

export const hero = {
  eyebrow: "Clinical Rigour • Restorative Wellness",
  heading:
    "Elevated beauty, clinical precision, and transformative aesthetic wellness in Lagos.",
  body: "A multidisciplinary sanctuary uniting bespoke salon rituals, medical spa treatments, and professional aesthetic education.",
  primaryCta: { label: "Book an appointment", href: bookingHref },
  secondaryCta: { label: "Explore services", href: "#divisions" },
  stats: [
    { value: "02 Locations", label: "Ebute and Nitel" },
    { value: "Clinical Protocol", label: TBC.licence },
    { value: "Curriculum", label: TBC.accreditation },
  ],
  image: {
    caption: "Sanctuary Architecture",
    body: "Ebute & Nitel enclaves • Monolithic minimalism tailored for contemplative tranquility.",
    alt: "Editorial architectural photograph of the Kikiewa aesthetics sanctuary in Lagos",
  },
  badge: {
    title: "Clinical Premises",
    body: TBC.accreditation,
  },
} as const;

export type Division = {
  index: string;
  icon: IconName;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  imageAlt: string;
};

export const divisionsIntro = {
  eyebrow: "Pillars of Practice",
  heading: "Three Multidisciplinary Divisions",
  body: "Engineered to cater to personal rejuvenation, clinical dermatology, and vocational mastery within dedicated purpose-built spaces.",
} as const;

export const divisions: Division[] = [
  {
    index: "Division 01",
    icon: "spa",
    eyebrow: "Rituals • Restorative Care",
    title: "Salon & Spa",
    body: "Curated hair styling, wellness rituals, and rejuvenating restorative therapies crafted for calm.",
    cta: "Explore Salon & Spa",
    href: "/salon-spa",
    imageAlt:
      "Restorative scalp ritual and botanical hair conditioning at the Kikiewa salon",
  },
  {
    index: "Division 02",
    icon: "medical",
    eyebrow: "Dermal Care • " + TBC.supervision,
    title: "Medical Spa & Makeover",
    body: "Skin rejuvenation, dermal therapies, and signature artistic makeovers.",
    cta: "Explore Medical Spa",
    href: "/medical-spa",
    imageAlt: "Minimalist clinical treatment room with soft amber lighting",
  },
  {
    index: "Division 03",
    icon: "school",
    eyebrow: "Vocational Diploma • " + TBC.accreditation,
    title: "Beauty Institute",
    body: "Diploma curricula and masterclasses mentoring the next generation of aesthetic practitioners.",
    cta: "View Academic Programs",
    href: "/beauty-institute",
    imageAlt: "Professional beauty and dermal education training studio",
  },
];

export type LocationDetail = { icon: IconName; label: string; value: string };

export type Location = {
  id: string;
  badge: string;
  icon: IconName;
  title: string;
  body: string;
  details: LocationDetail[];
  primaryCta: NavLink;
  directionsHref: string;
};

export const locationsIntro = {
  eyebrow: "Physical Enclaves",
  heading: "Choose Your Location",
  body: "Two purpose-built spaces across Lagos dedicated to your aesthetic journey.",
} as const;

export const ebuteLocation: Location = {
  id: "ebute",
  badge: "Salon • Spa Suites",
  icon: "pin",
  title: "Ebute Branch — Salon & Spa",
  body:
    "A restorative sanctuary configured for hair rituals and quiet body treatments away from city cadence. " +
    TBC.treatments,
  details: [
    {
      icon: "home",
      label: "Address",
      value: TBC.address + ", Ebute, " + site.city,
    },
    { icon: "clock", label: "Operating Hours", value: TBC.hours },
    { icon: "phone", label: "Contact & Concierge", value: TBC.phone },
  ],
  primaryCta: { label: "Book at Ebute", href: bookingHref + "?location=ebute" },
  directionsHref: "/locations/ebute",
};

/** The clinical practice. Read by the home page and by /medical-spa. */
export const nitelLocation: Location = {
  id: "nitel",
  badge: "Clinical Spa • Institute",
  icon: "hospital",
  title: "Nitel Branch — Medical Spa & Makeover",
  body:
    "Consultations, dermal therapies, and institute learning labs. " +
    TBC.treatments,
  details: [
    {
      icon: "home",
      label: "Address",
      value: TBC.address + ", Nitel, " + site.city,
    },
    { icon: "clock", label: "Operating Hours", value: TBC.hours },
    { icon: "phone", label: "Direct Desk", value: TBC.phone },
  ],
  primaryCta: {
    label: "Schedule Consultation",
    href: bookingHref + "?location=nitel",
  },
  directionsHref: "/locations/nitel",
};

export type LocationBlockCopy = {
  eyebrow: string;
  heading: string;
  body: string;
  mapAlt: string;
  mapCaption: string;
  whatsappLabel: string;
  whatsappMessage: string;
  /** Shown after the placeholder number while `TBC.whatsapp` is unconfirmed. */
  fallbackNote: string;
};

export const locations: Location[] = [ebuteLocation, nitelLocation];

export type CredibilityItem = {
  icon: IconName;
  title: string;
  body: string;
  standard: string;
};

export const credibilityIntro = {
  eyebrow: "Assurance & Governance",
  heading: "Institutional Rigor and Standards",
} as const;

export const credibility: CredibilityItem[] = [
  {
    icon: "verified",
    title: "Clinical Facility",
    body: "Purpose-built aesthetics establishment in Lagos. " + TBC.licence,
    standard: "Standard 01",
  },
  {
    icon: "badge",
    title: "Practitioners & Staff",
    body: "Dermal therapists and cosmetic specialists. " + TBC.licence,
    standard: "Standard 02",
  },
  {
    icon: "sanitizer",
    title: "Hygiene Protocol",
    body:
      "Sterilisation and hygiene procedures across both practices. " +
      TBC.protocol,
    standard: "Standard 03",
  },
  {
    icon: "book",
    title: "Institute Curriculum",
    body:
      "Structured training syllabus for aspiring practitioners. " +
      TBC.accreditation,
    standard: "Standard 04",
  },
];

export type Programme = { icon: IconName; name: string; meta: string };

export const enrolment: {
  flag: string;
  heading: string;
  body: string;
  primaryCta: NavLink;
  secondaryCta: NavLink;
  programmesTitle: string;
  programmes: Programme[];
} = {
  flag: "Next cohort commencing " + TBC.cohort,
  heading: "Shape the Future of Aesthetic Excellence",
  body: "Admissions are open for upcoming cohorts in clinical aesthetics, advanced makeup artistry, and spa management.",
  primaryCta: { label: "Apply for Next Cohort", href: "/beauty-institute/apply" },
  secondaryCta: {
    label: "Download Prospectus",
    href: "/beauty-institute/prospectus",
  },
  programmesTitle: "Academic Programmes",
  programmes: [
    { icon: "notes", name: "Clinical Cosmetology Diploma", meta: TBC.duration },
    { icon: "brush", name: "Bridal & Editorial Artistry", meta: TBC.duration },
    { icon: "spa", name: "Spa Operations & Therapy", meta: TBC.duration },
  ],
};

export const ctaBand = {
  eyebrow: "Personalized Appointments",
  heading: "Experience Kikiewa in Person",
  body: "Reserve your consultation or ritual with our multidisciplinary specialists today.",
  cta: { label: "Book an appointment", href: bookingHref },
} as const;

export const footer = {
  blurb:
    "Clinical aesthetics, restorative wellness therapies, and beauty education rooted in Lagos, Nigeria. Architectural discipline meeting holistic dermatology.",
  licenceChip: TBC.licence,
  divisionLinks: [
    { label: "Salon & Spa", href: "/salon-spa" },
    { label: "Medical Spa & Makeover", href: "/medical-spa" },
    { label: "Beauty Institute", href: "/beauty-institute" },
    { label: "Skin Diagnostic Protocol", href: "/skin-diagnostic" },
  ] as NavLink[],
  practices: [
    {
      name: "Ebute Practice",
      detail: "Salon & Spa · " + TBC.address + ", Ebute, Lagos",
    },
    {
      name: "Nitel Enclave",
      detail: "Medical Spa & Makeover · " + TBC.address + ", Nitel, Lagos",
    },
  ],
  inquiries: {
    label: "Concierge & Appointments",
    email: TBC.email,
    hours: TBC.hours,
  },
  legalLinks: [
    { label: "Licensing & Compliance", href: "/licensing" },
    { label: "Privacy Policy", href: "/privacy" },
  ] as NavLink[],
} as const;

/* ---------------------------------------------------------------------------
   /medical-spa
   Clinical register: no before/after imagery, result promises, statistics,
   testimonials or prices. Anything that would be a claim about scope of
   practice, outcome or credentials stays a bracketed placeholder.
--------------------------------------------------------------------------- */

export type Treatment = { icon: IconName; title: string; body: string };
export type ConsultationStep = {
  step: string;
  icon: IconName;
  title: string;
  body: string;
};
export type Credential = { icon: IconName; label: string; value: string };

export const medicalSpa: {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    cta: NavLink;
    image: { alt: string };
  };
  intro: { body: string; licenceLabel: string; licenceValue: string; note: string };
  treatmentsIntro: { eyebrow: string; heading: string; body: string };
  treatments: Treatment[];
  pathway: { eyebrow: string; heading: string; body: string };
  steps: ConsultationStep[];
  credentialsIntro: { eyebrow: string; heading: string; body: string };
  credentials: Credential[];
  location: LocationBlockCopy;
} = {
  meta: {
    title: "Medical Spa & Makeover",
    description:
      "Licensed medical aesthetics and makeover services at the Kikiewa Nitel practice in Lagos. Every treatment begins with a consultation.",
  },

  hero: {
    eyebrow: "Division 02 • Medical Spa & Makeover",
    heading: "Licensed medical aesthetics, practised with restraint.",
    body: "Injectable, skin and facial aesthetic services are carried out at our Nitel practice, and every plan begins with a consultation rather than a recommendation.",
    cta: {
      label: "Book a consultation",
      href: bookingHref + "?location=nitel&service=medical-spa",
    },
    image: {
      alt: "Consultation room at the Kikiewa Nitel medical spa practice in Lagos",
    },
  },

  intro: {
    body: "The medical spa shares the Nitel premises with our makeover studio. Services are delivered under clinical protocol by trained practitioners, within a scope of practice we will publish here in full once it is confirmed. What is appropriate for you is decided in consultation, not in advance.",
    licenceLabel: "Licensing",
    licenceValue: TBC.licence,
    note: "This page makes no claim about scope of practice, suitability or outcome until licence and practitioner records are verified.",
  },

  treatmentsIntro: {
    eyebrow: "Scope of Service",
    heading: "Treatment Areas",
    body: "Six areas of practice at the Nitel premises. Specifics, suitability and sequencing are set out at consultation.",
  },

  treatments: [
    { icon: "syringe", title: "Injectables", body: TBC.treatmentDetails },
    { icon: "spa", title: "Skin Treatments", body: TBC.treatmentDetails },
    { icon: "brush", title: "Makeup & Makeover", body: TBC.treatmentDetails },
    { icon: "sparkle", title: "Bridal Makeover", body: TBC.treatmentDetails },
    { icon: "face", title: "Facial Aesthetics", body: TBC.treatmentDetails },
    { icon: "notes", title: "Consultations", body: TBC.treatmentDetails },
  ],

  pathway: {
    eyebrow: "How Treatment Begins",
    heading: "Consultation First",
    body: "Nothing is administered on a first visit. The sequence below applies to every medical spa service.",
  },

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
      body: "Treatment at the Nitel practice, followed by written aftercare and a review appointment. " + TBC.aftercare,
    },
  ],

  credentialsIntro: {
    eyebrow: "Licence & Credentials",
    heading: "What We Will Publish Here",
    body: "Kikiewa lists credentials only once they are verified. Each record below is a placeholder until then, and documentation can be requested at your consultation.",
  },

  credentials: [
    { icon: "verified", label: "Practitioner licensing", value: TBC.licence },
    { icon: "badge", label: "Practitioner credentials", value: TBC.practitioners },
    { icon: "home", label: "Facility registration", value: TBC.entity },
    { icon: "medical", label: "Clinical supervision", value: TBC.supervision },
    { icon: "sanitizer", label: "Hygiene and sterilisation", value: TBC.protocol },
  ],

  location: {
    eyebrow: "The Practice",
    heading: "Where Treatment Takes Place",
    body: "Medical spa and makeover services are delivered at the Nitel practice only.",
    mapAlt: "Map showing the Kikiewa Nitel practice in Lagos",
    mapCaption: TBC.map,
    whatsappLabel: "Enquire on WhatsApp",
    whatsappMessage:
      "Hello Kikiewa, I would like to ask about a medical spa consultation at the Nitel practice.",
    fallbackNote: "Until it is, this enquiry opens our contact page.",
  },
};

/* ---------------------------------------------------------------------------
   /salon-spa
   Warmer register than /medical-spa, same restraint on facts: no prices,
   statistics, testimonials or service promises. Service lists, hours and
   contact details stay bracketed placeholders until the client confirms them.
--------------------------------------------------------------------------- */

export type ServiceCategory = { icon: IconName; title: string; body: string };
export type ExpectationPoint = { icon: IconName; title: string; body: string };
export type GalleryItem = { alt: string };

export const salonSpa: {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    cta: NavLink;
    image: { alt: string };
  };
  categoriesIntro: { eyebrow: string; heading: string; body: string };
  categories: ServiceCategory[];
  expectIntro: { eyebrow: string; heading: string; body: string };
  expectations: ExpectationPoint[];
  gallery: { eyebrow: string; heading: string; items: GalleryItem[] };
  location: LocationBlockCopy;
} = {
  meta: {
    title: "Salon & Spa",
    description:
      "Professional salon and spa care at the Kikiewa Ebute branch in Lagos. Hair, nails, skin, massage, grooming and event styling, by appointment.",
  },

  hero: {
    eyebrow: "Division 01 • Salon & Spa",
    heading: "Professional salon and spa care, in an unhurried room at Ebute.",
    body: "Our Ebute branch is a calm, welcoming space for hair, nails, skin and body care. You are seen by appointment, at your own pace, by a team that takes its time.",
    cta: {
      label: "Book an appointment",
      href: bookingHref + "?location=ebute&service=salon-spa",
    },
    image: {
      alt: "Styling and treatment room at the Kikiewa Ebute salon and spa in Lagos",
    },
  },

  categoriesIntro: {
    eyebrow: "What We Offer",
    heading: "Six Areas of Care",
    body: "Each area is looked after by our Ebute team. The full service list for every category is being confirmed with us and will be published here.",
  },

  categories: [
    { icon: "scissors", title: "Hair", body: TBC.services },
    { icon: "hand", title: "Nails", body: TBC.services },
    { icon: "face", title: "Skin & Facials", body: TBC.services },
    { icon: "spa", title: "Massage & Spa", body: TBC.services },
    { icon: "brush", title: "Grooming", body: TBC.services },
    { icon: "sparkle", title: "Bridal & Event Styling", body: TBC.services },
  ],

  expectIntro: {
    eyebrow: "Your Visit",
    heading: "What to Expect",
    body: "Three things hold true for every appointment at Ebute.",
  },

  expectations: [
    {
      icon: "badge",
      title: "Professional team",
      body: "You are looked after by trained salon and spa staff who do this work full time.",
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

  location: {
    eyebrow: "Visit Us",
    heading: "The Ebute Branch",
    body: "Salon and spa appointments are held at our Ebute branch. Message us and we will find a time that suits you.",
    mapAlt: "Map showing the Kikiewa Ebute salon and spa in Lagos",
    mapCaption: TBC.map,
    whatsappLabel: "Book on WhatsApp",
    whatsappMessage:
      "Hello Kikiewa, I would like to book a salon and spa appointment at Ebute.",
    fallbackNote: "Until it is, this booking opens our contact page.",
  },
};

/* ---------------------------------------------------------------------------
   /locations
   Both branches side by side. The cards read the same `locations` records as
   the home page, so addresses, hours and numbers stay in one place and stay
   bracketed until confirmed.
--------------------------------------------------------------------------- */

export const locationsPage: {
  meta: { title: string; description: string };
  eyebrow: string;
  heading: string;
  body: string;
} = {
  meta: {
    title: "Locations",
    description:
      "The two Kikiewa branches in Lagos: salon and spa at Ebute, medical spa, makeover and the Beauty Institute at Nitel.",
  },
  eyebrow: "Physical Enclaves",
  heading: "Our Two Lagos Branches",
  body: "Salon and spa care is delivered at Ebute, and medical spa, makeover and institute work at Nitel. Each branch lists its own address, hours and contact details below.",
};
