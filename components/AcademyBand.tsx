import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { academyBand } from "@/data/site";

/**
 * The Academy on Home: a narrow band, heading on the left, one line and one
 * action on the right. Quieter than a full section on purpose.
 */
export function AcademyBand() {
  return (
    <section className="w-full border-y border-border bg-surface py-space-2xl lg:py-space-3xl">
      <div className="shell grid grid-cols-1 gap-space-lg lg:grid-cols-12 lg:items-end lg:gap-gutter-desktop">
        <SectionHeading
          eyebrow={academyBand.eyebrow}
          heading={academyBand.heading}
          className="lg:col-span-6"
        />
        <div className="flex flex-col items-start gap-space-lg lg:col-span-5 lg:col-start-8">
          <p className="max-w-[48ch] text-pretty text-body-lg text-muted">{academyBand.body}</p>
          <Button href={academyBand.cta.href} variant="quiet" icon="arrowRight">
            {academyBand.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
