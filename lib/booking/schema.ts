import { z } from "zod";
import { bookPage } from "@/data/site";
import { isValidEmail, normaliseNigerianPhone } from "@/lib/validation";

/**
 * What createBooking() accepts from the browser.
 *
 * There is no price, amount or status field: unknown keys are stripped, so
 * a tampered request carrying `amount: 1` is the same as one without it.
 * The honeypot (`website`) is checked before this schema runs.
 */

const errors = bookPage.errors;

export const createBookingInput = z.object({
  serviceSlug: z.string().trim().regex(/^[a-z0-9-]{1,80}$/, errors.service),
  locationId: z.string().trim().regex(/^[a-z0-9-]{1,40}$/, errors.location),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, errors.date),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, errors.time),
  name: z.string().trim().min(1, errors.name).max(80, errors.name),
  phone: z
    .string()
    .trim()
    .max(20, errors.phoneInvalid)
    .transform((value, ctx) => {
      const phone = normaliseNigerianPhone(value);
      if (!phone) {
        ctx.addIssue({ code: "custom", message: errors.phoneInvalid });
        return z.NEVER;
      }
      return phone;
    }),
  email: z
    .string()
    .trim()
    .max(120, errors.email)
    .optional()
    .transform((value) => value || undefined)
    .refine((value) => value === undefined || isValidEmail(value), errors.email),
  notes: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((value) => value || undefined),
  consent: z.literal(true, errors.consent),
});

export type CreateBookingInput = z.infer<typeof createBookingInput>;

/** Field name -> first message, for the form's error summary. */
export function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const found: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!found[key]) found[key] = issue.message;
  }
  return found;
}

/** Our Paystack references: booking ref, a dash, a random suffix. */
export const PAYSTACK_REFERENCE = /^KKW-[2-9A-HJKMNP-TV-Z]{4}-[a-z0-9]{6,16}$/;
