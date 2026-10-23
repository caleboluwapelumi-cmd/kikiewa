import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { medicalSpa } from "@/data/site";

/**
 * The six treatment areas. Text-only cards — the design brief rules out
 * before/after imagery, so each card carries an icon and a placeholder
 * until treatment copy is confirmed.
 */
export function TreatmentCards() {
  const { treatments, treatmentsIntro } = medicalSpa;

  return (
    <section className="w-full border-y border-border bg-surface py-space-xl lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow={treatmentsIntro.eyebrow}
          heading={treatmentsIntro.heading}
          body={treatmentsIntro.body}
          className="mb-space-xl"
        />

        <ul className="grid grid-cols-1 gap-gutter-desktop md:grid-cols-2 lg:grid-cols-3">
          {treatments.map((treatment) => (
            <li
              key={treatment.title}
              className="flex flex-col border border-border bg-card p-8 lg:p-10"
            >
              <Icon name={treatment.icon} className="size-6 text-secondary" />
              <h3 className="mt-space-lg text-headline-sm text-primary">
                {treatment.title}
              </h3>
              <span
                aria-hidden="true"
                className="mt-space-md block h-px w-10 bg-accent"
              />
              <p className="mt-space-md text-body-sm text-muted">
                {treatment.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
