import "server-only";
import type { BookingReceipt } from "@/lib/booking/types";

/**
 * Notification hooks. Prompt H fills these in (owner push, SMS, email).
 * Until then they log the booking code only: no names or numbers in logs.
 * A failure here must never undo or fail a booking, so callers don't await
 * them inside anything that can roll back.
 */

/** A booking request was stored (no payment due). */
export async function notifyBookingRequested(receipt: BookingReceipt): Promise<void> {
  console.info(`[bookings] request received ${receipt.ref}`);
}

/** A payment confirmed a booking (webhook, status page or cron). */
export async function notifyBookingConfirmed(reference: string): Promise<void> {
  console.info(`[bookings] payment confirmed ${reference.slice(0, 8)}`);
}

/** Money arrived for a booking that can't be honoured: staff must refund. */
export async function notifyRefundRequired(reference: string): Promise<void> {
  console.warn(`[bookings] refund required ${reference.slice(0, 8)}`);
}
