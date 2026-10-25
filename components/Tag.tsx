/**
 * A small status chip, e.g. "Consultation required". Information, not
 * decoration: a hairline pill with an uppercase label.
 */
export function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-chip border border-border-strong px-3 py-1 text-label-sm whitespace-nowrap uppercase text-primary">
      {label}
    </span>
  );
}
