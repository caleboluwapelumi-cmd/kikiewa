/**
 * The large serif paragraph that follows a page hero (copy deck: "Intro").
 * Set in the display face as an editorial lead, with nothing beside it.
 */
type IntroStatementProps = {
  text: string;
  /** Hairline above. Turn off when the hero already ends with one. */
  rule?: boolean;
};

export function IntroStatement({ text, rule = true }: IntroStatementProps) {
  return (
    <div
      className={[
        "w-full bg-background py-space-2xl md:py-space-3xl lg:py-32",
        rule ? "border-t border-border" : "",
      ].join(" ")}
    >
      <div className="shell">
        <p className="max-w-[34em] text-pretty font-display text-lead-mobile text-foreground lg:text-lead">
          {text}
        </p>
      </div>
    </div>
  );
}
