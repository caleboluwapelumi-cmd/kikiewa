/**
 * What a booking costs up front, from the services row alone.
 *
 * Never pass anything the browser sent into this: the server looks the
 * service up by slug and uses its own row. create_booking() in the
 * database applies the same rule when it stores amount_due_kobo, and that
 * stored figure is what Paystack is asked to charge.
 */

export type PaymentMode = "none" | "deposit" | "full";

export type ServicePricing = {
  price_kobo: number | null;
  payment_mode: PaymentMode;
  deposit_kobo: number | null;
  deposit_percent: number | null;
};

/** Kobo due at booking time. 0 means no payment: the booking is a request. */
export function amountDueKobo(service: ServicePricing): number {
  if (service.payment_mode === "full") return service.price_kobo && service.price_kobo > 0 ? service.price_kobo : 0;
  if (service.payment_mode === "deposit") {
    if (service.deposit_kobo && service.deposit_kobo > 0) return service.deposit_kobo;
    if (service.deposit_percent && service.price_kobo && service.price_kobo > 0) {
      return Math.ceil((service.price_kobo * service.deposit_percent) / 100);
    }
  }
  return 0;
}

/** What /book shows for a service: whether money is taken now, and how much. */
export function paymentSummary(service: ServicePricing): { mode: PaymentMode; amountDueKobo: number } {
  const due = amountDueKobo(service);
  return { mode: due > 0 ? service.payment_mode : "none", amountDueKobo: due };
}

/** 250000 kobo -> 2500 naira. */
export function koboToNaira(kobo: number): number {
  return kobo / 100;
}
