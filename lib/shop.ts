import { contact, primaryNav, products, sampleProducts, shopHref, whatsappMessages, type Product } from "@/data/site";
import { isProductionSite } from "@/lib/env";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * The shop is on when real products exist. Previews also turn it on with
 * three labelled sample products so the layout can be reviewed. In
 * production with no products it is off: hidden from the nav, footer and
 * sitemap, and /shop is a 404.
 *
 * TODO(phase 2): Paystack checkout alongside "Order on WhatsApp".
 */
export const shopEnabled = products.length > 0 || !isProductionSite;

/** True while previews show the sample products. */
export const showingSamples = products.length === 0 && !isProductionSite;

/** What the shop lists in this environment. */
export const shopProducts: Product[] = showingSamples ? sampleProducts : products;

export function productHref(product: Product): string {
  return shopHref + "/" + product.slug;
}

export function findProduct(slug: string): Product | undefined {
  return shopProducts.find((product) => product.slug === slug);
}

/** "Body care" -> "body-care", for ?category=. */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Filters, in first-seen order, built from the products present. */
export function productCategories(items: Product[]): { slug: string; label: string }[] {
  const seen = new Map<string, string>();
  for (const item of items) {
    const slug = categorySlug(item.category);
    if (!seen.has(slug)) seen.set(slug, item.category);
  }
  return [...seen].map(([slug, label]) => ({ slug, label }));
}

/** Up to three others: same category first, then the rest. */
export function relatedProducts(product: Product, limit = 3): Product[] {
  const others = shopProducts.filter((item) => item.slug !== product.slug);
  const same = others.filter((item) => item.category === product.category);
  const rest = others.filter((item) => item.category !== product.category);
  return [...same, ...rest].slice(0, limit);
}

/** "Hello Kikiewa, I'd like to order Glow Serum (30 ml). Sent from kikiewa.com" */
export function orderMessage(product: Product): string {
  return whatsappMessages.order
    .replace("{product}", product.name)
    .replace("{size}", product.size ? ` (${product.size})` : "");
}

/** The prefilled WhatsApp order link (or /contact while the number is TBC). */
export function orderHref(product: Product): string {
  return whatsappLink(contact.whatsapp, orderMessage(product));
}

/** The primary nav for this environment: Shop drops out while the shop is off. */
export const primaryNavItems = primaryNav.filter((item) => shopEnabled || item.href !== shopHref);
