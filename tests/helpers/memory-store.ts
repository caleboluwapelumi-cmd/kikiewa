import { amountDueKobo } from "@/lib/booking/pricing";
import { isLiveBooking } from "@/lib/booking/slots";
import type {
  BookingRow,
  BookingStore,
  BranchRow,
  ConfirmOutcome,
  CreateOutcome,
  NewBooking,
  PaymentEvent,
  ServiceRow,
} from "@/lib/booking/store-types";
import type { BookingStatus } from "@/lib/booking/types";
import type { InitializeArgs, PaystackApi, VerifiedTransaction } from "@/lib/paystack/api";

/**
 * In-memory BookingStore for tests. createBooking and confirmBookingPayment
 * follow create_booking() and confirm_booking_payment() in
 * supabase/migrations/…_booking_functions.sql, including the lock: a
 * per-branch mutex stands in for SELECT … FOR UPDATE on the branch row.
 */

type StoredBooking = BookingRow & { branch_id: string; service_id: string; phone: string; email: string | null };

/** Yields to the event loop so concurrent calls genuinely interleave. */
const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

class Mutex {
  private tail: Promise<void> = Promise.resolve();
  async run<T>(work: () => Promise<T>): Promise<T> {
    const previous = this.tail;
    let release!: () => void;
    this.tail = new Promise<void>((resolve) => (release = resolve));
    await previous;
    try {
      return await work();
    } finally {
      release();
    }
  }
}

export const HOURS_MON_SAT = [1, 2, 3, 4, 5, 6].map((weekday) => ({ weekday, opens: "09:00:00", closes: "18:00:00" }));

export class MemoryStore implements BookingStore {
  branches: BranchRow[] = [{ id: "branch-ebute", slug: "ebute", name: "Ebute branch", address: "62 Beach Road" }];
  services: ServiceRow[] = [];
  bookings: StoredBooking[] = [];
  events: PaymentEvent[] = [];
  attempts: { key: string; at: number }[] = [];
  /** Every time a booking actually changed to confirmed. */
  confirmations: string[] = [];
  private locks = new Map<string, Mutex>();
  private refCounter = 0;

  now: () => Date;

  constructor(now: () => Date = () => new Date()) {
    this.now = now;
  }

  addService(patch: Partial<ServiceRow> & { slug: string }): ServiceRow {
    const service: ServiceRow = {
      id: `service-${patch.slug}`,
      name: patch.slug,
      category: "facials",
      duration_mins: 60,
      capacity_per_slot: 1,
      price_kobo: null,
      payment_mode: "none",
      deposit_kobo: null,
      deposit_percent: null,
      ...patch,
    };
    this.services.push(service);
    return service;
  }

  private lock(branchId: string): Mutex {
    let mutex = this.locks.get(branchId);
    if (!mutex) this.locks.set(branchId, (mutex = new Mutex()));
    return mutex;
  }

  private overlapping(branchId: string, serviceId: string, start: number, end: number, exclude?: string): number {
    return this.bookings.filter(
      (booking) =>
        booking.id !== exclude &&
        booking.branch_id === branchId &&
        booking.service_id === serviceId &&
        new Date(booking.start_at).getTime() < end &&
        new Date(booking.end_at).getTime() > start &&
        isLiveBooking(booking, this.now()),
    ).length;
  }

  async findBranch(slug: string) {
    await tick();
    return this.branches.find((branch) => branch.slug === slug) ?? null;
  }

  async findService(slug: string) {
    await tick();
    return this.services.find((service) => service.slug === slug) ?? null;
  }

  async loadSchedule(branchId: string, serviceId: string) {
    await tick();
    return {
      hours: HOURS_MON_SAT,
      blockedDates: [],
      bookings: this.bookings
        .filter((booking) => booking.branch_id === branchId && booking.service_id === serviceId)
        .map(({ start_at, end_at, status, hold_expires_at }) => ({ start_at, end_at, status, hold_expires_at })),
    };
  }

  async recordAttempt(phoneHash: string, ipHash: string | null) {
    const at = this.now().getTime();
    this.attempts.push({ key: "phone:" + phoneHash, at });
    if (ipHash) this.attempts.push({ key: "ip:" + ipHash, at });
    const count = (key: string) => this.attempts.filter((entry) => entry.key === key && entry.at > at - 3_600_000).length;
    return count("phone:" + phoneHash) <= 5 && (!ipHash || count("ip:" + ipHash) <= 5);
  }

