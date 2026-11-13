import "server-only";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabasePublic } from "@/lib/supabase/public";
import type {
  BookingRow,
  BookingStore,
  BranchRow,
  ConfirmOutcome,
  CreateOutcome,
  ServiceRow,
} from "@/lib/booking/store-types";

/**
 * BookingStore on Supabase.
 *
 * Public catalogue reads use the anon client (RLS: active rows only).
 * Everything touching bookings, payments or the throttle uses the
 * service-role client, and every write that needs a lock or a rule goes
 * through a Postgres function (supabase/migrations/…_booking_functions.sql).
 */

const LIVE_STATUSES = ["requested", "confirmed", "pending_payment"];
const CONFIRM_OUTCOMES: ConfirmOutcome[] = [
  "confirmed",
  "confirmed_late",
  "already_confirmed",
  "refund_required",
  "amount_mismatch",
  "not_found",
];

const BOOKING_COLUMNS =
  "id, ref, status, start_at, end_at, amount_due_kobo, amount_paid_kobo, paystack_reference, hold_expires_at, paid_at, refund_required, services(name), branches(name, address)";

type BookingWithRelations = Omit<BookingRow, "service_name" | "branch_name" | "branch_address"> & {
  services: { name: string } | null;
  branches: { name: string; address: string | null } | null;
};

function toBookingRow(row: BookingWithRelations): BookingRow {
  const { services, branches, ...rest } = row;
  return {
    ...rest,
    service_name: services?.name ?? "",
    branch_name: branches?.name ?? "",
    branch_address: branches?.address ?? null,
  };
}

function fail(context: string, error: PostgrestError): never {
  throw new Error(`[bookings] ${context}: ${error.code ?? ""} ${error.message}`);
}

async function bookingWhere(column: "id" | "paystack_reference", value: string): Promise<BookingRow | null> {
  const { data, error } = await supabaseAdmin().from("bookings").select(BOOKING_COLUMNS).eq(column, value).maybeSingle();
  if (error) fail("read booking", error);
  return data ? toBookingRow(data as unknown as BookingWithRelations) : null;
}

export const supabaseStore: BookingStore = {
  async findBranch(slug) {
    const { data, error } = await supabasePublic()
      .from("branches")
      .select("id, slug, name, address")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    if (error) fail("read branch", error);
    return (data as BranchRow | null) ?? null;
  },

  async findService(slug) {
    const { data, error } = await supabasePublic()
      .from("services")
      .select("id, slug, name, category, duration_mins, capacity_per_slot, price_kobo, payment_mode, deposit_kobo, deposit_percent")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    if (error) fail("read service", error);
    return (data as ServiceRow | null) ?? null;
  },

  async loadSchedule(branchId, serviceId, window) {
    const [hours, blocked, bookings] = await Promise.all([
      supabasePublic().from("branch_hours").select("weekday, opens, closes").eq("branch_id", branchId),
      supabasePublic()
        .from("blocked_dates")
        .select("date")
        .eq("branch_id", branchId)
        .gte("date", window.fromIso)
        .lte("date", window.toIso),
      supabaseAdmin()
        .from("bookings")
        .select("start_at, end_at, status, hold_expires_at")
        .eq("branch_id", branchId)
        .eq("service_id", serviceId)
        .in("status", LIVE_STATUSES)
        .lt("start_at", window.to.toISOString())
        .gt("end_at", window.from.toISOString()),
    ]);
    if (hours.error) fail("read hours", hours.error);
    if (blocked.error) fail("read blocked dates", blocked.error);
    if (bookings.error) fail("read bookings", bookings.error);
    return {
      hours: hours.data ?? [],
      blockedDates: (blocked.data ?? []).map((row) => String(row.date)),
      bookings: bookings.data ?? [],
    };
  },

  async recordAttempt(phoneHash, ipHash) {
    const { data, error } = await supabaseAdmin().rpc("record_booking_attempt", {
      p_phone_hash: phoneHash,
      p_ip_hash: ipHash,
    });
    if (error) fail("record attempt", error);
    return data === true;
  },

  async createBooking(booking): Promise<CreateOutcome> {
    const { data, error } = await supabaseAdmin().rpc("create_booking", {
      p_service_id: booking.serviceId,
      p_branch_id: booking.branchId,
      p_start_at: booking.startAt.toISOString(),
      p_customer_name: booking.name,
      p_customer_phone: booking.phone,
      p_customer_email: booking.email,
      p_notes: booking.notes,
      p_consented_at: booking.consentedAt.toISOString(),
      p_reference_suffix: booking.referenceSuffix,
      p_hold_minutes: booking.holdMinutes,
    });
    if (error) {
      const message = error.message ?? "";
      if (message.includes("slot_full")) return { ok: false, reason: "slot_full" };
      if (message.includes("slot_in_past")) return { ok: false, reason: "slot_in_past" };
      if (message.includes("email_required")) return { ok: false, reason: "email_required" };
      if (message.includes("branch_unavailable") || message.includes("service_unavailable")) {
        return { ok: false, reason: "unavailable" };
      }
      fail("create booking", error);
    }
    const id = (data as { id?: string } | null)?.id;
    if (!id) throw new Error("[bookings] create booking: no row returned");
    const row = await bookingWhere("id", id);
    if (!row) throw new Error("[bookings] create booking: row not readable");
    return { ok: true, booking: row };
  },

  async releaseBooking(id) {
    const { error } = await supabaseAdmin().rpc("release_booking", { p_booking_id: id });
    if (error) fail("release booking", error);
  },

  findBookingByReference(reference) {
    return bookingWhere("paystack_reference", reference);
  },

  async confirmBookingPayment({ reference, amountKobo, currency, paidAt }) {
    const { data, error } = await supabaseAdmin().rpc("confirm_booking_payment", {
      p_reference: reference,
      p_amount_kobo: amountKobo,
      p_currency: currency,
      p_paid_at: paidAt,
    });
    if (error) fail("confirm payment", error);
    if (!CONFIRM_OUTCOMES.includes(data as ConfirmOutcome)) throw new Error(`[bookings] confirm payment: unexpected ${data}`);
    return data as ConfirmOutcome;
  },

  async storePaymentEvent(event) {
    const { error } = await supabaseAdmin().from("payment_events").insert({
      provider: event.provider,
      event: event.event,
      reference: event.reference,
      payload: event.payload,
    });
    if (!error) return "stored";
    if (error.code === "23505") return "duplicate";
    fail("store payment event", error);
  },

  async expireStaleHolds() {
    const { data, error } = await supabaseAdmin().rpc("expire_stale_holds");
    if (error) fail("expire holds", error);
    return Number(data ?? 0);
  },

  async unsettledReferences(since, limit) {
    const { data, error } = await supabaseAdmin()
      .from("bookings")
      .select("paystack_reference")
      .in("status", ["pending_payment", "expired"])
      .is("paid_at", null)
      .not("paystack_reference", "is", null)
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) fail("list unsettled", error);
    return (data ?? []).map((row) => String(row.paystack_reference));
  },
};
