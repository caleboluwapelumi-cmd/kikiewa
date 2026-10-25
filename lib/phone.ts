import { isTBC, type OrTBC } from "@/data/site";

/**
 * tel: link for a confirmed phone number, or null while it is TBC or not a
 * dialable number, so no broken tel: links ship. Nigerian numbers written
 * locally ("0706 621 2933") dial in international form (+2347066212933),
 * so the link also works from a phone registered abroad.
 */
export function telHref(phone: OrTBC<string> | undefined): string | null {
  const international = phoneE164(phone);
  return international ? `tel:${international}` : null;
}

/** "+2347066212933" for a confirmed number, or null. Used by tel: links and JSON-LD. */
export function phoneE164(phone: OrTBC<string> | undefined): string | null {
  if (!phone || isTBC(phone)) return null;
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.replace(/\D/g, "").length < 7) return null;
  if (/^0\d{10}$/.test(digits)) return "+234" + digits.slice(1);
  return digits;
}
