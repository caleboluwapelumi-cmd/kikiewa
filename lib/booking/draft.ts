import { useSyncExternalStore } from "react";
import type { BookingDetails } from "@/lib/booking/types";

/**
 * The booking form's personal details, kept in sessionStorage so a refresh
 * or the back button keeps them, while they stay out of the URL. Cleared
 * when the tab closes, or on "Make another booking".
 *
 * If storage is blocked (private mode, strict settings) it falls back to
 * memory for the life of the page.
 */

const KEY = "kikiewa:booking-details";
export const EMPTY_DETAILS: BookingDetails = { name: "", phone: "", email: "", notes: "" };

let memory: string | null = null;
const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return window.sessionStorage.getItem(KEY);
  } catch {
    return memory;
  }
}

function write(value: string | null) {
  memory = value;
  try {
    if (value === null) window.sessionStorage.removeItem(KEY);
    else window.sessionStorage.setItem(KEY, value);
  } catch {
    // Storage blocked: memory holds it.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function parse(raw: string | null): BookingDetails {
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
  const raw = useSyncExternalStore<string | null | undefined>(subscribe, read, () => undefined);
  const ready = raw !== undefined;
  const details = parse(ready ? raw : null);
  const update = (patch: Partial<BookingDetails>) => write(JSON.stringify({ ...parse(read()), ...patch }));
  const clear = () => write(null);
  return [details, update, clear, ready];
}
