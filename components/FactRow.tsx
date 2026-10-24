/**
 * A row of label/value facts between two rules, like a record card:
 * "Duration · From · Location". Values may be <Confirmable> elements.
 * A two-column grid on phones and tablets, one row from lg.
 */
export type Fact = { label: string; value: React.ReactNode };

export function FactRow({ facts, className = "" }: { facts: Fact[]; className?: string }) {
  return (
    <dl
      className={[
        "grid grid-cols-2 border-y border-border-strong lg:flex lg:divide-x lg:divide-border",
        className,
      ].join(" ")}
    >
      {facts.map((fact, index) => {
        const lastOdd = facts.length % 2 === 1 && index === facts.length - 1;
        return (
          <div
            key={fact.label}
            className={[
              "py-space-md lg:min-w-44 lg:border-t-0 lg:border-l-0 lg:px-space-lg lg:first:pl-0",
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
