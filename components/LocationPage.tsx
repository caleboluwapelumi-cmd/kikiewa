import { Button } from "@/components/Button";
import { TbcLabel } from "@/components/Confirmable";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icon";
import { ImageFrame } from "@/components/ImageFrame";
import { LocationDetails } from "@/components/LocationDetails";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import type { Location } from "@/data/site";

/**
 * One branch per page (/locations/ebute, /locations/nitel), for local
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
                  label="Message us"
                  variant="subtle"
                  message={`Hello Kikiewa, I have a question about the ${location.name} branch.`}
                />
              </div>
            </div>

            <ImageFrame
              alt={`Map showing the Kikiewa ${location.name} branch in Lagos`}
              ratio="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 45vw"
            >
              <div className="absolute inset-x-6 bottom-6 flex items-center gap-space-sm border border-border bg-background/95 p-space-md md:inset-x-8 md:bottom-8">
                <Icon name="pin" className="size-4 shrink-0 text-secondary" />
                <span className="text-label-sm uppercase text-foreground">Map</span>
                <TbcLabel />
              </div>
            </ImageFrame>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
