import type { GalleryCategory, ImageAsset } from "./site";

/**
 * Every photograph position the shoot fills, one entry per filename in
 * reference/photoshoot.md (the shot list). Save a final photo as
 * photoshoot/<id>.jpg and run `npm run photos:import`: it lands in
 * public/images/shoot/<group>/<id>.jpg and data/photos.generated.ts, and the
 * site picks it up through lib/photos.ts.
 *
 * - `ownWork: true`: the shoot photo is Kikiewa's own (final, no credit, alt
 *   text says "at Kikiewa").
 * - `stock`: an approved stock photo (source "stock", credited in
 *   public/images/CREDITS.md) that stands in until the shoot photo arrives.
 *   Only display slots carry one: the hero slides and the service, academy
 *   and course covers. Slots showing Kikiewa's own work, places or people
 *   (Our work, classes, branches, About, products, team) never do: they show
 *   the designed placeholder instead (lib/photos.ts makes that a type error).
 * - `stockHero`: a second stand-in for the service page hero, when it should
 *   differ from the card (hair).
 * - `gallery`: where the photo files in /gallery. "all" shows under All only;
 *   no value leaves it out (phone crops, portraits, the shop).
 * - `optional`: not counted as missing (phone crops of the hero, shop cover).
 * - `caption`: what goes there, shown on placeholders in previews only.
 *
 * Products (product-<slug>) and team portraits (team-<firstname>) follow
 * patterns instead of fixed ids: see `slotPatterns`.
 *
 * Alt text never uses en or em dashes (check:seo).
 */

export type PhotoGroup = "hero" | "about" | "services" | "academy" | "branches" | "shop" | "team";
export type PhotoOrientation = "landscape" | "portrait";

/** An approved stock stand-in. */
type StockSource = Extract<NonNullable<ImageAsset["source"]>, "stock" | "stock-temp">;
export type StockImage = ImageAsset & { source: StockSource };

export type PhotoSlotDef = {
  id: string;
  group: PhotoGroup;
  orientation: PhotoOrientation;
  alt: string;
  caption: string;
  ownWork: true;
  optional?: boolean;
  gallery?: GalleryCategory | "all";
  stock?: StockImage;
  stockHero?: StockImage;
};

const L = "landscape";
const P = "portrait";

