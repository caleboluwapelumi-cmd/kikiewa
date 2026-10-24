/**
 * Label/value facts as a ruled table: one row per fact, label on the left,
 * value on the right. Values may be <Confirmable> elements, so unconfirmed
 * details read "To be confirmed".
 */
export type Fact = { label: string; value: React.ReactNode };

export function FactTable({ facts, className = "" }: { facts: Fact[]; className?: string }) {
  return (
    <dl className={["border-t border-border-strong", className].join(" ")}>
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="grid grid-cols-1 gap-space-xs border-b border-border py-space-md sm:grid-cols-[minmax(0,12rem)_1fr] sm:items-baseline sm:gap-space-lg sm:py-space-lg"
        >
          <dt className="text-label-sm uppercase text-muted">{fact.label}</dt>
          <dd className="text-body-lg text-foreground">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
