import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createBookingCore, type CreateBookingDeps } from "@/lib/booking/create";
import { amountDueKobo } from "@/lib/booking/pricing";
import { FakePaystack, MemoryStore } from "@/tests/helpers/memory-store";

/** Monday 16 November 2026, 08:00 in Lagos. */
const NOW = new Date("2026-11-16T07:00:00.000Z");
/** Tuesday 17 November 2026, 10:00 in Lagos: inside opening hours. */
const SLOT = { date: "2026-11-17", time: "10:00" };

function setup(service: Parameters<MemoryStore["addService"]>[0]) {
  const store = new MemoryStore(() => NOW);
  store.addService(service);
  const paystack = new FakePaystack();
  const deps = (ip = "203.0.113.7"): CreateBookingDeps => ({
    mode: "database",
    store,
    paystack,
    origin: "https://preview.example",
    ip,
    now: () => NOW,
  });
  return { store, paystack, deps };
}

function input(overrides: Record<string, unknown> = {}) {
  return {
    serviceSlug: "dermaplaning",
    locationId: "ebute",
    ...SLOT,
    name: "Ada Customer",
    phone: "0803 123 4567",
    email: "ada@example.com",
    consent: true,
    ...overrides,
  };
}

describe("price lookup is server-side only", () => {
  it("charges the catalogue price and ignores amounts sent by the client", async () => {
    const { store, paystack, deps } = setup({ slug: "dermaplaning", price_kobo: 1_500_000, payment_mode: "full" });
    const result = await createBookingCore(
      input({ amount: 100, amountKobo: 100, price: 1, price_kobo: 1, deposit_kobo: 1, amount_due_kobo: 1, status: "confirmed" }),
      deps(),
    );

    assert.equal(result.ok, true);
    assert.equal(result.ok && result.kind, "payment");
    assert.equal(paystack.initialized.length, 1);
    assert.equal(paystack.initialized[0].amountKobo, 1_500_000);
    assert.equal(store.bookings[0].amount_due_kobo, 1_500_000);
    assert.equal(store.bookings[0].status, "pending_payment");
    assert.equal(paystack.initialized[0].callbackUrl, "https://preview.example/book/status");
    assert.equal(paystack.initialized[0].metadata.booking_id, store.bookings[0].id);
    assert.match(paystack.initialized[0].reference, /^KKW-[2-9A-HJKMNP-TV-Z]{4}-[a-f0-9]{10}$/);
  });

  it("works out deposits from the service row", () => {
    const base = { price_kobo: 2_000_000, deposit_kobo: null, deposit_percent: null } as const;
    assert.equal(amountDueKobo({ ...base, payment_mode: "deposit", deposit_percent: 25 }), 500_000);
    assert.equal(amountDueKobo({ ...base, payment_mode: "deposit", deposit_kobo: 300_000, deposit_percent: 25 }), 300_000);
    assert.equal(amountDueKobo({ ...base, payment_mode: "full" }), 2_000_000);
    assert.equal(amountDueKobo({ ...base, payment_mode: "none" }), 0);
    // A misconfigured row never charges.
    assert.equal(amountDueKobo({ price_kobo: null, deposit_kobo: null, deposit_percent: 50, payment_mode: "deposit" }), 0);
  });

  it("stores a request with no payment when the price isn't set", async () => {
    const { store, paystack, deps } = setup({ slug: "dermaplaning" });
    const result = await createBookingCore(input({ email: "", amount: 999_999 }), deps());

    assert.equal(result.ok && result.kind, "requested");
    assert.equal(paystack.initialized.length, 0);
    assert.equal(store.bookings[0].status, "requested");
    assert.equal(store.bookings[0].amount_due_kobo, 0);
    assert.equal(store.bookings[0].phone, "+2348031234567");
    if (result.ok && result.kind === "requested") {
      // The receipt leaves out personal and payment details.
      assert.deepEqual(Object.keys(result.receipt).sort(), [
        "amountDueKobo",
        "amountPaidKobo",
        "branchAddress",
        "branchName",
        "endAt",
        "ref",
        "refundRequired",
        "serviceName",
        "startAt",
        "status",
      ]);
    }
  });

  it("needs an email when payment is due", async () => {
    const { store, deps } = setup({ slug: "dermaplaning", price_kobo: 1_000_000, payment_mode: "full" });
    const result = await createBookingCore(input({ email: "" }), deps());
    assert.equal(result.ok, false);
    assert.ok(!result.ok && result.fieldErrors?.email);
    assert.equal(store.bookings.length, 0);
  });
});

