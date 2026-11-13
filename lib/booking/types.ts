import type { LocationId } from "@/data/site";
import type { DaySlots } from "@/lib/booking/slots";

/**
 * Booking types. The form builds one BookingRequest; WhatsApp mode turns it
 * into a message (lib/booking/submit.ts), database mode sends its fields to
 * the createBooking server action (app/book/actions.ts).
 */

export type BookingStepNumber = 1 | 2 | 3 | 4 | 5;
/** The five form steps, then the confirmation screen. */
export type BookingStep = BookingStepNumber | "sent";

/** What lives in the URL (?service=&location=&date=&time=&step=). */
export type BookingSelection = {
  /**
   * A menu item slug ("hydrating-facial") or a category slug ("facials")
   * meaning "help me choose". Aesthetics always resolves to the consultation.
   */
  service?: string;
  location?: LocationId;
  /** YYYY-MM-DD, Lagos calendar date. */
  date?: string;
  /** HH:MM, 24-hour, Lagos time. */
  time?: string;
};

/**
 * Personal details. Kept in sessionStorage, never in the URL, so a name or
 * phone number never lands in browser history, logs or shared links.
 */
export type BookingDetails = {
  name: string;
  phone: string;
  email: string;
  notes: string;
};

/**
 * A complete request, as handed to submitBooking().
 *
 * There is deliberately no price here: the server looks prices up by
 * `serviceSlug` in its own catalogue and never trusts a
 * price, total or deposit sent by the client (lib/booking/create.ts).
 */
export interface BookingRequest {
  serviceSlug: string;
  locationId: LocationId;
  preferredDate: string;
  preferredTime: string;
  customer: {
    name: string;
    /** E.164: +234XXXXXXXXXX */
    phone: string;
    email?: string;
    notes?: string;
  };
  /** The review step's consent box was ticked. */
  consent: true;
  /** ISO timestamp of the consent. */
  consentedAt: string;
}

/** Where a WhatsApp-mode request goes (lib/booking/submit.ts). */
export type SubmitResult =
  | { method: "whatsapp"; href: string; message: string }
  /** No usable WhatsApp number yet (TBC): the contact page instead. */
  | { method: "fallback"; href: string; message: string };

/* Database mode (BOOKINGS_MODE=database) -------------------------------- */

/**
 * 'whatsapp' (default): /book builds a WhatsApp message, nothing is stored.
 * 'database': live slots, bookings stored in Supabase, Paystack where a
 * service takes payment. Set in the hosting dashboard, read on the server.
 */
export type BookingsMode = "whatsapp" | "database";

export type BookingStatus =
  | "requested"
  | "pending_payment"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show"
  | "expired";

/** What the customer sees after booking: safe to send to the browser. */
export type BookingReceipt = {
  ref: string;
  status: BookingStatus;
  serviceName: string;
  branchName: string;
  branchAddress: string | null;
  /** ISO instants (UTC). */
  startAt: string;
  endAt: string;
  amountDueKobo: number;
  amountPaidKobo: number;
  refundRequired: boolean;
};

export type CreateBookingError =
  /** Database mode is off, or the service or branch isn't bookable. */
  | "unavailable"
  | "invalid"
  | "throttled"
  /** Someone else took the slot, or it is no longer offered. */
  | "slot_unavailable"
  | "payment_unavailable"
  | "server";

export type CreateBookingResult =
  | { ok: true; kind: "requested"; receipt: BookingReceipt }
  | { ok: true; kind: "payment"; authorizationUrl: string }
  | { ok: false; error: CreateBookingError; fieldErrors?: Record<string, string> };

export type AvailabilityResult =
  | {
      ok: true;
      payment: { mode: "none" | "deposit" | "full"; amountDueKobo: number };
      dates: DaySlots[];
    }
  | { ok: false; error: "unavailable" | "server" };
