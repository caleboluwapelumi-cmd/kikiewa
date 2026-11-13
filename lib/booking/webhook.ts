import "server-only";
import { confirmPayment } from "@/lib/booking/confirm";
import type { BookingStore } from "@/lib/booking/store-types";
import type { PaystackApi } from "@/lib/paystack/api";
import { verifyPaystackSignature } from "@/lib/paystack/signature";

/**
 * POST /api/paystack/webhook, minus the HTTP plumbing.
 *
 *  - Signature first, over the raw bytes: anything unsigned or tampered
 *    gets 401 and is never parsed or stored.
 *  - Signed events are stored in payment_events (append-only). A repeat of
 *    the same (event, reference) is a duplicate: acknowledged, not redone.
 *  - charge.success hands back a follow-up that runs confirmPayment() after
 *    the 200 has gone out. The webhook body's own amount is never used:
 *    confirmPayment() re-verifies with Paystack.
 *  - If storing fails the answer is 500, so Paystack retries.
 */

export const MAX_WEBHOOK_BYTES = 256 * 1024;

export type WebhookResult = {
  status: 200 | 400 | 401 | 413 | 500;
  /** Run after responding (next/server after()). */
  followUp?: () => Promise<unknown>;
};

export async function handlePaystackWebhook(
  rawBody: Uint8Array,
  signature: string | null,
  deps: { secret: string; store: BookingStore; paystack: PaystackApi },
): Promise<WebhookResult> {
  if (rawBody.byteLength > MAX_WEBHOOK_BYTES) return { status: 413 };
  if (!verifyPaystackSignature(rawBody, signature, deps.secret)) return { status: 401 };

  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(rawBody));
  } catch {
    return { status: 400 };
  }
  const event = (body as { event?: unknown })?.event;
  const reference = (body as { data?: { reference?: unknown } })?.data?.reference;
  // Signed but not about a transaction we can file: acknowledge and move on.
  if (typeof event !== "string" || typeof reference !== "string" || !reference) return { status: 200 };

  try {
    const stored = await deps.store.storePaymentEvent({ provider: "paystack", event, reference, payload: body });
    if (stored === "duplicate" || event !== "charge.success") return { status: 200 };
  } catch (error) {
    console.error("[paystack] could not store webhook", error instanceof Error ? error.message : error);
    return { status: 500 };
  }

  return {
    status: 200,
    followUp: async () => {
      try {
        const result = await confirmPayment(reference, deps);
        if (result.outcome !== "confirmed" && result.outcome !== "already_confirmed") {
          console.warn(`[paystack] webhook confirm: ${result.outcome}`);
        }
        return result;
      } catch (error) {
        // The cron and the status page retry confirmPayment() later.
        console.error("[paystack] webhook confirm failed", error instanceof Error ? error.message : error);
      }
    },
  };
}
