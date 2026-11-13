import "server-only";
import { paystackSecretKey } from "@/lib/server/env";

/**
 * Paystack REST calls (https://paystack.com/docs/api/transaction/).
 * Server only: the secret key never leaves this module.
 */

const BASE = "https://api.paystack.co";
const TIMEOUT_MS = 10_000;

export type InitializeArgs = {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, string>;
};

export type VerifiedTransaction = {
  reference: string;
  /** success, failed, abandoned, ongoing, pending, reversed… */
  status: string;
  /** Kobo. */
  amount: number;
  currency: string;
  paidAt: string | null;
};

/** The two calls the booking flow needs. Tests swap in a fake. */
export type PaystackApi = {
  initialize(args: InitializeArgs): Promise<{ authorizationUrl: string; reference: string }>;
  /** null when Paystack can't be reached or doesn't know the reference. */
  verify(reference: string): Promise<VerifiedTransaction | null>;
};

async function call(path: string, init: RequestInit = {}): Promise<unknown> {
  const response = await fetch(BASE + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${paystackSecretKey()}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const body = (await response.json().catch(() => null)) as { status?: boolean; message?: string; data?: unknown } | null;
  if (!response.ok || !body?.status) {
    throw new Error(`Paystack ${path.split("/").slice(0, 3).join("/")} failed: ${response.status} ${body?.message ?? ""}`.trim());
  }
  return body.data;
}

export const paystack: PaystackApi = {
  async initialize(args) {
    const data = (await call("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email: args.email,
        amount: args.amountKobo,
        currency: "NGN",
        reference: args.reference,
        callback_url: args.callbackUrl,
        metadata: args.metadata,
      }),
    })) as { authorization_url?: unknown; reference?: unknown };
    if (typeof data.authorization_url !== "string" || typeof data.reference !== "string") {
      throw new Error("Paystack initialize: unexpected response");
    }
    return { authorizationUrl: data.authorization_url, reference: data.reference };
  },

  async verify(reference) {
    try {
      const data = (await call(`/transaction/verify/${encodeURIComponent(reference)}`)) as {
        reference?: unknown;
        status?: unknown;
        amount?: unknown;
        currency?: unknown;
        paid_at?: unknown;
      };
      if (typeof data.reference !== "string" || typeof data.status !== "string" || typeof data.amount !== "number") {
        return null;
      }
      return {
        reference: data.reference,
        status: data.status,
        amount: data.amount,
        currency: typeof data.currency === "string" ? data.currency : "",
        paidAt: typeof data.paid_at === "string" ? data.paid_at : null,
      };
    } catch (error) {
      console.error("[paystack] verify failed", error instanceof Error ? error.message : error);
      return null;
    }
  },
};

/** Paystack's hosted checkout. Anything else is refused as a redirect target. */
export function isPaystackCheckoutUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "checkout.paystack.com";
  } catch {
    return false;
  }
}
