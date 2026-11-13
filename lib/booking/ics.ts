/**
 * "Add to calendar": a one-event iCalendar file, offered as a data: link
 * so no server route can hand out booking details by guessing a code.
 * Pure, so the browser (request received) and the server (/book/status)
 * both build it.
 */

export type CalendarEvent = {
  /** Stable per booking, so re-importing updates rather than duplicates. */
  uid: string;
  title: string;
  start: string | Date;
  end: string | Date;
  location?: string | null;
  description?: string | null;
};

/** 2026-11-20T09:00:00.000Z -> 20261120T090000Z */
function icsTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Escapes text per RFC 5545 (backslash, semicolon, comma, newline). */
function icsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Folds lines longer than 75 octets, as the format asks. */
function fold(line: string): string {
  const parts: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    parts.push(rest.slice(0, 74));
    rest = " " + rest.slice(74);
  }
  parts.push(rest);
  return parts.join("\r\n");
}

export function buildIcs(event: CalendarEvent, stamp: Date = new Date()): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kikiewa//Bookings//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${icsText(event.uid)}@kikiewa.com`,
    `DTSTAMP:${icsTime(stamp)}`,
    `DTSTART:${icsTime(event.start)}`,
    `DTEND:${icsTime(event.end)}`,
    `SUMMARY:${icsText(event.title)}`,
    event.location ? `LOCATION:${icsText(event.location)}` : null,
    event.description ? `DESCRIPTION:${icsText(event.description)}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines
    .filter((line): line is string => line !== null)
    .map(fold)
    .join("\r\n");
}

export function icsDataHref(ics: string): string {
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
}
