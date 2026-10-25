import Link from "next/link";
import { Button, ButtonGroup } from "@/components/Button";
import { DirectionsAction } from "@/components/DirectionsAction";
import { Icon } from "@/components/Icon";
import { LocationDetails } from "@/components/LocationDetails";
import { MapEmbed } from "@/components/MapEmbed";
import { cta, site, type Location } from "@/data/site";

/**
 * Branch card. Both branches use exactly this card with exactly the same
 * fields: they are equals. Address, hours, phone, the click-to-load map
 * where `withMap` is set (/locations, /contact), then Book here and Get
 * directions.
 */
type LocationCardProps = {
  location: Location;
  /** Title level: h3 under a section heading, h2 when the page heading is the h1. */
  titleAs?: "h2" | "h3";
  withMap?: boolean;
};

export function LocationCard({ location, titleAs: Title = "h3", withMap = false }: LocationCardProps) {
  return (
    <article className="flex flex-col rounded-card border border-border bg-card p-space-lg md:p-10 lg:p-12">
      <div className="mb-space-md flex items-center justify-between gap-space-md">
        <span className="text-label-sm uppercase text-secondary">{site.area}</span>
        <Icon name="pin" className="size-5 shrink-0 text-secondary" />
      </div>

      <Title className="text-headline-lg text-primary">
        <Link href={location.href} className="link-touch hover:text-secondary">
          {location.title}
        </Link>
      </Title>

      <LocationDetails location={location} className="mt-space-lg" />
      {withMap ? <MapEmbed location={location} className="mt-space-lg" /> : null}

      <ButtonGroup className="mt-auto pt-space-lg">
        <Button href={location.bookHref}>
          {cta.bookHere}
          <span className="sr-only">: {location.title}</span>
        </Button>
        <DirectionsAction location={location} />
      </ButtonGroup>
    </article>
  );
}
