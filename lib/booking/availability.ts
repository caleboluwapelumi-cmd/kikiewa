import "server-only";
import { resolveService } from "@/lib/booking/services";
import { paymentSummary } from "@/lib/booking/pricing";
import { computeFreeSlots, slotWindow, type DaySlots } from "@/lib/booking/slots";
import type { BookingStore, BranchRow, ServiceRow } from "@/lib/booking/store-types";
import type { AvailabilityResult, BookingsMode } from "@/lib/booking/types";

/**
 * Live availability (BOOKINGS_MODE=database): reads the branch's hours,
 * blocked dates and existing bookings, and returns free start times per
 * day for the service's duration and capacity. Africa/Lagos throughout;
 * the database stores UTC.
 *
 * Expired holds are released on read: a pending_payment booking whose
 * hold_expires_at has passed no longer blocks its slot, whether or not the
 * daily cron has marked it expired yet.
 */

export async function freeSlots(
  store: BookingStore,
  branch: BranchRow,
  service: ServiceRow,
  now: Date,
): Promise<DaySlots[]> {
  const window = slotWindow(now);
  const schedule = await store.loadSchedule(branch.id, service.id, window);
  return computeFreeSlots({
    ...schedule,
    durationMins: service.duration_mins,
    capacity: service.capacity_per_slot,
    now,
  });
}

/**
 * The service and branch a /book selection points at, or null. The slug is
 * resolved against the site menu first (so production hides unconfirmed
 * items here too), then looked up in the database.
 */
export async function resolveBookable(
  store: BookingStore,
  serviceSlug: string,
  locationId: string,
): Promise<{ service: ServiceRow; branch: BranchRow } | null> {
  const choice = resolveService(serviceSlug);
  if (!choice) return null;
  const [service, branch] = await Promise.all([store.findService(choice.slug), store.findBranch(locationId)]);
  return service && branch ? { service, branch } : null;
}

export async function getAvailability(
  input: { serviceSlug: string; locationId: string },
  deps: { store: BookingStore; mode: BookingsMode; now?: Date },
): Promise<AvailabilityResult> {
  if (deps.mode !== "database") return { ok: false, error: "unavailable" };
  if (!/^[a-z0-9-]{1,80}$/.test(input.serviceSlug) || !/^[a-z0-9-]{1,40}$/.test(input.locationId)) {
    return { ok: false, error: "unavailable" };
  }
  try {
    const found = await resolveBookable(deps.store, input.serviceSlug, input.locationId);
    if (!found) return { ok: false, error: "unavailable" };
    const dates = await freeSlots(deps.store, found.branch, found.service, deps.now ?? new Date());
    return { ok: true, payment: paymentSummary(found.service), dates };
  } catch (error) {
    console.error("[bookings] availability failed", error instanceof Error ? error.message : error);
    return { ok: false, error: "server" };
  }
}
