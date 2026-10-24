/**
 * Form validation shared by /book and /contact. Each check returns a clean
 * value or null, so callers decide which message to show.
 */

/**
 * A Nigerian mobile number in E.164 form (+234XXXXXXXXXX), or null.
 *
 * Accepts the ways people write them: "0803 123 4567", "08031234567",
 * "+234 803 123 4567", "234-803-123-4567", and "+234 0803…" (the extra 0
 * is dropped). Mobile ranges start 70, 71, 80, 81, 90 or 91 after the
 * country code; WhatsApp needs a mobile.
 */
export function normaliseNigerianPhone(input: string): string | null {
  const compact = input.replace(/[\s().-]/g, "");
  let national: string | null = null;
  if (/^0\d{10}$/.test(compact)) national = compact.slice(1);
  else if (/^\+?2340?\d{10}$/.test(compact)) national = compact.replace(/^\+?234/, "").replace(/^0(?=\d{10}$)/, "");
  if (!national || !/^[789][01]\d{8}$/.test(national)) return null;
  return "+234" + national;
}

/** Display form: "+234 803 123 4567". */
export function formatNigerianPhone(e164: string): string {
  const n = e164.replace(/^\+234/, "");
  return `+234 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
}

/** A plausible email address. Deliberately loose: the real check is a reply. */
export function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.trim());
}

/** Field name -> message. An empty object means the step is valid. */
export type FieldErrors = Partial<Record<string, string>>;
