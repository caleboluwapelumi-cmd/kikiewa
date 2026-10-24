import { Button } from "@/components/Button";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icon";
import { ImageFrame } from "@/components/ImageFrame";
import { LocationDetails } from "@/components/LocationDetails";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import { whatsappMessages, type Location } from "@/data/site";

/**
 * One location per page (/locations/ebute, /locations/nitel), for local
 * search: what happens there, its details, how to book, and the map.
 */
export function LocationPage({ location }: { location: Location }) {
  return (
    <>
      <section className="w-full bg-background pt-space-2xl pb-space-3xl md:pt-space-3xl lg:pt-28 lg:pb-32">
        <div className="shell">
          <SectionHeading
            eyebrow={location.services + " • " + location.name}
            heading={location.title}
            body={location.body}
            as="h1"
            size="xl"
            className="mb-space-2xl"
          />

          <div className="grid grid-cols-1 items-start gap-space-2xl lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col">
              <LocationDetails location={location} strong />
              <div className="mt-space-lg flex flex-wrap items-start gap-x-space-xl gap-y-space-md">
                <Button href={location.primaryCta.href} icon="arrowRight">
                  {location.primaryCta.label}
                </Button>
                <WhatsAppAction
                  label="Chat on WhatsApp"
                  variant="subtle"
                  message={location.id === "nitel" ? whatsappMessages.medical : whatsappMessages.salon}
                />
              </div>
            </div>

            <ImageFrame
              alt={`Map showing Kikiewa ${location.shortName}, Ikorodu`}
              ratio="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 45vw"
            >
              <div className="absolute inset-x-6 bottom-6 flex items-center gap-space-sm border border-border bg-background/95 p-space-md md:inset-x-8 md:bottom-8">
                <Icon name="pin" className="size-4 shrink-0 text-secondary" />
                <span className="text-label-sm uppercase text-foreground">{location.area}</span>
              </div>
            </ImageFrame>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
