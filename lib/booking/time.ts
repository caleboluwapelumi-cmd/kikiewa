import type { Weekday } from "@/data/site";
import { WEEKDAYS } from "@/lib/format";

/**
 * Lagos clock helpers. The business runs on Africa/Lagos; the database
 * stores UTC. Every conversion between the two goes through here.
 *
 * Pure (no server or browser APIs), so /book, the server and tests share it.
 */

export const TIME_ZONE = "Africa/Lagos";

const lagosFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function lagosFields(date: Date): Record<string, number> {
  return Object.fromEntries(
    lagosFormat
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
}

/** Today's date (YYYY-MM-DD) and the minutes since midnight, on the Lagos clock. */
export function lagosNow(now: Date): { iso: string; minutes: number } {
  const f = lagosFields(now);
  return {
    iso: `${f.year}-${String(f.month).padStart(2, "0")}-${String(f.day).padStart(2, "0")}`,
    minutes: f.hour * 60 + f.minute,
  };
}

/** A calendar date as a UTC midnight, so date maths ignores time zones. */
export function utcDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** YYYY-MM-DD plus `days`. */
export function addDays(iso: string, days: number): string {
  const date = utcDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** 0 = Sunday … 6 = Saturday (Postgres extract(dow), branch_hours.weekday). */
export function dowOf(iso: string): number {
  return utcDate(iso).getUTCDay();
}

export function weekdayOf(iso: string): Weekday {
  // WEEKDAYS starts on Monday.
  return WEEKDAYS[(dowOf(iso) + 6) % 7];
}

/** "09:00" or "09:00:00" -> 540 */
export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** 540 -> "09:00" */
export function fromMinutes(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

/**
 * A Lagos wall-clock time as a UTC instant: ("2026-11-20", "10:00") ->
 * 2026-11-20T09:00:00Z. Works out the zone offset for that moment rather
 * than assuming +01:00.
 */
export function lagosToUtc(iso: string, time: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  const minutes = toMinutes(time);
  const guess = Date.UTC(y, m - 1, d, Math.floor(minutes / 60), minutes % 60);
  const f = lagosFields(new Date(guess));
  const asLagos = Date.UTC(f.year, f.month - 1, f.day, f.hour, f.minute, f.second);
  return new Date(guess - (asLagos - guess));
}

/** A UTC instant on the Lagos clock: date (YYYY-MM-DD) and time (HH:MM). */
export function utcToLagos(instant: Date | string): { iso: string; time: string } {
  const date = typeof instant === "string" ? new Date(instant) : instant;
  const { iso, minutes } = lagosNow(date);
  return { iso, time: fromMinutes(minutes) };
}
