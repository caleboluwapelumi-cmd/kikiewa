import { createHash, timingSafeEqual } from "node:crypto";
import { confirmPayment } from "@/lib/booking/confirm";
import { supabaseStore } from "@/lib/booking/store";
import { paystack } from "@/lib/paystack/api";
import { bookingsMode, cronSecret } from "@/lib/server/env";

/**
 * Daily cron (vercel.json). Vercel calls it with
 * `Authorization: Bearer <CRON_SECRET>`; anything else gets 401.
 *
 * 1. Reconcile: recent unpaid holds are re-checked with Paystack through
 *    confirmPayment(), in case a webhook was missed.
 * 2. Expire: lapsed pending_payment holds are marked expired (availability
 *    already ignores them) and old throttle rows are cleared.
 */

const RECONCILE_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;
const RECONCILE_LIMIT = 50;

function authorised(header: string | null): boolean {
  const secret = cronSecret();
  if (!secret || !header) return false;
  // Hash both sides so the comparison is constant-time whatever the lengths.
  const a = createHash("sha256").update(header).digest();
  const b = createHash("sha256").update(`Bearer ${secret}`).digest();
  return timingSafeEqual(a, b);
}

export async function GET(request: Request): Promise<Response> {
  if (!authorised(request.headers.get("authorization"))) return new Response(null, { status: 401 });
  if (bookingsMode() !== "database") return Response.json({ skipped: "BOOKINGS_MODE is not database" });

  try {
    const references = await supabaseStore.unsettledReferences(new Date(Date.now() - RECONCILE_WINDOW_MS), RECONCILE_LIMIT);
    const outcomes: Record<string, number> = {};
    for (const reference of references) {
      const { outcome } = await confirmPayment(reference, { store: supabaseStore, paystack });
      outcomes[outcome] = (outcomes[outcome] ?? 0) + 1;
    }
    const expired = await supabaseStore.expireStaleHolds();
    return Response.json({ reconciled: references.length, outcomes, expired });
  } catch (error) {
    console.error("[cron] expire-holds failed", error instanceof Error ? error.message : error);
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
