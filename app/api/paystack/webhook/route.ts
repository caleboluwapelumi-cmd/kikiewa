import { after } from "next/server";
import { supabaseStore } from "@/lib/booking/store";
import { handlePaystackWebhook } from "@/lib/booking/webhook";
import { paystack } from "@/lib/paystack/api";
import { paystackSecretKeyOrEmpty } from "@/lib/server/env";

/**
 * Paystack webhook. Set this URL in the Paystack dashboard
 * (Settings > API Keys & Webhooks): https://www.kikiewa.com/api/paystack/webhook
 *
 * Reads the raw body, verifies x-paystack-signature (HMAC-SHA512 with the
 * secret key, constant-time), stores the event, answers 200, and confirms
 * the payment after the response (lib/booking/webhook.ts).
 */
export async function POST(request: Request): Promise<Response> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > 256 * 1024) return new Response(null, { status: 413 });

  const raw = new Uint8Array(await request.arrayBuffer());
  const result = await handlePaystackWebhook(raw, request.headers.get("x-paystack-signature"), {
    secret: paystackSecretKeyOrEmpty(),
    store: supabaseStore,
    paystack,
  });
  if (result.followUp) after(result.followUp);
  return new Response(null, { status: result.status });
}
