import { isTBC, type OrTBC } from "@/data/site";

/**
 * Renders a value from data/site.ts that may still be TBC.
 *
 * Confirmed values render as given (or through `format`). TBC values render
 * as a small muted "To be confirmed" label in the sans font, so unconfirmed
 * details read as a quiet status, never as raw placeholder text. On plum
 * surfaces (`data-tone="dark"`) the label switches to a light ink.
 */

const labelClass =
  "inline-block font-body text-label-sm font-semibold uppercase not-italic text-muted in-data-[tone=dark]:text-on-primary/75";

export function TbcLabel({ className = "" }: { className?: string }) {
  return <span className={[labelClass, className].join(" ")}>To be confirmed</span>;
}

type ConfirmableProps<T extends string | number> = {
  value: OrTBC<T> | undefined;
  /** Formats a confirmed value, e.g. a naira price. */
  format?: (value: T) => React.ReactNode;
  /** Classes for the TBC label. */
  className?: string;
};

export function Confirmable<T extends string | number>({
  value,
  format,
  className,
}: ConfirmableProps<T>) {
  if (value === undefined || isTBC(value)) return <TbcLabel className={className} />;
  return <>{format ? format(value) : value}</>;
}
