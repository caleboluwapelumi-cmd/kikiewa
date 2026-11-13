import { isTBC, type Location, type Weekday } from "@/data/site";
import { addDays, fromMinutes, lagosNow, toMinutes, utcDate, weekdayOf } from "@/lib/booking/time";

/**
 * Dates, times and labels for /book.
 *
 * With BOOKINGS_MODE=whatsapp these are preferences, not live availability:
 * the team confirms on WhatsApp. When a branch's opening hours are set (per
 * day, in data/site.ts), its times come from those hours; until then they
 * come from DEMO_SLOTS below, and the form says they are examples.
 *
 * With BOOKINGS_MODE=database the form shows live free slots from the
 * server instead (lib/booking/availability.ts); only the labels here apply.
 */

export { TIME_ZONE } from "@/lib/booking/time";
export const BOOKING_WINDOW_DAYS = 14;

/**
 * DEMO DATA, not the real opening hours. Used only while a location's
 * hours are TBC, so the form can be reviewed end to end. Hourly starts.
 */
export const DEMO_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

/** Leave this much time before the first bookable start today. */
export const LEAD_MINUTES = 60;

export type BookingDate = {
  /** YYYY-MM-DD */
  iso: string;
  weekday: Weekday;
  /** 0 = today, 1 = tomorrow, … */
  offset: number;
};

/** True while the location's times are DEMO_SLOTS rather than real hours. */
export function usesExampleTimes(location: Location): boolean {
  return isTBC(location.hours);
}

/** Hourly starts within a location's confirmed hours for that weekday. */
function slotsFor(location: Location, weekday: Weekday): string[] {
  if (isTBC(location.hours)) return DEMO_SLOTS;
  const row = location.hours[weekday];
  if (!row) return []; // closed that day
  const slots: string[] = [];
  // Last start one hour before closing.
  for (let start = toMinutes(row.opens); start + 60 <= toMinutes(row.closes); start += 60) {
    slots.push(fromMinutes(start));
  }
  return slots;
}

/** Preferred start times for a location on a date (YYYY-MM-DD). */
export function preferredSlots(location: Location, iso: string, now = new Date()): string[] {
  const today = lagosNow(now);
  const slots = slotsFor(location, weekdayOf(iso));
  if (iso !== today.iso) return slots;
  return slots.filter((slot) => toMinutes(slot) >= today.minutes + LEAD_MINUTES);
}

/**
 * The next 14 days from today (Lagos), leaving out days with no times at
 * this location (closed, or too late today).
 */
export function bookingDates(location: Location, now = new Date()): BookingDate[] {
  const today = lagosNow(now).iso;
  const dates: BookingDate[] = [];
  for (let offset = 0; offset < BOOKING_WINDOW_DAYS; offset += 1) {
    const iso = addDays(today, offset);
    if (preferredSlots(location, iso, now).length === 0) continue;
    dates.push({ iso, weekday: weekdayOf(iso), offset });
  }
  return dates;
}

/** True when the date and time are still offered at this location. */
export function isSlotOffered(location: Location, iso: string, time: string, now = new Date()): boolean {
  return (
    bookingDates(location, now).some((date) => date.iso === iso) &&
    preferredSlots(location, iso, now).includes(time)
  );
}

const dayLabel = new Intl.DateTimeFormat("en-NG", { weekday: "short", timeZone: "UTC" });
const dateLabel = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", timeZone: "UTC" });
const longLabel = new Intl.DateTimeFormat("en-NG", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

/** "Tue" and "28 Oct" for the date picker. */
export function shortDateParts(iso: string): { day: string; date: string } {
  const date = utcDate(iso);
  return { day: dayLabel.format(date), date: dateLabel.format(date) };
}

/** "Tuesday 28 October" for the review and the WhatsApp message. */
export function longDate(iso: string): string {
  return longLabel.format(utcDate(iso)).replace(",", "");
}
