import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { freeSlots, resolveBookable } from "@/lib/booking/availability";
import { notifyBookingRequested } from "@/lib/booking/notify";
import { amountDueKobo } from "@/lib/booking/pricing";
import { toReceipt } from "@/lib/booking/receipt";
import { createBookingInput, fieldErrorsOf } from "@/lib/booking/schema";
import type { BookingStore } from "@/lib/booking/store-types";
import { lagosToUtc } from "@/lib/booking/time";
import type { BookingsMode, CreateBookingResult } from "@/lib/booking/types";
import { bookPage } from "@/data/site";
import { isPaystackCheckoutUrl, type PaystackApi } from "@/lib/paystack/api";

/**
 * createBooking(), the server half. app/book/actions.ts wires in the real
 * store, Paystack and request details; tests pass fakes.
 *
 * Order matters:
 *  1. Database mode on?  2. Honeypot empty?  3. Input valid (zod; unknown
 *     keys such as an amount are dropped)?  4. Under the throttle?
 *  5. Service and branch bookable, price looked up server-side by slug.
 *  6. Slot still offered.  7. create_booking() re-checks capacity under a
 *     row lock and stores amount_due from the services row.
 *  8. No payment: 'requested'. Payment: Paystack Initialize with the stored
 *     amount and reference; the browser is sent to Paystack's checkout.
 */

export const HOLD_MINUTES = 15;
export const THROTTLE_LIMIT = 5;

export type CreateBookingDeps = {
  mode: BookingsMode;
  store: BookingStore;
  paystack: PaystackApi;
  /** Site origin for Paystack's callback_url. */
  origin: string;
  /** Caller's IP, from the platform's forwarding header. */
  ip: string | null;
  now?: () => Date;
};

function hashKey(kind: string, value: string): string {
  return createHash("sha256").update(`kikiewa:${kind}:${value}`).digest("hex");
}

/** Lowercase hex, 10 characters: the random tail of a Paystack reference. */
export function referenceSuffix(): string {
  return randomBytes(5).toString("hex");
}

export async function createBookingCore(raw: unknown, deps: CreateBookingDeps): Promise<CreateBookingResult> {
  if (deps.mode !== "database") return { ok: false, error: "unavailable" };

  // Honeypot: a hidden field people never see or fill.
  const honeypot = raw && typeof raw === "object" ? (raw as Record<string, unknown>).website : undefined;
  if (typeof honeypot === "string" && honeypot.trim() !== "") return { ok: false, error: "invalid" };

  const parsed = createBookingInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid", fieldErrors: fieldErrorsOf(parsed.error) };
  const input = parsed.data;
  const now = deps.now?.() ?? new Date();

  try {
    const allowed = await deps.store.recordAttempt(
      hashKey("phone", input.phone),
      deps.ip ? hashKey("ip", deps.ip) : null,
    );
    if (!allowed) return { ok: false, error: "throttled" };

    // Price, duration and capacity come from the database row for this
    // slug. Nothing the browser sent about money is read.
    const found = await resolveBookable(deps.store, input.serviceSlug, input.locationId);
    if (!found) return { ok: false, error: "unavailable" };
    const { service, branch } = found;

    if (amountDueKobo(service) > 0 && !input.email) {
      return { ok: false, error: "invalid", fieldErrors: { email: bookPage.errors.emailRequired } };
    }

    const days = await freeSlots(deps.store, branch, service, now);
    if (!days.some((day) => day.iso === input.date && day.slots.includes(input.time))) {
      return { ok: false, error: "slot_unavailable" };
    }

    const created = await deps.store.createBooking({
      serviceId: service.id,
      branchId: branch.id,
      startAt: lagosToUtc(input.date, input.time),
      name: input.name,
      phone: input.phone,
      email: input.email ?? null,
      notes: input.notes ?? null,
      consentedAt: now,
      referenceSuffix: referenceSuffix(),
      holdMinutes: HOLD_MINUTES,
    });
    if (!created.ok) {
      if (created.reason === "slot_full" || created.reason === "slot_in_past") return { ok: false, error: "slot_unavailable" };
      if (created.reason === "email_required") {
        return { ok: false, error: "invalid", fieldErrors: { email: bookPage.errors.emailRequired } };
      }
      return { ok: false, error: "unavailable" };
    }
    const booking = created.booking;

    if (booking.status === "requested") {
      const receipt = toReceipt(booking);
      await notifyBookingRequested(receipt).catch(() => undefined);
      return { ok: true, kind: "requested", receipt };
    }

    // pending_payment: charge exactly what the database stored.
    if (!booking.paystack_reference || !input.email || booking.amount_due_kobo <= 0) {
      await deps.store.releaseBooking(booking.id);
      return { ok: false, error: "server" };
    }
    try {
      const payment = await deps.paystack.initialize({
        email: input.email,
        amountKobo: booking.amount_due_kobo,
        reference: booking.paystack_reference,
        callbackUrl: `${deps.origin}/book/status`,
        metadata: { booking_id: booking.id, booking_ref: booking.ref },
      });
      if (payment.reference !== booking.paystack_reference || !isPaystackCheckoutUrl(payment.authorizationUrl)) {
        throw new Error("unexpected initialize response");
      }
      return { ok: true, kind: "payment", authorizationUrl: payment.authorizationUrl };
    } catch (error) {
      console.error("[bookings] paystack initialize failed", error instanceof Error ? error.message : error);
      await deps.store.releaseBooking(booking.id);
      return { ok: false, error: "payment_unavailable" };
    }
  } catch (error) {
    console.error("[bookings] create failed", error instanceof Error ? error.message : error);
    return { ok: false, error: "server" };
  }
}
