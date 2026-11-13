import { buttonClass } from "@/components/Button";
import { bookPage } from "@/data/site";
import { formatNaira, formatTime } from "@/lib/format";
import { longDate } from "@/lib/booking/calendar";
import { buildIcs, icsDataHref } from "@/lib/booking/ics";
import { koboToNaira } from "@/lib/booking/pricing";
import { utcToLagos } from "@/lib/booking/time";
import type { BookingReceipt as Receipt } from "@/lib/booking/types";

/**
 * A stored booking as the customer sees it: code, service, branch, time,
 * amount paid (or due) and an "Add to calendar" .ics download. Used by the
 * /book confirmation (database mode) and /book/status. No hooks, so it
 * renders on the server or in the browser.
 */

const t = bookPage.receipt;

/** "Friday 20 November, 10:00 am" on the Lagos clock. */
export function receiptTime(startAt: string): string {
  const { iso, time } = utcToLagos(startAt);
  return `${longDate(iso)}, ${formatTime(time)}`;
}

export function BookingReceipt({ receipt }: { receipt: Receipt }) {
  const paid = receipt.amountPaidKobo > 0;
  const money = paid
    ? { label: t.paid, value: formatNaira(koboToNaira(receipt.amountPaidKobo)) }
    : receipt.amountDueKobo > 0
      ? { label: t.due, value: formatNaira(koboToNaira(receipt.amountDueKobo)) }
      : null;
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: t.ref, value: <span className="font-semibold tracking-wide tabular-nums">{receipt.ref}</span> },
    { label: t.service, value: receipt.serviceName },
    {
      label: t.branch,
      value: (
        <span className="flex flex-col gap-space-xs">
          <span>{receipt.branchName}</span>
          {receipt.branchAddress ? <span className="text-body-sm text-muted">{receipt.branchAddress}</span> : null}
        </span>
      ),
    },
    { label: t.time, value: receiptTime(receipt.startAt) },
    ...(money ? [money] : []),
  ];

  const ics = buildIcs(
    {
      uid: receipt.ref,
      title: `${t.calendarTitle}: ${receipt.serviceName}`,
      start: receipt.startAt,
      end: receipt.endAt,
      location: [receipt.branchName, receipt.branchAddress].filter(Boolean).join(", "),
      description: `${t.ref}: ${receipt.ref}`,
    },
    // Deterministic, so server and browser render the same link.
    new Date(receipt.startAt),
  );

  return (
    <div className="flex flex-col gap-space-lg">
      <dl className="divide-y divide-border border-y border-border-strong">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-1 gap-space-xs py-space-md sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-space-md">
            <dt className="text-label-sm uppercase text-muted">{row.label}</dt>
            <dd className="text-body-md break-words text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
      <a href={icsDataHref(ics)} download={`kikiewa-${receipt.ref}.ics`} className={buttonClass("secondary", "light", "w-fit")}>
        {t.addToCalendar}
      </a>
    </div>
  );
}
