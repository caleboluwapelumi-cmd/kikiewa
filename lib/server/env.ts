import "server-only";
import type { BookingsMode } from "@/lib/booking/types";

/**
 * Server-side configuration. Secrets are read here and nowhere else, and
 * `server-only` makes any import from a Client Component a build error.
 *
 * Values live in .env.local (development) and the Vercel dashboard. See
 * .env.example for the list. Nothing is read at import time, so a build
 * with BOOKINGS_MODE=whatsapp needs none of them.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

/** Defaults to 'whatsapp': database bookings are switched on explicitly. */
export function bookingsMode(): BookingsMode {
  return process.env.BOOKINGS_MODE === "database" ? "database" : "whatsapp";
}

export function supabaseUrl(): string {
  return required("NEXT_PUBLIC_SUPABASE_URL");
}

export function supabaseAnonKey(): string {
  return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/** Bypasses RLS. Only lib/supabase/admin.ts uses it. */
export function supabaseServiceRoleKey(): string {
  return required("SUPABASE_SERVICE_ROLE_KEY");
}

/** Paystack secret key (sk_test_… or sk_live_…). */
export function paystackSecretKey(): string {
  return required("PAYSTACK_SECRET_KEY");
}

/** The webhook check must fail closed, so a missing key reads as "". */
export function paystackSecretKeyOrEmpty(): string {
  return process.env.PAYSTACK_SECRET_KEY ?? "";
}

/** Vercel sends it as `Authorization: Bearer <CRON_SECRET>`. */
export function cronSecret(): string | null {
  return process.env.CRON_SECRET || null;
}

/**
 * Where Paystack sends the customer back. Production uses the public
 * domain; previews use their own deployment URL; locally, localhost.
 * Never taken from request headers.
 */
export function siteOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_ENV === "production") return "https://www.kikiewa.com";
  const vercel = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}
