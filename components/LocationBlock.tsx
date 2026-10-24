import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { ImageFrame, type ImageTone } from "@/components/ImageFrame";
import { LocationDetails } from "@/components/LocationDetails";
import { SectionHeading } from "@/components/SectionHeading";
import { contact, type Location, type LocationBlockCopy } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * A location block: heading, the location details from data/site.ts, a
 * WhatsApp action and a map placeholder showing the area. Shared by /medical-spa and /salon-spa.
 *
 * The WhatsApp action falls back to /contact while the number is a
 * placeholder — see lib/whatsapp.ts.
 */

export type LocationTone = "clinical" | "warm";

/**
 * Tone changes the setting, not the palette: the clinical page states the
 * facts on bare background beside a neutral frame; the salon page sits them
 * on a card panel, on the tinted surface, beside an accent-washed frame.
 */
const tones: Record<
  LocationTone,
  { section: string; grid: string; panel: string; image: ImageTone }
> = {
  clinical: {
    section: "border-t border-border bg-background",
    grid: "items-start",
    panel: "",
    image: "neutral",
  },
  warm: {
    section: "border-t border-border bg-surface",
    grid: "items-start",
    panel: "border border-border bg-card p-space-lg md:p-10",
    image: "warm",
  },
};

type LocationBlockProps = {
  /** Location record — title, address, hours, phone, page link. */
  location: Location;
  /** Section copy for this page, including its heading and button label. */
  copy: LocationBlockCopy;
  tone?: LocationTone;
};

export function LocationBlock({
  location,
  copy,
  tone = "clinical",
}: LocationBlockProps) {
  const whatsappHref = whatsappLink(contact.whatsapp, copy.whatsappMessage);
  const toneClasses = tones[tone];

  return (
    <section className={"section-y w-full " + toneClasses.section}>
      <div className="shell">
        <SectionHeading
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          body={copy.body}
          className="mb-space-2xl"
        />

        <div
          className={[
            "grid grid-cols-1",
            toneClasses.grid,
            "gap-space-2xl lg:grid-cols-2 lg:gap-16",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            className={["flex flex-col", toneClasses.panel]
              .filter(Boolean)
              .join(" ")}
          >
            <h3 className="text-headline-sm text-primary">{location.title}</h3>

            <LocationDetails location={location} strong className="mt-space-lg" />

            <div className="mt-space-lg flex flex-wrap items-center gap-x-space-xl gap-y-space-xs">
              <Button href={whatsappHref} icon="whatsapp" iconPosition="leading">
                {copy.whatsappLabel}
              </Button>
              <Button href={location.href} variant="quiet" icon="compass">
                {location.name} details
              </Button>
            </div>

          </div>

          <div>
            <ImageFrame
              alt={copy.mapAlt}
              ratio="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 45vw"
              tone={toneClasses.image}
            >
              <div className="absolute inset-x-6 bottom-6 flex items-center gap-space-sm border border-border bg-background/95 p-space-md md:inset-x-8 md:bottom-8">
                <Icon name="pin" className="size-4 shrink-0 text-secondary" />
                <span className="text-label-sm uppercase text-foreground">{location.area}</span>
              </div>
            </ImageFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
