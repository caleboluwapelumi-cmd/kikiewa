import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { ImageFrame } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { TBC, type Location, type LocationBlockCopy } from "@/data/site";
import { WHATSAPP_FALLBACK_HREF, whatsappLink } from "@/lib/whatsapp";

/**
 * A branch block: heading, the branch details from data/site.ts, a WhatsApp
 * action and a map placeholder. Shared by /medical-spa and /salon-spa.
 *
 * The WhatsApp action falls back to /contact while the number is a
 * placeholder — see lib/whatsapp.ts.
 */

export type LocationTone = "clinical" | "warm";

/**
 * Tone only moves the details column between the page background and the
 * tinted surface — the clinical page states the facts on bare background,
 * the salon page sits them on a warmer panel. No tone-specific colours.
 */
const tones: Record<LocationTone, { grid: string; panel: string }> = {
  clinical: { grid: "", panel: "" },
  warm: {
    grid: "items-start",
    panel: "border border-border bg-surface p-8 lg:p-10",
  },
};

type LocationBlockProps = {
  /** Branch record — title, address, hours, phone, directions. */
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
  const whatsappHref = whatsappLink(TBC.whatsapp, copy.whatsappMessage);
  const isFallback = whatsappHref === WHATSAPP_FALLBACK_HREF;
  const toneClasses = tones[tone];

  return (
    <section className="w-full bg-background py-space-xl lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          body={copy.body}
          className="mb-space-xl"
        />

        <div
          className={[
            "grid grid-cols-1",
            toneClasses.grid,
            "gap-gutter-desktop lg:grid-cols-2 lg:gap-16",
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

            <dl className="mt-space-lg divide-y divide-border border-y border-border">
              {location.details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-start gap-space-md py-space-md"
                >
                  <Icon
                    name={detail.icon}
                    className="mt-1 size-4 shrink-0 text-secondary"
                  />
                  <div>
                    <dt className="text-label-sm uppercase text-muted">
                      {detail.label}
                    </dt>
                    <dd className="mt-space-xs text-body-md text-primary">
                      {detail.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-space-lg flex flex-wrap items-center gap-space-md">
              <Button href={whatsappHref} icon="phone" iconPosition="leading">
                {copy.whatsappLabel}
              </Button>
              <Button
                href={location.directionsHref}
                variant="quiet"
                icon="compass"
              >
                Directions
              </Button>
            </div>

            {isFallback ? (
              <p className="mt-space-md text-body-sm text-muted">
                {TBC.whatsapp}. {copy.fallbackNote}
              </p>
            ) : null}
          </div>

          <div>
            <ImageFrame
              alt={copy.mapAlt}
              ratio="aspect-[4/3]"
              sizes="(max-width: 1024px) 100vw, 45vw"
            >
              <div className="absolute inset-x-6 bottom-6 flex items-center gap-space-sm border border-border bg-background/90 p-space-md">
                <Icon name="pin" className="size-4 shrink-0 text-secondary" />
                <span className="text-label-sm uppercase text-muted">
                  {copy.mapCaption}
                </span>
              </div>
            </ImageFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
