import type { Weekday } from "@/data/site";
import { addDays, dowOf, fromMinutes, lagosNow, lagosToUtc, toMinutes, weekdayOf } from "@/lib/booking/time";

/**
 * Free slots from opening hours, blocked dates and existing bookings.
 *
 * Pure: lib/booking/availability.ts loads the rows and calls this. A slot
 * is free while fewer than `capacity` live bookings of the same service
 * overlap it. Live means requested, confirmed, or pending_payment with a
 * hold that has not expired yet (expired holds are released on read, the
 * same rule as live_bookings_overlapping() in the database).
 */

/** Minutes between bookable start times. */
export const SLOT_STEP_MINS = 60;
/** Leave this much time before the first bookable start today. */
export const LEAD_MINS = 60;
/** How far ahead customers can book. */
export const WINDOW_DAYS = 14;

/** A branch_hours row. weekday: 0 = Sunday … 6 = Saturday. Times "HH:MM[:SS]". */
export type HoursRow = { weekday: number; opens: string; closes: string };

export type BusyBooking = {
  start_at: string;
  end_at: string;
  status: string;
  hold_expires_at: string | null;
};

/** One bookable day: its Lagos date and free start times ("HH:MM"). */
export type DaySlots = {
  iso: string;
  weekday: Weekday;
  /** 0 = today, 1 = tomorrow, … */
  offset: number;
  slots: string[];
};

export function isLiveBooking(booking: BusyBooking, now: Date): boolean {
  if (booking.status === "requested" || booking.status === "confirmed") return true;
  return (
    booking.status === "pending_payment" &&
    booking.hold_expires_at !== null &&
    new Date(booking.hold_expires_at).getTime() > now.getTime()
  );
}

export type SlotInput = {
  hours: HoursRow[];
  /** YYYY-MM-DD dates the branch is closed. */
  blockedDates: string[];
  /** Bookings of this service at this branch around the window. */
  bookings: BusyBooking[];
  durationMins: number;
  capacity: number;
  now: Date;
  days?: number;
  stepMins?: number;
  leadMins?: number;
};

/** The first and last instants (UTC) the window can touch, for loading bookings. */
export function slotWindow(now: Date, days = WINDOW_DAYS): { fromIso: string; toIso: string; from: Date; to: Date } {
  const fromIso = lagosNow(now).iso;
  const toIso = addDays(fromIso, days);
  return { fromIso, toIso, from: lagosToUtc(fromIso, "00:00"), to: lagosToUtc(toIso, "00:00") };
}

export function computeFreeSlots(input: SlotInput): DaySlots[] {
  const { hours, durationMins, capacity, now } = input;
  const days = input.days ?? WINDOW_DAYS;
  const step = input.stepMins ?? SLOT_STEP_MINS;
  const lead = input.leadMins ?? LEAD_MINS;
  const blocked = new Set(input.blockedDates);
  const live = input.bookings
    .filter((booking) => isLiveBooking(booking, now))
    .map((booking) => ({ start: new Date(booking.start_at).getTime(), end: new Date(booking.end_at).getTime() }));
  const today = lagosNow(now);

  const result: DaySlots[] = [];
  for (let offset = 0; offset < days; offset += 1) {
    const iso = addDays(today.iso, offset);
    if (blocked.has(iso)) continue;
    const dow = dowOf(iso);
    const starts = new Set<number>();
    for (const row of hours) {
      if (row.weekday !== dow) continue;
      const close = toMinutes(row.closes);
      for (let start = toMinutes(row.opens); start + durationMins <= close; start += step) {
        if (offset === 0 && start < today.minutes + lead) continue;
        const begin = lagosToUtc(iso, fromMinutes(start)).getTime();
        const end = begin + durationMins * 60_000;
        const taken = live.filter((booking) => booking.start < end && booking.end > begin).length;
        if (taken < capacity) starts.add(start);
      }
    }
    if (starts.size === 0) continue;
    result.push({
      iso,
      weekday: weekdayOf(iso),
      offset,
      slots: [...starts].sort((a, b) => a - b).map(fromMinutes),
    });
  }
  return result;
}
