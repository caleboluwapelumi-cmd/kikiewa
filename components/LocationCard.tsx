import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import type { Location } from "@/data/site";

/**
 * Compact branch card: badge, title, blurb, the branch details and two
 * actions. Sized to sit two-up inside a shell, unlike the full-width
 * LocationBlock used by the division pages.
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
    <article className="flex flex-col justify-between rounded-xs bg-surface p-8 shadow-sm lg:p-10">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <span className="rounded-xs bg-background px-3 py-1 text-label-sm uppercase text-secondary">
            {location.badge}
          </span>
          <Icon name={location.icon} className="size-5 text-muted" />
        </div>

        <Title className="mb-2 text-headline-md text-primary">
          {location.title}
        </Title>
        <p className="mb-8 text-body-sm text-muted">{location.body}</p>

        <dl className="mb-8 space-y-4">
          {location.details.map((detail) => (
            <div
              key={detail.label}
              className="flex items-start gap-3 rounded-xs bg-background p-4"
            >
              <Icon
                name={detail.icon}
                className="mt-0.5 size-4 shrink-0 text-secondary"
              />
              <div>
                <dt className="block text-label-sm uppercase text-muted">
                  {detail.label}
                </dt>
                <dd className="text-body-md text-primary">{detail.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-wrap items-center gap-space-md pt-4">
        <Button href={location.primaryCta.href}>
          {location.primaryCta.label}
        </Button>
        <Button href={location.directionsHref} variant="quiet" icon="compass">
          Directions
        </Button>
      </div>
    </article>
  );
}
