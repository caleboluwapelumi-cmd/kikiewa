import { Confirmable } from "@/components/Confirmable";
import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { categoriesFor, medicalSpa } from "@/data/site";

/**
 * The six treatment areas, set as a ruled register — a grid of cells divided
 * by single hairlines, like a clinical schedule rather than a row of offers.
 * The design brief rules out before/after imagery, so each cell carries an
 * icon and its summary, which stays "To be confirmed" until treatment copy
 * is approved. Reads the medical spa categories from data/site.ts.
 */
export function TreatmentCards() {
  const { treatmentsIntro } = medicalSpa;
  const treatments = categoriesFor("medical-spa");

  return (
    <section className="section-y w-full border-y border-border bg-surface">
      <div className="shell">
        <SectionHeading
          eyebrow={treatmentsIntro.eyebrow}
          heading={treatmentsIntro.heading}
          body={treatmentsIntro.body}
          className="mb-space-2xl"
        />

        {/* 1px gaps over the border colour draw the dividing rules */}
        <ul className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {treatments.map((treatment, index) => (
            <li key={treatment.slug} className="flex flex-col bg-card p-space-lg md:p-8 lg:p-10">
              <div className="flex items-center justify-between text-secondary">
                <span className="text-label-sm uppercase tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Icon name={treatment.icon} className="size-5" />
              </div>
              <h3 className="mt-space-md text-headline-sm text-primary md:mt-space-xl">
                {treatment.name}
              </h3>
              <p className="mt-space-sm text-body-sm text-muted">
                <Confirmable value={treatment.summary} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
