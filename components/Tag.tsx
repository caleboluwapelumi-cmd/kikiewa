/**
 * A small ruled status tag, e.g. "Consultation required". Information, not
 * decoration: sharp hairline box, uppercase label.
 */
export function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block border border-border-strong px-2 py-1 text-label-sm whitespace-nowrap uppercase text-primary">
      {label}
    </span>
  );
}
