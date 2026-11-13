import type { BookingRow } from "@/lib/booking/store-types";
import type { BookingReceipt } from "@/lib/booking/types";

/**
 * The customer-facing view of a booking. Leaves out everything the browser
 * doesn't need: ids, phone, email, notes, the Paystack reference.
 */
export function toReceipt(row: BookingRow): BookingReceipt {
  return {
    ref: row.ref,
    status: row.status,
    serviceName: row.service_name,
    branchName: row.branch_name,
    branchAddress: row.branch_address,
    startAt: row.start_at,
    endAt: row.end_at,
    amountDueKobo: row.amount_due_kobo,
    amountPaidKobo: row.amount_paid_kobo,
    refundRequired: row.refund_required,
  };
}
