import "server-only";
import { notifyBookingConfirmed, notifyRefundRequired } from "@/lib/booking/notify";
import { PAYSTACK_REFERENCE } from "@/lib/booking/schema";
import type { BookingStore, ConfirmOutcome } from "@/lib/booking/store-types";
import type { PaystackApi } from "@/lib/paystack/api";

/**
 * confirmPayment(reference): the one way a paid booking becomes confirmed.
 * The webhook, /book/status and the daily cron all call it, and it is
 * idempotent: calling it again for a settled booking changes nothing.
 *
 * It never trusts what it is told. It asks Paystack's Verify Transaction
 * endpoint, needs status 'success' for this exact reference, and hands
 * Paystack's own amount and currency to confirm_booking_payment(), which
 * locks the booking and checks currency NGN, amount ≥ amount_due_kobo and
 * that the booking is still waiting (or that its lapsed slot is still free;
 * otherwise it flags a refund).
 */

export type ConfirmResult =
  | { outcome: ConfirmOutcome }
  | { outcome: "not_paid"; paystackStatus: string }
  | { outcome: "invalid_reference" | "verify_failed" };

export async function confirmPayment(
  reference: string,
  deps: { store: BookingStore; paystack: PaystackApi },
): Promise<ConfirmResult> {
  if (!PAYSTACK_REFERENCE.test(reference)) return { outcome: "invalid_reference" };

  const transaction = await deps.paystack.verify(reference);
  if (!transaction || transaction.reference !== reference) return { outcome: "verify_failed" };
  if (transaction.status !== "success") return { outcome: "not_paid", paystackStatus: transaction.status };

  const outcome = await deps.store.confirmBookingPayment({
    reference,
    amountKobo: transaction.amount,
    currency: transaction.currency,
    paidAt: transaction.paidAt ?? new Date().toISOString(),
  });

  if (outcome === "confirmed" || outcome === "confirmed_late") {
    await notifyBookingConfirmed(reference).catch(() => undefined);
  } else if (outcome === "refund_required" || outcome === "amount_mismatch") {
    await notifyRefundRequired(reference).catch(() => undefined);
  }
  return { outcome };
}
