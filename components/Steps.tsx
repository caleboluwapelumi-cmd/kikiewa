import { SectionHeading } from "@/components/SectionHeading";
import type { Point } from "@/data/site";

/**
 * Numbered steps as a ruled timeline: one plum rule with a small square
 * stop per step, the step number as a label, then title and optional body.
 * Vertical on mobile, one row from lg. Used for "What to expect" and
 * "How to apply".
 */
type StepsProps = {
  id?: string;
  eyebrow?: string;
  heading: string;
  steps: Point[];
  /** Small print under the steps (e.g. entry requirements). */
  note?: React.ReactNode;
  surface?: "background" | "surface";
};

export function Steps({ id, eyebrow, heading, steps, note, surface = "background" }: StepsProps) {
  const columns = steps.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";
  return (
    <section
      id={id}
      className={[
        "section-y w-full border-t border-border",
        surface === "surface" ? "bg-surface" : "bg-background",
      ].join(" ")}
    >
      <div className="shell">
        <SectionHeading eyebrow={eyebrow} heading={heading} className="mb-space-2xl lg:mb-space-3xl" />

        <ol className={["grid grid-cols-1 border-l border-primary/30 lg:border-t lg:border-l-0", columns].join(" ")}>
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative flex flex-col pb-space-xl pl-space-lg last:pb-0 lg:pt-space-xl lg:pr-space-xl lg:pb-0 lg:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[4.5px] size-2 bg-primary lg:-top-[4.5px] lg:left-0"
              />
              <p className="text-label-sm uppercase tabular-nums text-secondary">
                <span className="sr-only">Step </span>
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-space-sm text-headline-sm text-primary lg:mt-space-md">{step.title}</h3>
              {step.body ? (
                <p className="mt-space-sm max-w-[40ch] text-pretty text-body-md text-muted">{step.body}</p>
              ) : null}
            </li>
          ))}
        </ol>
        {note ? <div className="mt-space-2xl">{note}</div> : null}
      </div>
    </section>
  );
}
