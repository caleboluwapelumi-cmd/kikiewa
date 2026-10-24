import {
  serviceCategories,
  serviceMenus,
  type ServiceCategory,
  type ServiceItem,
} from "@/data/site";
import { confirmedInProduction } from "@/lib/env";

/**
 * What can be booked: each category's menu items (unconfirmed names are
 * shown on previews only), or the category itself as "help me choose".
 * Aesthetics books the consultation, never a treatment.
 */

export type ServiceChoice = {
  /** The value kept in ?service=. */
  slug: string;
  category: ServiceCategory;
  /** Undefined for "help me choose". */
  item?: ServiceItem;
  consultation: boolean;
};

/** Menu items that can be picked in this environment. */
export function bookableItems(category: ServiceCategory): ServiceItem[] {
  return confirmedInProduction(serviceMenus[category.slug]);
}

/** The consultation item every aesthetics booking starts with. */
function consultationItem(category: ServiceCategory): ServiceItem | undefined {
  return serviceMenus[category.slug].find((item) => item.requiresConsultation);
}

/** Resolves a ?service= value, or null when it matches nothing bookable. */
export function resolveService(slug: string | null | undefined): ServiceChoice | null {
  if (!slug) return null;

  const category = serviceCategories.find((entry) => entry.slug === slug);
  if (category) {
    const consultation = category.consultationLed ? consultationItem(category) : undefined;
    if (consultation) return { slug: consultation.slug, category, item: consultation, consultation: true };
    return { slug: category.slug, category, consultation: category.consultationLed };
  }

  for (const entry of serviceCategories) {
    const item = bookableItems(entry).find((candidate) => candidate.slug === slug);
    if (item) {
      return {
        slug: item.slug,
        category: entry,
        item,
        consultation: Boolean(item.requiresConsultation) || entry.consultationLed,
      };
    }
  }
  return null;
}