export const photoSlots = [
  /* 1. Home hero slider ------------------------------------------------- */
  {
    id: "hero-01",
    group: "hero",
    orientation: L,
    alt: "A client relaxing in a robe in a calm treatment room at Kikiewa, Ikorodu",
    caption: "Hero 1 · Client relaxing in a robe",
    ownWork: true,
    gallery: "all",
    stock: {
      src: "/images/home/hero-1.jpg",
      alt: "A candlelit steam room with warm lights over a stone bench",
      width: 2400,
      height: 1601,
      source: "stock",
    },
  },
  {
    id: "hero-02",
    group: "hero",
    orientation: L,
    alt: "A therapist giving a relaxed client a facial at Kikiewa, Ikorodu",
    caption: "Hero 2 · Facial in progress",
    ownWork: true,
    gallery: "facials",
    stock: {
      src: "/images/home/hero-2.jpg",
      alt: "A therapist giving a woman a facial with a handheld skincare device",
      width: 2400,
      height: 1600,
      source: "stock",
    },
  },
  {
    id: "hero-03",
    group: "hero",
    orientation: L,
    alt: "A client relaxing during a back massage at Kikiewa, Ikorodu",
    caption: "Hero 3 · Back massage",
    ownWork: true,
    gallery: "massage",
    stock: {
      src: "/images/home/hero-3.jpg",
      alt: "A woman relaxing with her eyes closed during a back massage",
      width: 2400,
      height: 1600,
      source: "stock",
    },
  },
  {
    id: "hero-04",
    group: "hero",
    orientation: L,
    alt: "A confident client with a finished look at Kikiewa, Ikorodu",
    caption: "Hero 4 · A finished look",
    ownWork: true,
    gallery: "all",
    stock: {
      src: "/images/home/hero-4.jpg",
      alt: "A smiling woman with her braids styled in a high, beaded updo",
      width: 2400,
      height: 1898,
      source: "stock",
    },
  },
  // Optional phone crops: used under 768px when present (art direction).
  { id: "hero-01-mobile", group: "hero", orientation: P, alt: "A client relaxing in a robe in a calm treatment room at Kikiewa, Ikorodu", caption: "Hero 1, phone crop", ownWork: true, optional: true },
  { id: "hero-02-mobile", group: "hero", orientation: P, alt: "A therapist giving a relaxed client a facial at Kikiewa, Ikorodu", caption: "Hero 2, phone crop", ownWork: true, optional: true },
  { id: "hero-03-mobile", group: "hero", orientation: P, alt: "A client relaxing during a back massage at Kikiewa, Ikorodu", caption: "Hero 3, phone crop", ownWork: true, optional: true },
  { id: "hero-04-mobile", group: "hero", orientation: P, alt: "A confident client with a finished look at Kikiewa, Ikorodu", caption: "Hero 4, phone crop", ownWork: true, optional: true },

  /* 2. About ------------------------------------------------------------ */
  { id: "about-founder", group: "about", orientation: P, alt: "Portrait of the founder of Kikiewa in the studio in Ikorodu", caption: "About · The founder", ownWork: true },
  { id: "about-team", group: "about", orientation: L, alt: "The Kikiewa team together at one of the Ikorodu branches", caption: "About · The team together", ownWork: true },
  { id: "about-space", group: "about", orientation: L, alt: "A calm, tidy treatment space at Kikiewa, Ikorodu", caption: "About · Inside Kikiewa", ownWork: true, gallery: "branches" },
  { id: "about-consultation", group: "about", orientation: L, alt: "A member of the Kikiewa team listening to a client during a consultation, Ikorodu", caption: "About · A consultation", ownWork: true, gallery: "all" },

  /* 3. Services: cover + three for "Our work" ---------------------------- */
  {
    id: "facials-cover",
    group: "services",
    orientation: L,
    alt: "A therapist giving a facial at Kikiewa, Ikorodu",
    caption: "Facials · Cover",
    ownWork: true,
    gallery: "facials",
    stock: {
      src: "/images/services/facials.jpg",
      alt: "A woman smoothing a dab of cream onto her cheek",
      width: 1600,
      height: 2400,
      source: "stock",
    },
  },
  { id: "facials-01", group: "services", orientation: P, alt: "A skin check before a facial at Kikiewa, Ikorodu", caption: "Our work · Facials · Skin check", ownWork: true, gallery: "facials" },
  { id: "facials-02", group: "services", orientation: P, alt: "A facial mask being applied at Kikiewa, Ikorodu", caption: "Our work · Facials · Mask applied", ownWork: true, gallery: "facials" },
  { id: "facials-03", group: "services", orientation: P, alt: "Glowing skin after a facial at Kikiewa, Ikorodu", caption: "Our work · Facials · Glowing skin", ownWork: true, gallery: "facials" },
  {
    id: "massage-cover",
    group: "services",
    orientation: L,
    alt: "A massage room ready for a treatment at Kikiewa, Ikorodu",
    caption: "Massage & Spa · Cover",
    ownWork: true,
    gallery: "massage",
    stock: {
      src: "/images/services/massage.jpg",
      alt: "A woman resting on a massage table beside warm stones, towels and a candle",
      width: 1600,
      height: 1036,
      source: "stock",
    },
  },
  { id: "massage-01", group: "services", orientation: P, alt: "A therapist's hands massaging a client's shoulders at Kikiewa, Ikorodu", caption: "Our work · Massage · Shoulders", ownWork: true, gallery: "massage" },
  { id: "massage-02", group: "services", orientation: P, alt: "Massage stones, oils and towels laid out at Kikiewa, Ikorodu", caption: "Our work · Massage · Stones and oils", ownWork: true, gallery: "massage" },
  { id: "massage-03", group: "services", orientation: P, alt: "A client resting calmly after a massage at Kikiewa, Ikorodu", caption: "Our work · Massage · Resting afterwards", ownWork: true, gallery: "massage" },
  {
    id: "aesthetics-cover",
    group: "services",
    orientation: L,
    alt: "A clean treatment room with a treatment bed and skin device at Kikiewa, Ikorodu",
    caption: "Aesthetics · Cover",
    ownWork: true,
    gallery: "aesthetics",
    stock: {
      src: "/images/services/aesthetics.jpg",
      alt: "A clean, white skincare treatment room with a freshly made treatment bed",
      width: 1600,
      height: 1988,
      source: "stock",
    },
  },
  { id: "aesthetics-01", group: "services", orientation: P, alt: "A skin analysis consultation at Kikiewa, Ikorodu", caption: "Our work · Aesthetics · Skin analysis", ownWork: true, gallery: "aesthetics" },
  { id: "aesthetics-02", group: "services", orientation: P, alt: "A device skin treatment at Kikiewa, Ikorodu", caption: "Our work · Aesthetics · Device treatment", ownWork: true, gallery: "aesthetics" },
  { id: "aesthetics-03", group: "services", orientation: P, alt: "Skincare products and tools neatly arranged at Kikiewa, Ikorodu", caption: "Our work · Aesthetics · Products and tools", ownWork: true, gallery: "aesthetics" },
  {
    id: "hair-cover",
    group: "services",
    orientation: L,
    alt: "A stylist at work on a client's hair at Kikiewa, Ikorodu",
    caption: "Hair & Barbing · Cover",
    ownWork: true,
    gallery: "hair",
    stock: {
      src: "/images/services/hair.jpg",
      alt: "A close view of hands braiding neat rows into dark hair",
      width: 1600,
      height: 2000,
      source: "stock",
    },
    stockHero: {
      src: "/images/services/hair-barber.jpg",
      alt: "A barber shaping a man's curly high top fade",
      width: 1600,
      height: 1840,
      source: "stock",
    },
  },
  { id: "hair-01", group: "services", orientation: P, alt: "A finished hairstyle seen from the side at Kikiewa, Ikorodu", caption: "Our work · Hair · Finished style", ownWork: true, gallery: "hair" },
  { id: "hair-02", group: "services", orientation: P, alt: "Neat braids in a protective style at Kikiewa, Ikorodu", caption: "Our work · Hair · Braids", ownWork: true, gallery: "hair" },
  { id: "hair-03", group: "services", orientation: P, alt: "A barber giving a clean cut at Kikiewa, Ikorodu", caption: "Our work · Hair · Barbing", ownWork: true, gallery: "hair" },
  {
    id: "nails-cover",
    group: "services",
    orientation: L,
    alt: "A manicure in progress at Kikiewa, Ikorodu",
    caption: "Nails · Cover",
    ownWork: true,
    gallery: "nails",
    stock: {
      src: "/images/services/nails.jpg",
      alt: "A smiling woman with short nails in white polish, resting her hand at her chin",
      width: 1600,
      height: 2400,
      source: "stock",
    },
  },
  { id: "nails-01", group: "services", orientation: P, alt: "A finished manicure, close up, at Kikiewa, Ikorodu", caption: "Our work · Nails · Finished manicure", ownWork: true, gallery: "nails" },
  { id: "nails-02", group: "services", orientation: P, alt: "Nail art detail at Kikiewa, Ikorodu", caption: "Our work · Nails · Nail art", ownWork: true, gallery: "nails" },
  { id: "nails-03", group: "services", orientation: P, alt: "A finished pedicure at Kikiewa, Ikorodu", caption: "Our work · Nails · Pedicure", ownWork: true, gallery: "nails" },
  {
    id: "makeup-cover",
    group: "services",
    orientation: L,
    alt: "A makeup artist at work at Kikiewa, Ikorodu",
    caption: "Makeup · Cover",
    ownWork: true,
    gallery: "makeup",
    stock: {
      src: "/images/services/makeup.jpg",
      alt: "A woman with shimmering eyeshadow lining her lips with a pencil",
      width: 1600,
      height: 2400,
      source: "stock",
    },
  },
  { id: "makeup-01", group: "services", orientation: P, alt: "A finished glam makeup look at Kikiewa, Ikorodu", caption: "Our work · Makeup · Glam look", ownWork: true, gallery: "makeup" },
  { id: "makeup-02", group: "services", orientation: P, alt: "A bridal makeup look at Kikiewa, Ikorodu", caption: "Our work · Makeup · Bridal look", ownWork: true, gallery: "makeup" },
  { id: "makeup-03", group: "services", orientation: P, alt: "Makeup brushes and a palette on the vanity at Kikiewa, Ikorodu", caption: "Our work · Makeup · Brushes and palette", ownWork: true, gallery: "makeup" },

  /* 4. Academy ------------------------------------------------------------ */
  {
    id: "academy-cover",
    group: "academy",
    orientation: L,
    alt: "An instructor demonstrating to students at Kikiewa Academy, Ikorodu",
    caption: "Academy · Class in session",
    ownWork: true,
    gallery: "academy",
    stock: {
      src: "/images/academy/hero.jpg",
      alt: "A close view of hands painting nail polish onto another person's nails",
      width: 2400,
      height: 1600,
      source: "stock",
    },
  },
  { id: "academy-class-01", group: "academy", orientation: L, alt: "Students practising hair styling at Kikiewa Academy, Ikorodu", caption: "Inside our classes · Hair styling", ownWork: true, gallery: "academy" },
  { id: "academy-class-02", group: "academy", orientation: L, alt: "Students practising nails and makeup at Kikiewa Academy, Ikorodu", caption: "Inside our classes · Nails and makeup", ownWork: true, gallery: "academy" },
  { id: "academy-class-03", group: "academy", orientation: L, alt: "Students practising a facial at Kikiewa Academy, Ikorodu", caption: "Inside our classes · Facials and massage", ownWork: true, gallery: "academy" },
  { id: "academy-class-04", group: "academy", orientation: L, alt: "Students smiling with their certificates at Kikiewa Academy, Ikorodu", caption: "Inside our classes · Graduation", ownWork: true, gallery: "academy" },
  {
    id: "cosmetology-cover",
    group: "academy",
    orientation: P,
    alt: "A cosmetology student practising at Kikiewa Academy, Ikorodu",
    caption: "Academy · Cosmetology course",
    ownWork: true,
    gallery: "academy",
    stock: {
      src: "/images/academy/cosmetology.jpg",
      alt: "Hands with pink nails braiding a section of dark hair",
      width: 1600,
      height: 2000,
      source: "stock",
    },
  },
  {
    id: "aesthetics-course-cover",
    group: "academy",
    orientation: P,
    alt: "An aesthetics student practising a facial at Kikiewa Academy, Ikorodu",
    caption: "Academy · Aesthetics course",
    ownWork: true,
    gallery: "academy",
    stock: {
      src: "/images/academy/aesthetics.jpg",
      alt: "A therapist brushing a facial mask onto a woman's face",
      width: 1600,
      height: 1067,
      source: "stock",
    },
  },

  /* 5. Branches ------------------------------------------------------------ */
  { id: "ebute-exterior", group: "branches", orientation: L, alt: "The front of the Kikiewa Ebute branch, Ikorodu, with its sign", caption: "Ebute branch · Outside", ownWork: true, gallery: "branches" },
  { id: "ebute-interior", group: "branches", orientation: L, alt: "Inside the Kikiewa Ebute branch, Ikorodu", caption: "Ebute branch · Inside", ownWork: true, gallery: "branches" },
  { id: "nitel-exterior", group: "branches", orientation: L, alt: "The front of the Kikiewa Nitel branch, Ikorodu, with its sign", caption: "Nitel branch · Outside", ownWork: true, gallery: "branches" },
  { id: "nitel-interior", group: "branches", orientation: L, alt: "Inside the Kikiewa Nitel branch, Ikorodu", caption: "Nitel branch · Inside", ownWork: true, gallery: "branches" },

  /* 6. Shop (when products are confirmed) ---------------------------------- */
  { id: "shop-cover", group: "shop", orientation: L, alt: "Kikiewa skincare and beauty products styled together", caption: "Shop · All products together", ownWork: true, optional: true },
] as const satisfies readonly PhotoSlotDef[];

export type PhotoSlot = (typeof photoSlots)[number];
export type PhotoSlotId = PhotoSlot["id"];
/** Slots with an approved stock stand-in. */
export type StockSlotId = Extract<PhotoSlot, { stock: StockImage }>["id"];
/** Slots that show only Kikiewa's own photograph, else the placeholder. */
export type OwnSlotId = Exclude<PhotoSlotId, StockSlotId>;

/** Name patterns for slots that grow with the business. */
export const slotPatterns = [
  { prefix: "product-", group: "shop", orientation: P },
  { prefix: "team-", group: "team", orientation: P },
] as const satisfies readonly { prefix: string; group: PhotoGroup; orientation: PhotoOrientation }[];

/** Long edge of an imported photo, in pixels: heroes are full-bleed. */
export const longEdge: Record<PhotoGroup, number> = {
  hero: 2400,
  about: 1600,
  services: 1600,
  academy: 1600,
  branches: 1600,
  shop: 1600,
  team: 1600,
};
