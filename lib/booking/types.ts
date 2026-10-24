import type { LocationId } from "@/data/site";

/**
 * Booking types. Phase 1 sends a request on WhatsApp (lib/booking/submit.ts);
 * phase 2 sends the same BookingRequest to a server action, then Paystack.
 * Keep this shape stable so both phases share it.
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
 * There is deliberately no price here. TODO(phase 2): the server must look
 * up prices by `serviceSlug` from its own catalogue and never trust a
 * price, total or deposit sent by the client.
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

/** Where the request goes. Phase 2 adds a "server" result. */
export type SubmitResult =
  | { method: "whatsapp"; href: string; message: string }
  /** No usable WhatsApp number yet (TBC): the contact page instead. */
  | { method: "fallback"; href: string; message: string };
