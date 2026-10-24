import type { Point } from "@/data/site";

/**
 * The three values ("How we work") as a ruled list. `compact` is the small
 * list beside the Home portrait: titles only. The full version on /about
 * adds each value's line. Leave out `heading` when a section heading
 * already names the list.
 */
type ValuesListProps = {
  heading?: string;
  items: Point[];
  compact?: boolean;
  /** Heading level: h3 under a section heading, h2 as its own section. */
  headingAs?: "h2" | "h3";
};

export function ValuesList({ heading, items, compact = false, headingAs: Heading = "h3" }: ValuesListProps) {
  return (
    <div>
      {heading ? (
        <Heading className="mb-space-md font-body text-label-sm uppercase text-secondary">{heading}</Heading>
      ) : null}
      <ul className="border-t border-border-strong">
        {items.map((item, index) => (
          <li
            key={item.title}
            className={["flex gap-space-md border-b border-border", compact ? "py-space-md" : "py-space-lg"].join(" ")}
          >
            <span aria-hidden="true" className="pt-1 text-label-sm tabular-nums text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex flex-col gap-space-xs">
              <span
                className={
                  compact ? "font-display text-headline-sm text-primary" : "font-display text-headline-md text-primary"
                }
              >
                {item.title}
              </span>
              {!compact && item.body ? (
                <span className="max-w-[48ch] text-pretty text-body-lg text-muted">{item.body}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
