import { FieldError } from "@/components/form/Field";

/**
 * A radio group drawn as cards. The radios are real (visually hidden, still
 * focusable), so arrow keys move between options and screen readers announce
 * "1 of 6, selected" as usual. The whole card is the label.
 */

export type Choice = {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Small note under the description (e.g. "Suggested name, to confirm"). */
  tag?: React.ReactNode;
  /** Leading glyph. */
  icon?: React.ReactNode;
};

/** The id of one option's radio: error summaries link to the first. */
export function choiceId(name: string, value: string): string {
  return `${name}-${value}`;
}

type ChoiceGroupProps = {
  name: string;
  legend: string;
  /** Keep the legend for screen readers only (the step heading says it). */
  legendHidden?: boolean;
  hint?: string;
  choices: Choice[];
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  /** Grid columns, e.g. "sm:grid-cols-2". */
  columns?: string;
  /** Compact: centred, smaller cards (dates, times). */
  compact?: boolean;
};

export function ChoiceGroup({
  name,
  legend,
  legendHidden = false,
  hint,
  choices,
  value,
  onChange,
  error,
  columns = "sm:grid-cols-2",
  compact = false,
}: ChoiceGroupProps) {
  const hintId = hint ? name + "-hint" : "";
  const errorId = error ? name + "-error" : "";
  const described = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset aria-describedby={described} aria-invalid={error ? true : undefined} className="min-w-0">
      <legend className={legendHidden ? "sr-only" : "mb-space-sm text-title-md text-foreground"}>{legend}</legend>
      {hint ? (
        <p id={hintId} className="mb-space-md text-body-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <div className="mb-space-md">
          <FieldError id={errorId}>{error}</FieldError>
        </div>
      ) : null}
      <div className={["grid grid-cols-1", compact ? "gap-space-sm" : "gap-space-md", columns].join(" ")}>
        {choices.map((choice) => {
          const id = choiceId(name, choice.value);
          const checked = value === choice.value;
          return (
            <label
              key={choice.value}
              htmlFor={id}
              className={[
                "group relative flex cursor-pointer rounded-xs border bg-card transition-[border-color,background-color,box-shadow] duration-200 ease-out-soft",
                "hover:border-primary has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-secondary",
                checked ? "border-primary bg-surface-warm shadow-lift" : error ? "border-error" : "border-border-strong",
                compact
                  ? "min-h-14 flex-col items-center justify-center px-space-sm py-space-sm text-center"
                  : "items-start gap-space-md p-space-md md:p-space-lg",
              ].join(" ")}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={choice.value}
                checked={checked}
                onChange={() => onChange(choice.value)}
                className="sr-only"
              />
              {compact ? null : (
                <span
                  aria-hidden="true"
                  className={[
                    "mt-1 grid size-4 shrink-0 place-items-center rounded-full border transition-colors duration-200",
                    checked ? "border-primary" : "border-border-strong",
                  ].join(" ")}
                >
                  <span className={["size-2 rounded-full bg-primary transition-transform duration-200", checked ? "scale-100" : "scale-0"].join(" ")} />
                </span>
              )}
              {choice.icon && !compact ? <span className="mt-0.5 shrink-0 text-secondary">{choice.icon}</span> : null}
              <span className="flex min-w-0 flex-col gap-space-xs">
                <span className={compact ? "text-title-md text-primary" : "text-title-lg text-primary"}>{choice.label}</span>
                {choice.description ? <span className="text-body-sm text-muted">{choice.description}</span> : null}
                {choice.tag ? <span className="text-label-sm uppercase text-muted">{choice.tag}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
