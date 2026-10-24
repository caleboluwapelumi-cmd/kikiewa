import { Button } from "@/components/Button";
import { Confirmable } from "@/components/Confirmable";
import { Icon } from "@/components/Icon";
import {
  bookingHref,
  categoriesFor,
  servicesFor,
  type ServiceDivision,
} from "@/data/site";
import { formatDuration, formatPriceFrom } from "@/lib/format";

/**
 * A division's service menu, grouped by category and set as a ruled list:
 * name and summary, then duration and "from" price (or "To be confirmed"),
 * then the booking action. Medical treatments that need a consultation book
 * the consultation, never the treatment.
 */
export function ServiceMenu({ division }: { division: ServiceDivision }) {
  const items = servicesFor(division);
  const groups = categoriesFor(division)
    .map((category) => ({
      category,
      services: items.filter((service) => service.category === category.slug),
    }))
    .filter((group) => group.services.length > 0);

  return (
    <section className="section-y w-full border-t border-border bg-background">
      <div className="shell flex flex-col gap-space-2xl">
        {groups.map(({ category, services }) => (
          <div
            key={category.slug}
            className="grid grid-cols-1 gap-space-lg lg:grid-cols-12 lg:gap-gutter-desktop"
          >
            <h2 className="flex items-center gap-space-sm self-start text-headline-sm text-primary lg:col-span-3 lg:pt-space-lg">
              <Icon name={category.icon} className="size-5 shrink-0 text-secondary" />
              {category.name}
            </h2>

            <ul className="border-t border-border-strong lg:col-span-9">
              {services.map((service) => (
                <li
                  key={service.slug}
                  className="grid grid-cols-1 gap-space-md border-b border-border py-space-lg md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-space-xl"
                >
                  <div>
                    <h3 className="font-body text-title-lg text-foreground">
                      {service.name}
                    </h3>
                    <p className="mt-space-xs max-w-[56ch] text-pretty text-body-md text-muted">
                      {service.summary}
                    </p>
                    {service.requiresConsultation ? (
                      <p className="mt-space-sm flex items-center gap-space-sm text-label-sm uppercase text-secondary">
                        <Icon name="notes" className="size-4 shrink-0" />
                        Consultation first
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-start gap-space-md md:items-end">
                    <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-space-md gap-y-space-xs text-body-sm md:text-right">
                      <dt className="text-label-sm uppercase text-muted">Duration</dt>
                      <dd className="text-foreground">
                        <Confirmable value={service.durationMins} format={formatDuration} />
                      </dd>
                      <dt className="text-label-sm uppercase text-muted">Price</dt>
                      <dd className="text-foreground">
                        <Confirmable value={service.priceFrom} format={formatPriceFrom} />
                      </dd>
                    </dl>
                    <Button
                      href={
                        bookingHref +
                        "?service=" +
                        (service.requiresConsultation ? "consultation" : service.slug)
                      }
                      variant="subtle"
                      size="sm"
                    >
                      {service.requiresConsultation ? "Book a consultation" : "Book"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
