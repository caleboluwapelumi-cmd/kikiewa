import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import type { Location } from "@/data/site";

/**
 * Compact branch card: badge, title, blurb, the branch details and two
 * actions. Sized to sit two-up inside a shell, unlike the full-width
 * LocationBlock used by the division pages.
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
      <div className="mb-space-lg flex items-center justify-between gap-space-md">
        <span className="border border-border px-space-sm py-space-xs text-label-sm uppercase text-secondary">
          {location.badge}
        </span>
        <Icon name={location.icon} className="size-5 shrink-0 text-secondary" />
      </div>

      <Title className="text-balance text-headline-md text-primary">
        {location.title}
      </Title>
      <p className="mt-space-sm text-pretty text-body-md text-muted">
        {location.body}
      </p>

      <dl className="mt-space-lg divide-y divide-border border-y border-border">
        {location.details.map((detail) => (
          <div
            key={detail.label}
            className="grid grid-cols-[1rem_1fr] gap-x-space-md py-space-md"
          >
            <Icon
              name={detail.icon}
              className="mt-0.5 size-4 shrink-0 text-secondary"
            />
            <div>
              <dt className="text-label-sm uppercase text-muted">
                {detail.label}
              </dt>
              <dd className="mt-space-xs text-body-md text-foreground">
                {detail.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-x-space-xl gap-y-space-xs pt-space-lg">
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
