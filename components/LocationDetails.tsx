import { Confirmable } from "@/components/Confirmable";
import { Icon, type IconName } from "@/components/Icon";
import { site, type Location } from "@/data/site";
import { telHref } from "@/lib/phone";

/**
 * A location's address, hours and phone as hairline-ruled rows. Unconfirmed
 * values show the "To be confirmed" label; the phone becomes a tel: link once
 * it is confirmed.
 */

type LocationDetailsProps = {
  location: Location;
  /** Stronger outer rules for the full-width location block. */
  strong?: boolean;
  className?: string;
};

export function LocationDetails({
  location,
  strong = false,
  className = "",
}: LocationDetailsProps) {
  const tel = telHref(location.phone);

  const rows: { icon: IconName; label: string; value: React.ReactNode }[] = [
    {
      icon: "home",
      label: "Address",
      value: (
        <span className="flex flex-col gap-space-xs">
          <span>
            <Confirmable value={location.address} />
          </span>
          <span>
            {location.name}, {site.area}
          </span>
        </span>
      ),
    },
    {
      icon: "clock",
      label: "Opening hours",
      value: <Confirmable value={location.hours} />,
    },
    {
      icon: "phone",
      label: location.phoneLabel,
      value: tel ? (
        <a href={tel} className="link-rule hover:text-secondary">
          {location.phone}
        </a>
      ) : (
        <Confirmable value={location.phone} />
      ),
    },
  ];

  return (
    <dl
      className={[
        "divide-y divide-border border-y",
        strong ? "border-border-strong" : "border-border",
        className,
      ].join(" ")}
    >
      {/* dt and dd sit directly in each row (no wrapper), so the list keeps
          its term/value semantics; the icon lives inside the dt. */}
      {rows.map((row) => (
        <div key={row.label} className="py-space-md">
          <dt className="flex items-center gap-x-space-md text-label-sm uppercase text-muted">
            <Icon name={row.icon} className="size-4 shrink-0 text-secondary" />
            {row.label}
          </dt>
          <dd className="mt-space-xs pl-[calc(1rem+var(--spacing-space-md))] text-body-md text-foreground">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
