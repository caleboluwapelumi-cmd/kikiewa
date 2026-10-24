/**
 * A row of label/value facts between two rules, like a record card:
 * "Duration · From · Location". Values may be <Confirmable> elements.
 * A two-column grid on phones, one row from md.
 */
export type Fact = { label: string; value: React.ReactNode };

export function FactRow({ facts, className = "" }: { facts: Fact[]; className?: string }) {
  return (
    <dl
      className={[
        "grid grid-cols-2 border-y border-border-strong md:flex md:divide-x md:divide-border",
        className,
      ].join(" ")}
    >
      {facts.map((fact, index) => {
        const lastOdd = facts.length % 2 === 1 && index === facts.length - 1;
        return (
          <div
            key={fact.label}
            className={[
              "py-space-md md:min-w-44 md:border-t-0 md:px-space-lg md:first:pl-0",
              index >= 2 ? "border-t border-border" : "",
              index % 2 === 1 ? "border-l border-border pl-space-md" : "",
              lastOdd ? "col-span-2" : "",
            ].join(" ")}
          >
            <dt className="text-label-sm uppercase text-muted">{fact.label}</dt>
            <dd className="mt-space-xs text-body-md text-foreground">{fact.value}</dd>
          </div>
        );
      })}
    </dl>
  );
}