  createBooking(booking: NewBooking): Promise<CreateOutcome> {
    return this.lock(booking.branchId).run(async () => {
      await tick();
      const service = this.services.find((entry) => entry.id === booking.serviceId);
      if (!service) return { ok: false, reason: "unavailable" };
      if (booking.startAt.getTime() <= this.now().getTime()) return { ok: false, reason: "slot_in_past" };
      const start = booking.startAt.getTime();
      const end = start + service.duration_mins * 60_000;
      if (this.overlapping(booking.branchId, service.id, start, end) >= service.capacity_per_slot) {
        return { ok: false, reason: "slot_full" };
      }
      const due = amountDueKobo(service);
      if (due > 0 && !booking.email) return { ok: false, reason: "email_required" };
      this.refCounter += 1;
      const ref = `KKW-${["A2B3", "C4D5", "E6F7", "G8H9", "J2K3"][this.refCounter % 5]}`;
      const status: BookingStatus = due > 0 ? "pending_payment" : "requested";
      const row: StoredBooking = {
        id: `booking-${this.refCounter}`,
        ref,
        status,
        start_at: new Date(start).toISOString(),
        end_at: new Date(end).toISOString(),
        amount_due_kobo: due,
        amount_paid_kobo: 0,
        paystack_reference: due > 0 ? `${ref}-${booking.referenceSuffix}` : null,
        hold_expires_at: due > 0 ? new Date(this.now().getTime() + booking.holdMinutes * 60_000).toISOString() : null,
        paid_at: null,
        refund_required: false,
        service_name: service.name,
        branch_name: this.branches.find((entry) => entry.id === booking.branchId)?.name ?? "",
        branch_address: null,
        branch_id: booking.branchId,
        service_id: service.id,
        phone: booking.phone,
        email: booking.email,
      };
      this.bookings.push(row);
      return { ok: true, booking: { ...row } };
    });
  }

  async releaseBooking(id: string) {
    const booking = this.bookings.find((entry) => entry.id === id);
    if (booking && booking.status === "pending_payment") booking.status = "expired";
  }

  async findBookingByReference(reference: string) {
    await tick();
    const booking = this.bookings.find((entry) => entry.paystack_reference === reference);
    return booking ? { ...booking } : null;
  }

  async confirmBookingPayment(args: { reference: string; amountKobo: number; currency: string; paidAt: string }): Promise<ConfirmOutcome> {
    const target = this.bookings.find((entry) => entry.paystack_reference === args.reference);
    if (!target) return "not_found";
    return this.lock(target.branch_id).run(async () => {
      await tick();
      const v = target;
      if (v.status === "confirmed" || v.status === "completed") return "already_confirmed";
      if (v.paid_at) return v.refund_required ? "refund_required" : "already_confirmed";
      if (args.currency !== "NGN" || args.amountKobo < v.amount_due_kobo) {
        Object.assign(v, { amount_paid_kobo: args.amountKobo, paid_at: args.paidAt, refund_required: true });
        return "amount_mismatch";
      }
      const settle = (outcome: "confirmed" | "confirmed_late"): ConfirmOutcome => {
        Object.assign(v, { status: "confirmed", amount_paid_kobo: args.amountKobo, paid_at: args.paidAt, hold_expires_at: null });
        this.confirmations.push(v.ref);
        return outcome;
      };
      const holdLive = v.hold_expires_at !== null && new Date(v.hold_expires_at).getTime() > this.now().getTime();
      if (v.status === "pending_payment" && holdLive) return settle("confirmed");
      if (v.status === "pending_payment" || v.status === "expired") {
        const capacity = this.services.find((entry) => entry.id === v.service_id)?.capacity_per_slot ?? 1;
        const start = new Date(v.start_at).getTime();
        const end = new Date(v.end_at).getTime();
        if (this.overlapping(v.branch_id, v.service_id, start, end, v.id) < capacity) return settle("confirmed_late");
        Object.assign(v, { status: "expired", amount_paid_kobo: args.amountKobo, paid_at: args.paidAt, refund_required: true });
        return "refund_required";
      }
      Object.assign(v, { amount_paid_kobo: args.amountKobo, paid_at: args.paidAt, refund_required: true });
      return "refund_required";
    });
  }

  async storePaymentEvent(event: PaymentEvent): Promise<"stored" | "duplicate"> {
    await tick();
    const exists = this.events.some(
      (entry) => entry.provider === event.provider && entry.event === event.event && entry.reference === event.reference,
    );
    if (exists) return "duplicate";
    this.events.push(event);
    return "stored";
  }

  async expireStaleHolds() {
    let count = 0;
    for (const booking of this.bookings) {
      if (booking.status === "pending_payment" && booking.hold_expires_at && new Date(booking.hold_expires_at) < this.now()) {
        booking.status = "expired";
        count += 1;
      }
    }
    return count;
  }

  async unsettledReferences() {
    return this.bookings
      .filter((booking) => (booking.status === "pending_payment" || booking.status === "expired") && !booking.paid_at)
      .map((booking) => booking.paystack_reference)
      .filter((reference): reference is string => Boolean(reference));
  }
}

/** Fake Paystack: records initialize calls, answers verify from `transactions`. */
export class FakePaystack implements PaystackApi {
  initialized: InitializeArgs[] = [];
  verifyCalls: string[] = [];
  transactions = new Map<string, VerifiedTransaction>();

  async initialize(args: InitializeArgs) {
    this.initialized.push(args);
    return { authorizationUrl: `https://checkout.paystack.com/test-${this.initialized.length}`, reference: args.reference };
  }

  async verify(reference: string) {
    this.verifyCalls.push(reference);
    await tick();
    return this.transactions.get(reference) ?? null;
  }

  /** Marks a reference as paid on Paystack's side. */
  pay(reference: string, amount: number, currency = "NGN") {
    this.transactions.set(reference, { reference, status: "success", amount, currency, paidAt: "2026-11-16T07:05:00.000Z" });
  }
}
