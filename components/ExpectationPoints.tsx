import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { salonSpa } from "@/data/site";

/**
 * "What to expect" — three plain assurances on the warm wash, the warmest
 * surface on the page. One sentence each, no specifics we cannot stand behind.
 */
export function ExpectationPoints() {
  const { expectIntro, expectations } = salonSpa;

  return (
    <section className="section-y w-full border-y border-border bg-surface-warm">
      <div className="shell">
        <SectionHeading
          eyebrow={expectIntro.eyebrow}
          heading={expectIntro.heading}
          body={expectIntro.body}
          className="mb-space-2xl"
        />

        <ul className="grid grid-cols-1 gap-space-xl md:grid-cols-2 md:gap-gutter-desktop lg:grid-cols-4">
          {expectations.map((point) => (
            <li key={point.title} className="flex flex-col border-t border-accent pt-space-lg">
              <Icon name={point.icon} className="size-6 text-secondary" />
              <h3 className="mt-space-lg text-headline-sm text-primary">
                {point.title}
              </h3>
              <p className="mt-space-sm max-w-[40ch] text-pretty text-body-md text-muted">
                {point.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
