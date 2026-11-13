import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Paystack webhook signature check.
 *
 * Paystack signs the raw request body with HMAC-SHA512 using the secret
 * key and sends the hex digest in `x-paystack-signature`. The body must be
 * the exact bytes received (verify before parsing JSON). The comparison is
 * constant-time. The secret is passed in by server-only code
 * (lib/paystack/api.ts); this module never reads it itself.
 */
export function verifyPaystackSignature(
  rawBody: string | Uint8Array,
  signature: string | null | undefined,
  secret: string | null | undefined,
): boolean {
  if (!secret || !signature) return false;
  if (!/^[0-9a-f]{128}$/i.test(signature)) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest();
  const given = Buffer.from(signature, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** The signature Paystack would send for this body. Used by tests. */
export function signPaystackBody(rawBody: string | Uint8Array, secret: string): string {
  return createHmac("sha512", secret).update(rawBody).digest("hex");
}
