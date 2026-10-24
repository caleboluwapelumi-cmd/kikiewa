import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { isTBC, medicalSpa } from "@/data/site";

/**
 * The consultation pathway. Hairline dividers instead of cards, so the three
 * steps read as one sequence rather than three offers; large Bodoni numerals
 * carry the order.
 */
export function ConsultationSteps() {
  const { pathway, steps } = medicalSpa;

  return (
    <section className="section-y w-full bg-background">
      <div className="shell">
        <SectionHeading
          eyebrow={pathway.eyebrow}
          heading={pathway.heading}
          body={pathway.body}
          className="mb-space-2xl"
        />

        <ol className="grid grid-cols-1 divide-y divide-border border-y border-border-strong lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {steps.map((step) => (
            <li
              key={step.step}
              className="flex flex-col py-space-xl lg:px-8 lg:py-space-2xl lg:first:pl-0 lg:last:pr-0"
            >
              <div className="flex items-end justify-between">
                <span
                  aria-hidden="true"
                  className="font-display text-headline-lg-mobile leading-none text-secondary lg:text-headline-lg"
                >
                  {step.step}
                </span>
                <Icon name={step.icon} className="size-5 text-secondary" />
              </div>

              <h3 className="mt-space-lg text-headline-sm text-primary">
                <span className="sr-only">Step {step.step}: </span>
                {step.title}
              </h3>
              <p className="mt-space-sm max-w-[42ch] text-pretty text-body-md text-muted">
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
