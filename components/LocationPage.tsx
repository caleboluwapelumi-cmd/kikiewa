import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
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
  serviceCategories,
  whatsappMessages,
  type Location,
} from "@/data/site";
import { locationJsonLd } from "@/lib/jsonld";

/**
 * One location per page (/locations/ebute, /locations/nitel). Both use this
 * exact layout: they are equals, and differ only in their details. Every
 * service is listed at both unless a service says otherwise.
 */
export function LocationPage({ location }: { location: Location }) {
  return (
    <>
      <JsonLd data={locationJsonLd(location)} />
      <section className="w-full bg-background pt-space-lg pb-space-3xl md:pt-space-xl lg:pb-32">
        <div className="shell">
          <Breadcrumbs
            trail={[breadcrumbRoots.home, breadcrumbRoots.locations, { label: location.title, href: location.href }]}
            className="mb-space-xl lg:mb-space-2xl"
          />
          <SectionHeading heading={location.heading} as="h1" size="xl" className="mb-space-2xl" />

          <div className="grid grid-cols-1 items-start gap-space-2xl lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col">
              <LocationDetails location={location} withLandmark strong />
              <div className="mt-space-lg flex flex-wrap items-center gap-x-space-xl gap-y-space-md">
                <Button href={location.bookHref} icon="arrowRight">
                  {cta.bookHere}
                </Button>
                <WhatsAppAction label={cta.whatsapp} variant="subtle" message={whatsappMessages.general} />
                <DirectionsAction location={location} />
              </div>
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
      <CtaBand />
    </>
  );
}
