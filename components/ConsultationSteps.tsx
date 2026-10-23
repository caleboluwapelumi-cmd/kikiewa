import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { medicalSpa } from "@/data/site";

/**
 * The consultation pathway. Hairline dividers instead of cards, so the three
 * steps read as one sequence rather than three offers.
 */
export function ConsultationSteps() {
  const { pathway, steps } = medicalSpa;

  return (
    <section className="w-full bg-background py-space-xl lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow={pathway.eyebrow}
          heading={pathway.heading}
          body={pathway.body}
          className="mb-space-xl"
        />

        <ol className="grid grid-cols-1 divide-y divide-border border-y border-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {steps.map((step) => (
            <li
              key={step.step}
              className="flex flex-col py-space-lg lg:px-10 lg:py-space-xl lg:first:pl-0 lg:last:pr-0"
            >
              <div className="flex items-center gap-space-sm text-secondary">
                <span className="text-label-md uppercase">{step.step}</span>
                <span className="inline-block h-px w-6 bg-accent" />
                <Icon name={step.icon} className="size-4 shrink-0" />
              </div>

              <h3 className="mt-space-md text-title-lg text-primary">
                {step.title}
              </h3>
              <p className="mt-space-sm text-body-md text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
