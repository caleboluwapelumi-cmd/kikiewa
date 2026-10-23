import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { ctaBand } from "@/data/site";

/**
 * Closing call to action. Full-bleed plum that runs straight into the plum
 * footer, separated only by a hairline — one confident dark finale on every
 * page rather than another light band.
 */
export function CtaBand() {
  return (
    <section
      data-tone="dark"
      className="w-full bg-primary pt-space-2xl pb-space-xl text-on-primary md:pt-space-3xl lg:pt-32 lg:pb-space-2xl"
    >
      <div className="shell">
        <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-12 lg:items-end lg:gap-gutter-desktop">
          <SectionHeading
            eyebrow={ctaBand.eyebrow}
            heading={ctaBand.heading}
            tone="dark"
            size="xl"
            className="lg:col-span-7"
          />

          <div className="flex flex-col items-start gap-space-lg lg:col-span-4 lg:col-start-9 lg:border-l lg:border-on-primary/20 lg:pl-gutter-desktop">
            <p className="text-pretty text-body-lg text-on-primary/80">
              {ctaBand.body}
            </p>
            <Button
              href={ctaBand.cta.href}
              variant="inverse"
              size="lg"
              icon="calendar"
            >
              {ctaBand.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
