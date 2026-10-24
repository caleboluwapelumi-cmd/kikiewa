import { Confirmable } from "@/components/Confirmable";
import { Icon, type IconName } from "@/components/Icon";
import type { Location } from "@/data/site";
import { telHref } from "@/lib/phone";

/**
 * A branch's address, hours and phone as hairline-ruled rows. Unconfirmed
 * values show the "To be confirmed" label; the phone becomes a tel: link once
 * it is confirmed.
 */

type LocationDetailsProps = {
  location: Location;
  /** Stronger outer rules for the full-width branch block. */
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
            {location.name}, Lagos, Nigeria
          </span>
        </span>
      ),
    },
    {
      icon: "clock",
      label: "Opening Hours",
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
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[1rem_1fr] gap-x-space-md py-space-md"
        >
          <Icon name={row.icon} className="mt-0.5 size-4 shrink-0 text-secondary" />
          <div>
            <dt className="text-label-sm uppercase text-muted">{row.label}</dt>
            <dd className="mt-space-xs text-body-md text-foreground">{row.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
