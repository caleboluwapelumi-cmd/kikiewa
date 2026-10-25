import { Button, ButtonGroup } from "@/components/Button";
import { Logo } from "@/components/brand/Logo";
import { SectionHeading } from "@/components/SectionHeading";
import { ctaBand, type NavLink } from "@/data/site";

/**
 * Closing call to action. Full-bleed plum that runs straight into the plum
 * footer, separated only by a hairline — one confident dark finale on every
 * page rather than another light band. The mono logo signs it off in cream.
 *
 * Aesthetics swaps both actions for their consultation versions: that page
 * never offers "Book an appointment".
 */
type CtaBandProps = {
  primary?: NavLink;
  secondary?: NavLink;
};

export function CtaBand({ primary = ctaBand.cta, secondary = ctaBand.secondaryCta }: CtaBandProps = {}) {
  return (
    <section
      data-tone="dark"
      className="w-full bg-primary pt-space-2xl pb-space-xl text-on-primary md:pt-space-3xl lg:pt-32 lg:pb-space-2xl"
    >
      <div className="shell">
        <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-12 lg:items-end lg:gap-gutter-desktop">
          <SectionHeading
            heading={ctaBand.heading}
            tone="dark"
            size="xl"
            className="lg:col-span-7"
          />

          <div className="flex flex-col items-start gap-space-lg lg:col-span-4 lg:col-start-9 lg:border-l lg:border-on-primary/20 lg:pl-gutter-desktop">
            <Logo variant="mono" className="h-12 w-auto text-cream" />
            <p className="text-body-lg text-on-primary/80">
              {ctaBand.body}
            </p>
            <ButtonGroup stack className="w-full">
              <Button href={primary.href} variant="onDark">
                {primary.label}
              </Button>
              <Button href={secondary.href} variant="whatsapp" tone="dark">
                {secondary.label}
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
