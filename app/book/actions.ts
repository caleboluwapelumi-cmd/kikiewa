"use server";

import { headers } from "next/headers";
import { getAvailability } from "@/lib/booking/availability";
import { createBookingCore } from "@/lib/booking/create";
import { supabaseStore } from "@/lib/booking/store";
import type { AvailabilityResult, CreateBookingResult } from "@/lib/booking/types";
import { paystack } from "@/lib/paystack/api";
import { bookingsMode, siteOrigin } from "@/lib/server/env";

/**
 * Server actions for /book (BOOKINGS_MODE=database). Each is a public POST
 * endpoint, so each treats its input as untrusted: the real work, with all
 * validation, lives in server-only modules under lib/booking.
 */

/** Caller IP from Vercel's forwarding headers (set by the platform, not the client). */
async function callerIp(): Promise<string | null> {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for")?.split(",")[0]?.trim();
  return list.get("x-real-ip") || forwarded || null;
}

/** Free slots and payment terms for a service at a branch. */
export async function loadAvailability(serviceSlug: unknown, locationId: unknown): Promise<AvailabilityResult> {
  if (typeof serviceSlug !== "string" || typeof locationId !== "string") return { ok: false, error: "unavailable" };
  return getAvailability({ serviceSlug, locationId }, { store: supabaseStore, mode: bookingsMode() });
}

/** Stores a booking, and starts a Paystack payment when the service takes one. */
export async function createBooking(input: unknown): Promise<CreateBookingResult> {
  return createBookingCore(input, {
    mode: bookingsMode(),
    store: supabaseStore,
    paystack,
    origin: siteOrigin(),
    ip: await callerIp(),
  });
}
