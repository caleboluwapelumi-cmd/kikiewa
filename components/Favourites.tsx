import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import {
  bookingHref,
  ebuteLocation,
  favourites,
  isTBC,
  nitelLocation,
  services,
} from "@/data/site";
import { formatPriceFrom } from "@/lib/format";

/**
 * "A few favourites": a short ruled list of services from both locations.
 * Skin treatments book a consultation, never the treatment. On Home a price
 * shows only once it is confirmed; nothing says "To be confirmed" here.
 */
export function Favourites() {
  const picks = favourites.slugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service) => service !== undefined);

  return (
    <section className="section-y w-full border-y border-border bg-surface">
      <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
        <SectionHeading heading={favourites.heading} className="lg:col-span-4" />

        <ol className="border-t border-border-strong lg:col-span-8">
          {picks.map((service, index) => {
            const location =
              service.division === "medical-spa" ? nitelLocation : ebuteLocation;
            const consultation = service.requiresConsultation;
            const href = consultation
              ? bookingHref + "?location=nitel&service=consultation"
              : bookingHref + "?location=" + location.id + "&service=" + service.slug;

            return (
              <li
                key={service.slug}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-space-lg gap-y-space-md border-b border-border py-space-lg md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:py-space-xl"
              >
                <span
                  aria-hidden="true"
                  className="pt-1 text-label-sm uppercase tabular-nums text-secondary md:pt-0"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="text-headline-sm text-primary">{service.name}</h3>
                  <p className="mt-space-xs max-w-[52ch] text-pretty text-body-md text-muted">
                    {service.summary}
                  </p>
                  <p className="mt-space-sm flex flex-wrap gap-x-space-md gap-y-space-xs text-label-sm uppercase text-muted">
                    <span>{location.area}</span>
                    {isTBC(service.priceFrom) || service.priceFrom === undefined ? null : (
                      <span className="text-foreground">{formatPriceFrom(service.priceFrom)}</span>
                    )}
                  </p>
                </div>

                <div className="col-start-2 md:col-start-3">
                  <Button href={href} variant="subtle" size="sm">
                    {consultation ? favourites.consultationLabel : favourites.bookLabel}
                  </Button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
