import { photoSlots, type OwnSlotId, type PhotoSlot, type PhotoSlotId } from "@/data/photo-slots";
import { shootPhotos } from "@/data/photos.generated";
import type { GalleryCategory, GalleryItem, ImageAsset, ImageSlot, OwnImageAsset } from "@/data/site";

/**
 * Resolves photo slots (data/photo-slots.ts) to images, in this order:
 *
 * 1. the shoot photo (public/images/shoot, listed in data/photos.generated.ts
 *    by `npm run photos:import`),
 * 2. the slot's approved stock stand-in, only where the slot has one,
 * 3. nothing: the frame shows the designed placeholder.
 *
 * Own-work slots (OwnSlotId: Our work, classes, branches, About, products,
 * team) never fall back to stock: they take `ownPhoto`, whose type only
 * returns final photographs.
 */

const byId = new Map<string, PhotoSlot>(photoSlots.map((slot) => [slot.id, slot]));

function slotOf(id: PhotoSlotId): PhotoSlot {
  const slot = byId.get(id);
  if (!slot) throw new Error(`Unknown photo slot: ${id}`);
  return slot;
}

/** The shoot photo for any slot name (fixed or patterned), if imported. */
function shoot(id: string, alt: string): OwnImageAsset | undefined {
  const file = shootPhotos[id];
  return file ? { ...file, alt } : undefined;
}

/** True when the shoot photo for this slot has been imported. */
export function hasShootPhoto(id: string): boolean {
  return id in shootPhotos;
}

/** Shoot photo, then approved stock (where the slot allows it), else undefined. */
export function photo(id: PhotoSlotId): ImageAsset | undefined {
  const slot = slotOf(id);
  return shoot(id, slot.alt) ?? ("stock" in slot ? slot.stock : undefined);
}

/** The service page hero: the shoot cover, else the hero stand-in, else the card stand-in. */
export function heroPhoto(id: PhotoSlotId): ImageAsset | undefined {
  const slot = slotOf(id);
  return shoot(id, slot.alt) ?? ("stockHero" in slot ? slot.stockHero : undefined) ?? photo(id);
}

/** An own-work slot: the shoot photo or nothing. Never stock. */
export function ownPhoto(id: OwnSlotId): OwnImageAsset | undefined {
  return shoot(id, slotOf(id).alt);
}

/** A slot as an ImageSlot (alt, placeholder caption, resolved image). */
export function imageSlot(id: PhotoSlotId): ImageSlot {
  const slot = slotOf(id);
  return { alt: slot.alt, caption: slot.caption, image: photo(id) };
}

/** Same, for an own-work slot. */
export function ownImageSlot(id: OwnSlotId): ImageSlot & { image?: OwnImageAsset } {
  const slot = slotOf(id);
  return { alt: slot.alt, caption: slot.caption, image: ownPhoto(id) };
}

/** The phone crop of a hero slide (hero-01 -> hero-01-mobile), if imported. */
export function heroMobilePhoto(id: "hero-01" | "hero-02" | "hero-03" | "hero-04"): OwnImageAsset | undefined {
  return ownPhoto(`${id}-mobile`);
}

/** "Glow Serum" or "glow-serum" -> "glow-serum". */
export function slotName(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** photoshoot/product-<slug>.jpg */
export function productPhoto(slug: string, name: string): OwnImageAsset | undefined {
  return shoot("product-" + slotName(slug), `${name}, a Kikiewa product`);
}

/** photoshoot/team-<firstname>.jpg */
export function teamPhoto(name: string, role: string): OwnImageAsset | undefined {
  const first = name.trim().split(/\s+/)[0] ?? name;
  return shoot("team-" + slotName(first), `${name}, ${role} at Kikiewa, Ikorodu`);
}

/**
 * Every shoot photo for /gallery, grouped in filter order (services, then
 * Academy, then Branches), uncategorised photos last. Phone crops,
 * portraits and the shop are left out (no `gallery` on their slot).
 */
export function galleryPhotos(order: GalleryCategory[]): GalleryItem[] {
  const rank = (category: GalleryCategory | undefined) =>
    category === undefined ? order.length : order.indexOf(category);
  return photoSlots
    .flatMap((slot): GalleryItem[] => {
      if (!("gallery" in slot)) return [];
      const image = shoot(slot.id, slot.alt);
      if (!image) return [];
      const category = slot.gallery === "all" ? undefined : slot.gallery;
      return [{ ...image, ...(category ? { category } : {}) }];
    })
    .map((item, index) => ({ item, index }))
    .sort((a, b) => rank(a.item.category) - rank(b.item.category) || a.index - b.index)
    .map(({ item }) => item);
}
