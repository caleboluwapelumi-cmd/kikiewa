/**
 * The large serif paragraph that follows a page hero (the service intro).
 * Set in the display face as an editorial lead. With a `label`, the label
 * sits in a narrow column beside it, like a margin note.
 */
type IntroStatementProps = {
  text: string;
  /** Hairline above. Turn off when the hero already ends with one. */
  rule?: boolean;
  label?: string;
};

export function IntroStatement({ text, rule = true, label }: IntroStatementProps) {
  const statement = (
    <p className="max-w-[34em] font-display text-lead text-foreground">
      {text}
    </p>
  );

  return (
    <div
      className={[
        "w-full bg-background py-space-2xl md:py-space-3xl lg:py-32",
        rule ? "border-t border-border" : "",
      ].join(" ")}
    >
      <div className="shell">
        {label ? (
          <div className="grid grid-cols-1 gap-space-md lg:grid-cols-12 lg:gap-gutter-desktop">
            <p className="flex items-center gap-3 self-start text-label-sm uppercase text-muted lg:col-span-3 lg:pt-3">
              <span aria-hidden="true" className="inline-block h-px w-8 shrink-0 bg-border-strong" />
              {label}
            </p>
            <div className="lg:col-span-9">{statement}</div>
          </div>
        ) : (
          statement
        )}
      </div>
    </div>
  );
}
