import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button, ButtonGroup } from "@/components/Button";
import { CtaBand } from "@/components/CtaBand";
import { DirectionsAction } from "@/components/DirectionsAction";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { LocationDetails } from "@/components/LocationDetails";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import {
  breadcrumbRoots,
  cta,
  locationLabels,
  locations,
  serviceCategories,
  site,
  whatsappMessages,
  type Location,
} from "@/data/site";
import { bookingWhatsappNumber } from "@/lib/booking/submit";
import { locationJsonLd } from "@/lib/jsonld";
import { telHref } from "@/lib/phone";

/**
 * One location per page (/locations/ebute, /locations/nitel). Both use this
 * exact layout: they are equals, and differ only in their details. Every
 * service is listed at both unless a service says otherwise. The foot of
 * each page links to the other, the same way.
 */
export function LocationPage({ location }: { location: Location }) {
  const tel = telHref(location.phone);
  const others = locations.filter((entry) => entry.id !== location.id);

  return (
    <>
      <JsonLd data={locationJsonLd(location)} />
      <section className="w-full bg-background pt-space-lg pb-space-3xl md:pt-space-xl lg:pb-32">
        <div className="shell">
          <Breadcrumbs
            trail={[breadcrumbRoots.home, breadcrumbRoots.locations, { label: location.title, href: location.href }]}
            className="mb-space-xl lg:mb-space-2xl"
          />
          <SectionHeading eyebrow={site.area} heading={location.heading} as="h1" size="xl" className="mb-space-2xl" />

          <div className="grid grid-cols-1 items-start gap-space-2xl lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col">
              <LocationDetails location={location} withLandmark strong />
              <ButtonGroup className="mt-space-lg">
                <Button href={location.bookHref}>{cta.bookHere}</Button>
                {tel ? (
                  <Button href={tel} variant="secondary">
                    {locationLabels.call}
                  </Button>
                ) : null}
                <WhatsAppAction
                  label={cta.whatsapp}
                  message={whatsappMessages.general}
                  number={bookingWhatsappNumber(location)}
                />
                <DirectionsAction location={location} />
              </ButtonGroup>
            </div>

            <div>
              <h2 className="mb-space-md font-body text-label-sm uppercase text-secondary">
                {locationLabels.servicesHeading}
              </h2>
              <ul className="border-t border-border-strong">
                {serviceCategories.map((category) => (
                  <li key={category.slug} className="border-b border-border">
                    <Link
                      href={category.href}
                      className="group flex items-center justify-between gap-space-md py-space-md font-display text-headline-sm text-primary transition-colors duration-200 hover:text-secondary"
                    >
                      <span className="flex items-center gap-space-md">
                        <Icon name={category.icon} className="size-5 shrink-0 text-secondary" />
                        {category.name}
                      </span>
                      <Icon
                        name="arrowRight"
                        className="size-4 shrink-0 text-secondary transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="other-location-heading" className="w-full border-t border-border bg-surface py-space-2xl">
        <div className="shell flex flex-col gap-space-md md:flex-row md:items-center md:justify-between">
          <h2 id="other-location-heading" className="font-body text-label-sm uppercase text-secondary">
            {locationLabels.otherHeading}
          </h2>
          <ul className="flex flex-col gap-space-sm">
            {others.map((other) => (
              <li key={other.id}>
                <Link
                  href={other.href}
                  className="group inline-flex min-h-12 items-center gap-space-md font-display text-headline-md text-primary hover:text-secondary"
                >
                  {other.title}
                  <Icon name="arrowRight" className="size-5 transition-transform duration-300 ease-out-soft group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