describe("createBooking guards", () => {
  it("does nothing in whatsapp mode", async () => {
    const { store, deps } = setup({ slug: "dermaplaning" });
    const result = await createBookingCore(input(), { ...deps(), mode: "whatsapp" });
    assert.deepEqual(result, { ok: false, error: "unavailable" });
    assert.equal(store.attempts.length, 0);
  });

  it("drops honeypot submissions before touching the database", async () => {
    const { store, deps } = setup({ slug: "dermaplaning" });
    const result = await createBookingCore(input({ website: "https://spam.example" }), deps());
    assert.deepEqual(result, { ok: false, error: "invalid" });
    assert.equal(store.attempts.length, 0);
    assert.equal(store.bookings.length, 0);
  });

  it("validates input", async () => {
    const { deps } = setup({ slug: "dermaplaning" });
    const result = await createBookingCore(input({ phone: "12345", consent: false }), deps());
    assert.equal(result.ok, false);
    assert.ok(!result.ok && result.fieldErrors?.phone && result.fieldErrors?.consent);
  });

  it("refuses a time outside opening hours", async () => {
    const { store, deps } = setup({ slug: "dermaplaning" });
    const sunday = await createBookingCore(input({ date: "2026-11-22" }), deps());
    const late = await createBookingCore(input({ time: "17:30" }), deps());
    assert.deepEqual(sunday, { ok: false, error: "slot_unavailable" });
    assert.deepEqual(late, { ok: false, error: "slot_unavailable" });
    assert.equal(store.bookings.length, 0);
  });

  it("throttles after 5 attempts per phone per hour", async () => {
    const { deps } = setup({ slug: "dermaplaning", capacity_per_slot: 50 });
    const results = [];
    for (let i = 0; i < 6; i += 1) results.push(await createBookingCore(input(), deps(`198.51.100.${i}`)));
    assert.equal(results.slice(0, 5).every((result) => result.ok), true);
    assert.deepEqual(results[5], { ok: false, error: "throttled" });
  });

  it("throttles after 5 attempts per IP per hour", async () => {
    const { deps } = setup({ slug: "dermaplaning", capacity_per_slot: 50 });
    const results = [];
    for (let i = 0; i < 6; i += 1) results.push(await createBookingCore(input({ phone: `0803123450${i}` }), deps("203.0.113.9")));
    assert.deepEqual(results[5], { ok: false, error: "throttled" });
  });

  it("releases the hold when Paystack can't start the payment", async () => {
    const { store, paystack, deps } = setup({ slug: "dermaplaning", price_kobo: 1_000_000, payment_mode: "full" });
    paystack.initialize = async () => {
      throw new Error("network down");
    };
    const result = await createBookingCore(input(), deps());
    assert.deepEqual(result, { ok: false, error: "payment_unavailable" });
    assert.equal(store.bookings[0].status, "expired");
  });
});

describe("capacity race", () => {
  it("lets only one of two concurrent bookings take the last place", async () => {
    const { store, deps } = setup({ slug: "dermaplaning", capacity_per_slot: 1 });
    // Both requests pass the availability check before either inserts; the
    // locked re-check inside createBooking must stop the second.
    const [a, b] = await Promise.all([
      createBookingCore(input({ phone: "08031111111" }), deps("192.0.2.1")),
      createBookingCore(input({ phone: "08032222222" }), deps("192.0.2.2")),
    ]);
    const outcomes = [a, b].map((result) => (result.ok ? "ok" : result.error)).sort();
    assert.deepEqual(outcomes, ["ok", "slot_unavailable"]);
    assert.equal(store.bookings.length, 1);
  });

  it("allows as many as the capacity, then stops", async () => {
    const { store, deps } = setup({ slug: "dermaplaning", capacity_per_slot: 2 });
    const results = await Promise.all(
      ["08031111111", "08032222222", "08033333333"].map((phone, i) => createBookingCore(input({ phone }), deps(`192.0.2.${i}`))),
    );
    assert.equal(results.filter((result) => result.ok).length, 2);
    assert.equal(store.bookings.length, 2);
  });

  it("frees a slot whose payment hold has expired", async () => {
    const { store, deps } = setup({ slug: "dermaplaning", price_kobo: 1_000_000, payment_mode: "full" });
    const first = await createBookingCore(input({ phone: "08031111111" }), deps("192.0.2.1"));
    assert.equal(first.ok, true);
    const blocked = await createBookingCore(input({ phone: "08032222222" }), deps("192.0.2.2"));
    assert.deepEqual(blocked, { ok: false, error: "slot_unavailable" });

    store.bookings[0].hold_expires_at = new Date(NOW.getTime() - 1000).toISOString();
    const second = await createBookingCore(input({ phone: "08032222222" }), deps("192.0.2.2"));
    assert.equal(second.ok, true);
  });
});
