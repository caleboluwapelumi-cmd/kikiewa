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
