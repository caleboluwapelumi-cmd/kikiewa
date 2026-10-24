import { isTBC, type OrTBC } from "@/data/site";

/**
 * tel: link for a confirmed phone number, or null while it is TBC or not a
 * dialable number, so no broken tel: links ship.
 */
export function telHref(phone: OrTBC<string> | undefined): string | null {
  if (!phone || isTBC(phone)) return null;
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.replace(/\D/g, "").length >= 7 ? `tel:${digits}` : null;
}
