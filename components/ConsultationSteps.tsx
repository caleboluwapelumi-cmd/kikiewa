import { SectionHeading } from "@/components/SectionHeading";
import { isTBC, medicalSpa } from "@/data/site";

/**
 * The consultation pathway as a ruled timeline: one plum rule with a small
 * square stop per step, the step number as a label, then title and body. No
 * icons or display numerals; the sequence itself is the design. Vertical on
 * mobile, four columns from lg.
 */
type ConsultationStepsProps = {
  /** Section id, for in-page links. */
  id?: string;
  /** Overrides for reuse on detail pages ("What to expect"). */
  eyebrow?: string | null;
  heading?: string;
  /** "surface" sets the steps on the deeper band. */
  surface?: "background" | "surface";
};

export function ConsultationSteps({
  id,
  eyebrow,
  heading,
  surface = "background",
}: ConsultationStepsProps) {
  const { pathway, steps } = medicalSpa;

  return (
    <section
      id={id}
      className={[
        "section-y w-full border-t border-border",
        surface === "surface" ? "bg-surface" : "bg-background",
      ].join(" ")}
    >
      <div className="shell">
        <SectionHeading
          eyebrow={eyebrow === null ? undefined : (eyebrow ?? pathway.eyebrow)}
          heading={heading ?? pathway.heading}
          body={pathway.body}
          className="mb-space-2xl lg:mb-space-3xl"
        />

        <ol className="grid grid-cols-1 border-l border-primary/30 lg:grid-cols-4 lg:border-t lg:border-l-0">
          {steps.map((step) => (
            <li
              key={step.step}
              className="relative flex flex-col pb-space-xl pl-space-lg last:pb-0 lg:pt-space-xl lg:pr-space-xl lg:pb-0 lg:pl-0"
            >
              {/* The stop on the rule */}
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[4.5px] size-2 bg-primary lg:-top-[4.5px] lg:left-0"
              />
              <p className="text-label-sm uppercase tabular-nums text-secondary">
                <span className="sr-only">Step </span>
                {step.step}
              </p>
              <h3 className="mt-space-sm text-headline-sm text-primary lg:mt-space-md">
                {step.title}
              </h3>
              <p className="mt-space-sm max-w-[40ch] text-pretty text-body-md text-muted">
                {step.body}
              </p>
              {step.note && !isTBC(step.note.value) ? (
                <p className="mt-space-md flex flex-wrap items-baseline gap-x-space-sm gap-y-space-xs text-label-sm uppercase text-foreground">
                  {step.note.label}
                  <span>{step.note.value}</span>
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
