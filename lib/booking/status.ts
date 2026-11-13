import "server-only";
import { confirmPayment } from "@/lib/booking/confirm";
import { toReceipt } from "@/lib/booking/receipt";
import { PAYSTACK_REFERENCE } from "@/lib/booking/schema";
import type { BookingStore } from "@/lib/booking/store-types";
import type { BookingReceipt, BookingsMode } from "@/lib/booking/types";
import type { PaystackApi } from "@/lib/paystack/api";

/**
 * /book/status?reference=… : where Paystack sends the customer back.
 *
 * Shows what the database says, after asking Paystack. If the booking is
 * still waiting for money, it calls the same idempotent confirmPayment()
 * the webhook uses; it never marks a booking confirmed any other way.
 */

export type StatusView =
  | { kind: "unavailable" | "not_found" }
  | {
      /**
       * confirmed: paid and booked. pending: Paystack hasn't settled it yet.
       * failed: payment didn't go through (hold may still be live).
       * expired: the hold lapsed without payment. refund: paid, but the
       * booking couldn't be honoured, staff will refund.
       */
      kind: "confirmed" | "pending" | "failed" | "expired" | "refund";
      receipt: BookingReceipt;
      holdExpiresAt: string | null;
    };

const FAILED = new Set(["failed", "abandoned", "reversed"]);

export async function bookingStatus(
  reference: string | undefined,
  deps: { mode: BookingsMode; store: BookingStore; paystack: PaystackApi },
): Promise<StatusView> {
  if (deps.mode !== "database") return { kind: "unavailable" };
  if (!reference || !PAYSTACK_REFERENCE.test(reference)) return { kind: "not_found" };

  let booking = await deps.store.findBookingByReference(reference);
  if (!booking) return { kind: "not_found" };

  let paystackStatus: string | null = null;
  if ((booking.status === "pending_payment" || booking.status === "expired") && !booking.paid_at) {
    const result = await confirmPayment(reference, deps);
    if (result.outcome === "not_paid") paystackStatus = result.paystackStatus;
    booking = (await deps.store.findBookingByReference(reference)) ?? booking;
  }

  const receipt = toReceipt(booking);
  const base = { receipt, holdExpiresAt: booking.hold_expires_at };
  if (booking.refund_required) return { kind: "refund", ...base };
  if (booking.status === "confirmed" || booking.status === "completed") return { kind: "confirmed", ...base };
  if (booking.status === "pending_payment") {
    return { kind: paystackStatus && FAILED.has(paystackStatus) ? "failed" : "pending", ...base };
  }
  return { kind: "expired", ...base };
}
