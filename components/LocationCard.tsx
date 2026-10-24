import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { LocationDetails } from "@/components/LocationDetails";
import { site, type Location } from "@/data/site";

/**
 * Compact location card: the place name, what you come there for, the
 * details and two actions. Sized to sit two-up inside a shell, unlike the
 * full-width LocationBlock used on /salon-spa and /medical-spa.
 *
 * Details are hairline-ruled rows rather than nested boxes, so the card stays
 * one surface deep at every width.
 */
type LocationCardProps = {
  location: Location;
  /** Title level — h3 under a section heading, h2 when the page heading is the h1. */
  titleAs?: "h2" | "h3";
};

export function LocationCard({
  location,
  titleAs: Title = "h3",
}: LocationCardProps) {
  return (
    <article className="flex flex-col border border-border bg-card p-space-lg md:p-10 lg:p-12">
      <div className="mb-space-md flex items-center justify-between gap-space-md">
        <span className="text-label-sm uppercase text-secondary">{site.area}</span>
        <Icon name={location.icon} className="size-5 shrink-0 text-secondary" />
      </div>

      <Title className="text-balance text-headline-lg-mobile text-primary lg:text-headline-lg">
        {location.name}
      </Title>
      <p className="mt-space-sm text-pretty text-body-lg text-muted">{location.offer}</p>

      <LocationDetails location={location} className="mt-space-lg" />

      <div className="mt-auto flex flex-wrap items-center gap-x-space-xl gap-y-space-xs pt-space-lg">
        <Button href={location.primaryCta.href}>
          {location.primaryCta.label}
        </Button>
        <Button href={location.href} variant="quiet" icon="compass">
          {location.name} details
        </Button>
      </div>
    </article>
  );
}
