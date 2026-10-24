import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import type { NavLink } from "@/data/site";

/**
 * The closing step on a skin & aesthetics detail page: an optional heading,
 * a short line (or the disclaimer, set small), and the booking action with
 * an optional quiet secondary link.
 */
type NextStepProps = {
  heading?: string;
  body: string;
  /** Set the body as small print (disclaimers). */
  smallPrint?: boolean;
  action: NavLink;
  secondary?: NavLink & { whatsapp?: boolean };
};

export function NextStep({ heading, body, smallPrint = false, action, secondary }: NextStepProps) {
  return (
    <section
      className={[
        "w-full border-t border-border bg-background",
        // Without a heading it is a single line: a compact strip
        heading ? "section-y" : "py-space-2xl md:py-space-3xl",
      ].join(" ")}
    >
      <div
        className={[
          "shell grid grid-cols-1 gap-space-xl lg:grid-cols-12 lg:gap-gutter-desktop",
          heading ? "lg:items-end" : "lg:items-center",
        ].join(" ")}
      >
        <div className="lg:col-span-7">
          {heading ? <SectionHeading heading={heading} body={body} /> : null}
          {!heading ? (
            <p
              className={
                smallPrint
                  ? "max-w-[60ch] border-l border-border-strong pl-space-md text-pretty text-body-sm text-muted"
                  : "max-w-[60ch] text-pretty text-body-lg text-muted"
              }
            >
              {body}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-x-space-xl gap-y-space-sm lg:col-span-5 lg:justify-end">
          <Button href={action.href} size="lg" icon="arrowRight">
            {action.label}
          </Button>
          {secondary ? (
            <Button
              href={secondary.href}
              size="lg"
              variant="quiet"
              icon={secondary.whatsapp ? "whatsapp" : undefined}
              iconPosition="leading"
            >
              {secondary.label}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
