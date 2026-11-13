import { useSyncExternalStore } from "react";
import type { BookingDetails, BookingReceipt } from "@/lib/booking/types";

/**
 * The booking form's personal details, kept in sessionStorage so a refresh
 * or the back button keeps them, while they stay out of the URL. Cleared
 * when the tab closes, or on "Make another booking".
 *
 * In database mode the stored booking's receipt is kept the same way, so a
 * refresh after booking shows the confirmation rather than the form (and
 * the details are cleared once the booking is stored).
 *
 * If storage is blocked (private mode, strict settings) it falls back to
 * memory for the life of the page.
 */

export const EMPTY_DETAILS: BookingDetails = { name: "", phone: "", email: "", notes: "" };

function sessionStore(key: string) {
  let memory: string | null = null;
  const listeners = new Set<() => void>();

  function read(): string | null {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return memory;
    }
  }

  function write(value: string | null) {
    memory = value;
    try {
      if (value === null) window.sessionStorage.removeItem(key);
      else window.sessionStorage.setItem(key, value);
    } catch {
      // Storage blocked: memory holds it.
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { read, write, subscribe };
}

const detailsStore = sessionStore("kikiewa:booking-details");
const receiptStore = sessionStore("kikiewa:booking-receipt");

function parseDetails(raw: string | null): BookingDetails {
  if (!raw) return EMPTY_DETAILS;
  try {
    const value = JSON.parse(raw) as Partial<BookingDetails>;
    return {
      name: typeof value.name === "string" ? value.name : "",
      phone: typeof value.phone === "string" ? value.phone : "",
      email: typeof value.email === "string" ? value.email : "",
      notes: typeof value.notes === "string" ? value.notes : "",
    };
  } catch {
    return EMPTY_DETAILS;
  }
}

/**
 * [details, update, clear, ready]. `ready` is false during the server render
 * and hydration, before storage can be read.
 */
export function useBookingDraft(): [
  BookingDetails,
  (patch: Partial<BookingDetails>) => void,
  () => void,
  boolean,
] {
  const raw = useSyncExternalStore<string | null | undefined>(detailsStore.subscribe, detailsStore.read, () => undefined);
  const ready = raw !== undefined;
  const details = parseDetails(ready ? raw : null);
  const update = (patch: Partial<BookingDetails>) =>
    detailsStore.write(JSON.stringify({ ...parseDetails(detailsStore.read()), ...patch }));
  const clear = () => detailsStore.write(null);
  return [details, update, clear, ready];
}

function parseReceipt(raw: string | null | undefined): BookingReceipt | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as BookingReceipt;
    return typeof value?.ref === "string" && typeof value.startAt === "string" ? value : null;
  } catch {
    return null;
  }
}

/** [receipt, set]. The last booking stored from this tab (database mode). */
export function useBookingReceipt(): [BookingReceipt | null, (receipt: BookingReceipt | null) => void] {
  const raw = useSyncExternalStore<string | null | undefined>(receiptStore.subscribe, receiptStore.read, () => undefined);
  const set = (receipt: BookingReceipt | null) => receiptStore.write(receipt ? JSON.stringify(receipt) : null);
  return [parseReceipt(raw), set];
}
