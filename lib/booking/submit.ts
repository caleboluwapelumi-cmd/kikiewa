import { bookingMessage, contact, isTBC, locations, type Location } from "@/data/site";
import { formatTime } from "@/lib/format";
import { formatNigerianPhone } from "@/lib/validation";
import { isUsableWhatsAppNumber, whatsappLink, WHATSAPP_FALLBACK_HREF } from "@/lib/whatsapp";
import { longDate } from "@/lib/booking/availability";
import { resolveService } from "@/lib/booking/services";
import type { BookingRequest, SubmitResult } from "@/lib/booking/types";

/**
 * Sends a booking request.
 *
 * Phase 1 (today): builds a pre-filled WhatsApp link to the chosen
 * location's number. Nothing leaves the browser until the customer presses
 * send in WhatsApp. While the number is TBC the result is /contact.
 *
 * Phase 2: becomes a server action that stores the request and, where a
 * deposit applies, starts a Paystack payment.
 * TODO(phase 2): the server must look up prices by service slug from its own
 * catalogue. Never trust a price, total or deposit sent from the client.
 */

/** The location's own WhatsApp, else the business number, else none. */
export function bookingWhatsappNumber(location: Location): string | null {
  if (!isTBC(location.whatsapp) && isUsableWhatsAppNumber(location.whatsapp)) return location.whatsapp;
  if (!isTBC(contact.whatsapp) && isUsableWhatsAppNumber(contact.whatsapp)) return contact.whatsapp;
  return null;
}

/** The request as WhatsApp text: one labelled line per detail. */
export function buildBookingMessage(request: BookingRequest): string {
  const choice = resolveService(request.serviceSlug);
  const location = locations.find((entry) => entry.id === request.locationId);
  const service = choice
    ? choice.item
      ? `${choice.category.name}: ${choice.item.name}`
      : `${choice.category.name} (${bookingMessage.helpChoose})`
    : request.serviceSlug;

  const lines = [
    bookingMessage.greeting,
    "",
    `${bookingMessage.service}: ${service}`,
    `${bookingMessage.location}: ${location?.title ?? request.locationId}`,
    `${bookingMessage.preferred}: ${longDate(request.preferredDate)}, ${formatTime(request.preferredTime)}`,
    `${bookingMessage.name}: ${request.customer.name}`,
    `${bookingMessage.phone}: ${formatNigerianPhone(request.customer.phone)}`,
    request.customer.email ? `${bookingMessage.email}: ${request.customer.email}` : null,
    request.customer.notes ? `${bookingMessage.notes}: ${request.customer.notes}` : null,
  ];
  return lines.filter((line) => line !== null).join("\n");
}

export function submitBooking(request: BookingRequest): SubmitResult {
  const message = buildBookingMessage(request);
  const location = locations.find((entry) => entry.id === request.locationId);
  const number = location ? bookingWhatsappNumber(location) : null;
  if (!number) return { method: "fallback", href: WHATSAPP_FALLBACK_HREF, message };
  return { method: "whatsapp", href: whatsappLink(number, message), message };
}
