import type { PaymentMode } from "@/lib/booking/pricing";
import type { BusyBooking, HoursRow } from "@/lib/booking/slots";
import type { BookingStatus } from "@/lib/booking/types";

/**
 * The booking data layer as the booking logic sees it.
 * lib/booking/store.ts implements it on Supabase; tests use an in-memory
 * version that follows the same rules as the SQL functions.
 */

export type BranchRow = {
  id: string;
  slug: string;
  name: string;
  address: string | null;
};

export type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  duration_mins: number;
  capacity_per_slot: number;
  price_kobo: number | null;
  payment_mode: PaymentMode;
  deposit_kobo: number | null;
  deposit_percent: number | null;
};

export type ScheduleData = {
  hours: HoursRow[];
  blockedDates: string[];
  bookings: BusyBooking[];
};

export type BookingRow = {
  id: string;
  ref: string;
  status: BookingStatus;
  start_at: string;
  end_at: string;
  amount_due_kobo: number;
  amount_paid_kobo: number;
  paystack_reference: string | null;
  hold_expires_at: string | null;
  paid_at: string | null;
  refund_required: boolean;
  service_name: string;
  branch_name: string;
  branch_address: string | null;
};

export type NewBooking = {
  serviceId: string;
  branchId: string;
  startAt: Date;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  consentedAt: Date;
  /** Random part of the Paystack reference; used only when payment is due. */
  referenceSuffix: string;
  holdMinutes: number;
};

export type CreateOutcome =
  | { ok: true; booking: BookingRow }
  | { ok: false; reason: "slot_full" | "slot_in_past" | "unavailable" | "email_required" };

/** Results of confirm_booking_payment(). */
export type ConfirmOutcome =
  | "confirmed"
  | "confirmed_late"
  | "already_confirmed"
  | "refund_required"
  | "amount_mismatch"
  | "not_found";

export type PaymentEvent = {
  provider: "paystack";
  event: string;
  reference: string;
  payload: unknown;
};

export interface BookingStore {
  findBranch(slug: string): Promise<BranchRow | null>;
  findService(slug: string): Promise<ServiceRow | null>;
  loadSchedule(branchId: string, serviceId: string, window: { fromIso: string; toIso: string; from: Date; to: Date }): Promise<ScheduleData>;
  /** Logs an attempt; false once the phone or IP is over the hourly limit. */
  recordAttempt(phoneHash: string, ipHash: string | null): Promise<boolean>;
  /** Re-checks capacity under a lock and inserts (create_booking()). */
  createBooking(booking: NewBooking): Promise<CreateOutcome>;
  /** Frees a pending_payment hold at once (Paystack could not start). */
  releaseBooking(id: string): Promise<void>;
  findBookingByReference(reference: string): Promise<BookingRow | null>;
  /** Idempotent (confirm_booking_payment()). Figures must come from Paystack Verify. */
  confirmBookingPayment(args: { reference: string; amountKobo: number; currency: string; paidAt: string }): Promise<ConfirmOutcome>;
  /** 'duplicate' when (provider, event, reference) is already stored. */
  storePaymentEvent(event: PaymentEvent): Promise<"stored" | "duplicate">;
  /** Marks lapsed holds expired; returns how many. */
  expireStaleHolds(): Promise<number>;
  /** Paystack references of recent bookings that may have been paid but aren't settled. */
  unsettledReferences(since: Date, limit: number): Promise<string[]>;
}
