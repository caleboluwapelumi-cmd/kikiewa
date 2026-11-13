import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { after, before, describe, it } from "node:test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Runs the SQL functions against a real Supabase project (never
 * production). Skipped unless these are set, e.g. in .env.test.local:
 *
 *   TEST_SUPABASE_URL, TEST_SUPABASE_SERVICE_ROLE_KEY, TEST_SUPABASE_ANON_KEY
 *
 * The project needs the migrations applied (supabase db push). The tests
 * add a temporary service, book far in the future, and clean up after.
 */

const url = process.env.TEST_SUPABASE_URL;
const serviceKey = process.env.TEST_SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.TEST_SUPABASE_ANON_KEY;
const skip = !url || !serviceKey ? "set TEST_SUPABASE_URL and TEST_SUPABASE_SERVICE_ROLE_KEY to run" : false;

describe("database functions (Supabase test project)", { skip }, () => {
  let db: SupabaseClient;
  let branchId: string;
  let serviceId: string;
  const slug = `zz-test-${randomBytes(4).toString("hex")}`;
  const PRICE = 500_000;

  /** A random future start so parallel runs never collide. */
  function futureStart(): string {
    const start = new Date(Date.UTC(2031, 0, 1, 9, 0));
    start.setUTCMinutes(start.getUTCMinutes() + Math.floor(Math.random() * 500_000) * 60);
    return start.toISOString();
  }

  function book(start: string, phone: string) {
    return db.rpc("create_booking", {
      p_service_id: serviceId,
      p_branch_id: branchId,
      p_start_at: start,
      p_customer_name: "Integration Test",
      p_customer_phone: phone,
      p_customer_email: "test@example.com",
      p_notes: null,
      p_consented_at: new Date().toISOString(),
      p_reference_suffix: randomBytes(5).toString("hex"),
      p_hold_minutes: 15,
    });
  }

  before(async () => {
    db = createClient(url!, serviceKey!, { auth: { persistSession: false } });
    const branch = await db.from("branches").select("id").eq("slug", "ebute").single();
    assert.ifError(branch.error);
    branchId = branch.data.id;
    const service = await db
      .from("services")
      .insert({ slug, category: "facials", name: "Integration test", duration_mins: 60, price_kobo: PRICE, payment_mode: "full", capacity_per_slot: 1, active: true })
      .select("id")
      .single();
    assert.ifError(service.error);
    serviceId = service.data.id;
  });

  after(async () => {
    if (!db || !serviceId) return;
    await db.from("bookings").delete().eq("service_id", serviceId);
    await db.from("services").delete().eq("id", serviceId);
  });

  it("two concurrent bookings for the last place: exactly one succeeds", async () => {
    const start = futureStart();
    const results = await Promise.all([book(start, "+2348031111111"), book(start, "+2348032222222")]);
    const ok = results.filter((result) => !result.error);
    const full = results.filter((result) => result.error?.message.includes("slot_full"));
    assert.equal(ok.length, 1, JSON.stringify(results.map((r) => r.error?.message ?? "ok")));
    assert.equal(full.length, 1);
    // The amount came from the services row.
    assert.equal(ok[0].data.amount_due_kobo, PRICE);
    assert.equal(ok[0].data.status, "pending_payment");
    assert.match(ok[0].data.ref, /^KKW-[2-9A-HJKMNP-TV-Z]{4}$/);
  });

  it("confirm_booking_payment is idempotent", async () => {
    const created = await book(futureStart(), "+2348033333333");
    assert.ifError(created.error);
    const reference = created.data.paystack_reference as string;
    const confirm = () =>
      db.rpc("confirm_booking_payment", { p_reference: reference, p_amount_kobo: PRICE, p_currency: "NGN", p_paid_at: new Date().toISOString() });
    const [a, b] = await Promise.all([confirm(), confirm()]);
    assert.deepEqual([a.data, b.data].sort(), ["already_confirmed", "confirmed"]);
    const row = await db.from("bookings").select("status, amount_paid_kobo").eq("paystack_reference", reference).single();
    assert.equal(row.data?.status, "confirmed");
    assert.equal(row.data?.amount_paid_kobo, PRICE);
  });

  it("payment_events ignores duplicates and refuses edits", async () => {
    const event = { provider: "paystack", event: "charge.success", reference: `test-${slug}`, payload: { test: true } };
    assert.ifError((await db.from("payment_events").insert(event)).error);
    assert.equal((await db.from("payment_events").insert(event)).error?.code, "23505");
    const update = await db.from("payment_events").update({ payload: {} }).eq("reference", event.reference);
    assert.ok(update.error, "append-only trigger blocks updates");
  });

  it("anon can read the catalogue but not bookings, and can't call the functions", { skip: anonKey ? false : "set TEST_SUPABASE_ANON_KEY" }, async () => {
    const anon = createClient(url!, anonKey!, { auth: { persistSession: false } });
    const services = await anon.from("services").select("slug").limit(1);
    assert.ifError(services.error);
    const bookings = await anon.from("bookings").select("id").limit(1);
    assert.ok(bookings.error || bookings.data?.length === 0);
    const rpc = await anon.rpc("expire_stale_holds");
    assert.ok(rpc.error, "functions are service-role only");
    const write = await anon.from("services").update({ price_kobo: 1 }).eq("slug", slug);
    assert.ok(write.error || (write.data ?? []).length === 0);
  });
});
