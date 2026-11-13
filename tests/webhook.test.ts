import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { confirmPayment } from "@/lib/booking/confirm";
import { createBookingCore } from "@/lib/booking/create";
import { handlePaystackWebhook } from "@/lib/booking/webhook";
import { signPaystackBody } from "@/lib/paystack/signature";
import { FakePaystack, MemoryStore } from "@/tests/helpers/memory-store";

const SECRET = "sk_test_webhook_secret";
const NOW = new Date("2026-11-16T07:00:00.000Z");
const PRICE = 1_500_000;

async function pendingBooking() {
  const store = new MemoryStore(() => NOW);
  store.addService({ slug: "dermaplaning", price_kobo: PRICE, payment_mode: "full" });
  const paystack = new FakePaystack();
  const result = await createBookingCore(
    {
      serviceSlug: "dermaplaning",
      locationId: "ebute",
      date: "2026-11-17",
      time: "10:00",
      name: "Ada Customer",
      phone: "08031234567",
      email: "ada@example.com",
      consent: true,
    },
    { mode: "database", store, paystack, origin: "https://preview.example", ip: "203.0.113.7", now: () => NOW },
  );
  assert.equal(result.ok && result.kind, "payment");
  const reference = store.bookings[0].paystack_reference!;
  return { store, paystack, reference, deps: { secret: SECRET, store, paystack } };
}

function signedEvent(reference: string, amount = PRICE, event = "charge.success") {
  const raw = new TextEncoder().encode(JSON.stringify({ event, data: { reference, amount, currency: "NGN", status: "success" } }));
  return { raw, signature: signPaystackBody(raw, SECRET) };
}

describe("Paystack webhook", () => {
  it("confirms once when the same event arrives twice", async () => {
    const { store, paystack, reference, deps } = await pendingBooking();
    paystack.pay(reference, PRICE);
    const { raw, signature } = signedEvent(reference);

    const first = await handlePaystackWebhook(raw, signature, deps);
    assert.equal(first.status, 200);
    await first.followUp?.();

    const second = await handlePaystackWebhook(raw, signature, deps);
    assert.equal(second.status, 200);
    assert.equal(second.followUp, undefined, "a duplicate event is not processed again");

    assert.equal(store.events.length, 1);
    assert.deepEqual(store.confirmations, [store.bookings[0].ref]);
    assert.equal(store.bookings[0].status, "confirmed");
    assert.equal(store.bookings[0].amount_paid_kobo, PRICE);
    assert.ok(store.bookings[0].paid_at);
  });

  it("stays idempotent when the webhook and the status page confirm at the same time", async () => {
    const { store, paystack, reference, deps } = await pendingBooking();
    paystack.pay(reference, PRICE);
    const { raw, signature } = signedEvent(reference);
    const hook = await handlePaystackWebhook(raw, signature, deps);
    const [a, b, c] = await Promise.all([hook.followUp?.(), confirmPayment(reference, deps), confirmPayment(reference, deps)]);
    const outcomes = [a, b, c].map((result) => (result as { outcome: string }).outcome).sort();
    assert.deepEqual(outcomes, ["already_confirmed", "already_confirmed", "confirmed"]);
    assert.equal(store.confirmations.length, 1);
  });

  it("rejects unsigned or tampered requests with 401 and stores nothing", async () => {
    const { store, reference, deps } = await pendingBooking();
    const { raw, signature } = signedEvent(reference);
    const tampered = new TextEncoder().encode(new TextDecoder().decode(raw).replace(String(PRICE), "100"));

    assert.equal((await handlePaystackWebhook(raw, null, deps)).status, 401);
    assert.equal((await handlePaystackWebhook(tampered, signature, deps)).status, 401);
    assert.equal((await handlePaystackWebhook(raw, signature, { ...deps, secret: "" })).status, 401);
    assert.equal(store.events.length, 0);
    assert.equal(store.bookings[0].status, "pending_payment");
  });

  it("never confirms from the webhook body: Paystack Verify must say success", async () => {
    const { store, paystack, reference, deps } = await pendingBooking();
    // Signed event claims success, but Paystack's own record says abandoned.
    paystack.transactions.set(reference, { reference, status: "abandoned", amount: PRICE, currency: "NGN", paidAt: null });
    const { raw, signature } = signedEvent(reference);
    const result = await handlePaystackWebhook(raw, signature, deps);
    await result.followUp?.();
    assert.deepEqual(paystack.verifyCalls, [reference]);
    assert.equal(store.bookings[0].status, "pending_payment");
  });

  it("flags short payments for refund instead of confirming", async () => {
    const { store, paystack, reference, deps } = await pendingBooking();
    paystack.pay(reference, PRICE - 1);
    const result = await confirmPayment(reference, deps);
    assert.deepEqual(result, { outcome: "amount_mismatch" });
    assert.equal(store.bookings[0].status, "pending_payment");
    assert.equal(store.bookings[0].refund_required, true);
  });

  it("flags non-NGN payments for refund", async () => {
    const { store, paystack, reference, deps } = await pendingBooking();
    paystack.pay(reference, PRICE, "USD");
    assert.deepEqual(await confirmPayment(reference, deps), { outcome: "amount_mismatch" });
    assert.equal(store.bookings[0].refund_required, true);
  });

  it("confirms a late payment if the lapsed slot is still free", async () => {
    const { store, paystack, reference, deps } = await pendingBooking();
    store.bookings[0].hold_expires_at = new Date(NOW.getTime() - 60_000).toISOString();
    await store.expireStaleHolds();
    paystack.pay(reference, PRICE);
    assert.deepEqual(await confirmPayment(reference, deps), { outcome: "confirmed_late" });
    assert.equal(store.bookings[0].status, "confirmed");
  });

  it("flags a refund when the lapsed slot was taken by someone else", async () => {
    const { store, paystack, reference, deps } = await pendingBooking();
    store.bookings[0].hold_expires_at = new Date(NOW.getTime() - 60_000).toISOString();
    // Someone else books the freed slot.
    const other = await createBookingCore(
      { serviceSlug: "dermaplaning", locationId: "ebute", date: "2026-11-17", time: "10:00", name: "Bola", phone: "08039999999", email: "b@example.com", consent: true },
      { mode: "database", store, paystack, origin: "https://preview.example", ip: "192.0.2.50", now: () => NOW },
    );
    assert.equal(other.ok, true);
    paystack.pay(reference, PRICE);
    assert.deepEqual(await confirmPayment(reference, deps), { outcome: "refund_required" });
    assert.equal(store.bookings[0].status, "expired");
    assert.equal(store.bookings[0].refund_required, true);
  });

  it("stores but doesn't act on other events", async () => {
    const { store, reference, deps } = await pendingBooking();
    const { raw, signature } = signedEvent(reference, PRICE, "transfer.success");
    const result = await handlePaystackWebhook(raw, signature, deps);
    assert.equal(result.status, 200);
    assert.equal(result.followUp, undefined);
    assert.equal(store.events.length, 1);
  });

  it("answers 500 (so Paystack retries) when the event can't be stored", async () => {
    const { store, reference, deps } = await pendingBooking();
    store.storePaymentEvent = async () => {
      throw new Error("database down");
    };
    const { raw, signature } = signedEvent(reference);
    assert.equal((await handlePaystackWebhook(raw, signature, deps)).status, 500);
  });
});
