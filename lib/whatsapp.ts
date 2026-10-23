/**
 * WhatsApp deep links.
 *
 * The business WhatsApp number is not confirmed yet (see `TBC.whatsapp` in
 * data/site.ts), so this helper refuses to build a wa.me link out of a
 * placeholder. Anything that is not a usable international number falls back
 * to the contact page, which means no broken wa.me links can ship while the
 * number is still a bracketed placeholder.
 */

/** Where a WhatsApp action points when the number is not usable yet. */
export const WHATSAPP_FALLBACK_HREF = "/contact";

/** Shortest plausible international subscriber number, country code included. */
const MIN_DIGITS = 8;

/**
 * True when `number` is a confirmed, dialable international number rather than
 * a placeholder such as "[WhatsApp number to be confirmed]".
 */
export function isUsableWhatsAppNumber(number: string | undefined): boolean {
  if (!number) return false;
  // Bracketed placeholders and anything with letters are not phone numbers.
  if (/[[\]a-z]/i.test(number)) return false;
  return normaliseNumber(number).length >= MIN_DIGITS;
}

/** Strips spaces, punctuation and any leading `+` or `00` international prefix. */
function normaliseNumber(number: string): string {
  const digits = number.replace(/\D/g, "");
  return digits.startsWith("00") ? digits.slice(2) : digits;
}

/**
 * Builds a wa.me link for `number`, pre-filled with `message`.
 *
 * Returns {@link WHATSAPP_FALLBACK_HREF} when the number is still a
 * placeholder, so callers can use the result as an href unconditionally.
 */
export function whatsappLink(number: string, message?: string): string {
  if (!isUsableWhatsAppNumber(number)) return WHATSAPP_FALLBACK_HREF;

  const link = `https://wa.me/${normaliseNumber(number)}`;
  return message ? `${link}?text=${encodeURIComponent(message)}` : link;
}
