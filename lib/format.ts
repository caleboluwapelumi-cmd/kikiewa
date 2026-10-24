import type { OpeningHours, Weekday } from "@/data/site";

/** Display formats for confirmed values from data/site.ts. */

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/** 25000 -> "₦25,000" */
export function formatNaira(amount: number): string {
  return naira.format(amount);
}

/** 25000 -> "From ₦25,000" */
export function formatPriceFrom(amount: number): string {
  return "From " + formatNaira(amount);
}

/** 90 -> "1 hr 30 min", 45 -> "45 min" */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

/* Opening hours ---------------------------------------------------------- */

export const WEEKDAYS: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const SHORT_DAY: Record<Weekday, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

/** ["monday", …, "friday"] -> "Mon – Fri"; ["monday", "wednesday"] -> "Mon, Wed" */
export function formatDays(days: Weekday[]): string {
  const sorted = [...days].sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b));
  if (sorted.length === 0) return "";
  const first = WEEKDAYS.indexOf(sorted[0]);
  const consecutive = sorted.every((day, index) => WEEKDAYS.indexOf(day) === first + index);
  if (consecutive && sorted.length > 2) {
    return `${SHORT_DAY[sorted[0]]} – ${SHORT_DAY[sorted[sorted.length - 1]]}`;
  }
  return sorted.map((day) => SHORT_DAY[day]).join(", ");
}

/** "09:00" -> "9:00 am", "13:30" -> "1:30 pm" */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** { opens: "09:00", closes: "18:00" } -> "9:00 am – 6:00 pm" */
export function formatTimeRange(row: Pick<OpeningHours, "opens" | "closes">): string {
  return `${formatTime(row.opens)} – ${formatTime(row.closes)}`;
}

/** One row as a line: "Mon – Fri 9:00 am – 6:00 pm" */
export function formatOpeningHours(row: OpeningHours): string {
  return `${formatDays(row.days)} ${formatTimeRange(row)}`;
}
