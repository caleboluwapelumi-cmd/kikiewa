import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { salonSpa } from "@/data/site";

/**
 * "What to expect" — three plain assurances on a soft accent wash, the warmest
 * surface on the page. One sentence each, no specifics we cannot stand behind.
 */
export function ExpectationPoints() {
  const { expectIntro, expectations } = salonSpa;

  return (
    <section className="w-full border-y border-border bg-accent/10 py-space-xl lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow={expectIntro.eyebrow}
          heading={expectIntro.heading}
          body={expectIntro.body}
          className="mb-space-xl"
        />

        <ul className="grid grid-cols-1 gap-gutter-desktop md:grid-cols-3">
          {expectations.map((point) => (
            <li key={point.title} className="flex flex-col">
              <Icon name={point.icon} className="size-6 text-secondary" />
              <h3 className="mt-space-md text-title-lg text-primary">
                {point.title}
              </h3>
              <span
                aria-hidden="true"
                className="mt-space-md block h-px w-10 bg-accent"
              />
              <p className="mt-space-md text-body-md text-muted">{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
