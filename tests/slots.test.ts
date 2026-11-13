import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildIcs } from "@/lib/booking/ics";
import { computeFreeSlots } from "@/lib/booking/slots";
import { lagosToUtc, utcToLagos } from "@/lib/booking/time";
import { HOURS_MON_SAT } from "@/tests/helpers/memory-store";

/** Monday 16 November 2026, 08:00 in Lagos. */
const NOW = new Date("2026-11-16T07:00:00.000Z");

function slots(bookings: Parameters<typeof computeFreeSlots>[0]["bookings"] = [], extra = {}) {
  return computeFreeSlots({ hours: HOURS_MON_SAT, blockedDates: [], bookings, durationMins: 60, capacity: 1, now: NOW, ...extra });
}

describe("Lagos time", () => {
  it("converts Lagos wall time to UTC and back", () => {
    assert.equal(lagosToUtc("2026-11-17", "10:00").toISOString(), "2026-11-17T09:00:00.000Z");
    assert.deepEqual(utcToLagos("2026-11-17T09:00:00.000Z"), { iso: "2026-11-17", time: "10:00" });
    // Near midnight UTC the Lagos date is already the next day.
    assert.deepEqual(utcToLagos("2026-11-16T23:30:00.000Z"), { iso: "2026-11-17", time: "00:30" });
  });
});

describe("free slots", () => {
  it("offers hourly starts within opening hours, Sundays closed", () => {
    const days = slots();
    const tuesday = days.find((day) => day.iso === "2026-11-17");
    assert.deepEqual(tuesday?.slots, ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]);
    assert.equal(days.some((day) => day.iso === "2026-11-22"), false, "Sunday is closed");
    assert.equal(days.length, 12, "14 days minus two Sundays");
  });

  it("leaves a lead time before the first slot today", () => {
    const today = slots().find((day) => day.offset === 0);
    assert.equal(today?.slots[0], "09:00"); // 08:00 now + 60 min lead
    const later = computeFreeSlots({ hours: HOURS_MON_SAT, blockedDates: [], bookings: [], durationMins: 60, capacity: 1, now: new Date("2026-11-16T10:30:00.000Z") });
    assert.equal(later.find((day) => day.offset === 0)?.slots[0], "13:00"); // 11:30 now
  });

  it("fits the service duration before closing", () => {
    const days = slots([], { durationMins: 120 });
    assert.equal(days.find((day) => day.iso === "2026-11-17")?.slots.at(-1), "16:00");
  });

  it("removes slots taken by live bookings, including overlaps", () => {
    const booking = (status: string, hold: string | null = null) => ({
      start_at: "2026-11-17T09:30:00.000Z", // 10:30 to 11:30 Lagos
      end_at: "2026-11-17T10:30:00.000Z",
      status,
      hold_expires_at: hold,
    });
    const take = (b: ReturnType<typeof booking>) => slots([b]).find((day) => day.iso === "2026-11-17")?.slots ?? [];

    for (const status of ["requested", "confirmed"]) {
      const free = take(booking(status));
      assert.equal(free.includes("10:00"), false);
      assert.equal(free.includes("11:00"), false);
      assert.equal(free.includes("12:00"), true);
    }
    assert.equal(take(booking("pending_payment", "2026-11-16T07:10:00.000Z")).includes("10:00"), false, "live hold blocks");
    assert.equal(take(booking("pending_payment", "2026-11-16T06:59:00.000Z")).includes("10:00"), true, "expired hold is released on read");
    assert.equal(take(booking("cancelled")).includes("10:00"), true);
    assert.equal(take(booking("expired")).includes("10:00"), true);
  });

  it("respects capacity", () => {
    const booking = { start_at: "2026-11-17T09:00:00.000Z", end_at: "2026-11-17T10:00:00.000Z", status: "confirmed", hold_expires_at: null };
    const day = (capacity: number, count: number) =>
      computeFreeSlots({ hours: HOURS_MON_SAT, blockedDates: [], bookings: Array(count).fill(booking), durationMins: 60, capacity, now: NOW }).find(
        (entry) => entry.iso === "2026-11-17",
      )?.slots ?? [];
    assert.equal(day(2, 1).includes("10:00"), true);
    assert.equal(day(2, 2).includes("10:00"), false);
  });

  it("skips blocked dates", () => {
    assert.equal(slots([], { blockedDates: ["2026-11-17"] }).some((day) => day.iso === "2026-11-17"), false);
  });
});

describe("calendar file", () => {
  it("builds a valid single-event iCalendar file in UTC", () => {
    const ics = buildIcs(
      { uid: "KKW-A2B3", title: "Kikiewa appointment: Dermaplaning", start: "2026-11-17T09:00:00.000Z", end: "2026-11-17T10:00:00.000Z", location: "Ebute branch, 62 Beach Road; Ikorodu" },
      new Date("2026-11-16T07:00:00.000Z"),
    );
    assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
    assert.match(ics, /\r\nDTSTART:20261117T090000Z\r\n/);
    assert.match(ics, /\r\nDTEND:20261117T100000Z\r\n/);
    assert.match(ics, /LOCATION:Ebute branch\\, 62 Beach Road\\; Ikorodu/);
    assert.match(ics, /UID:KKW-A2B3@kikiewa\.com/);
    assert.match(ics, /END:VCALENDAR$/);
  });
});
