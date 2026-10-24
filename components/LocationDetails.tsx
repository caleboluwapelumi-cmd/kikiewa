import { Confirmable, TbcLabel } from "@/components/Confirmable";
import { Icon, type IconName } from "@/components/Icon";
import { isTBC, locationLabels, site, type Location } from "@/data/site";
import { formatDays, formatTimeRange } from "@/lib/format";
import { telHref } from "@/lib/phone";

/**
 * A location's address, hours and phone as hairline-ruled rows. Unconfirmed
 * values show the "To be confirmed" label; the phone becomes a tel: link once
 * it is confirmed. `withLandmark` adds the landmark row (location pages).
 */

type LocationDetailsProps = {
  location: Location;
  withLandmark?: boolean;
  /** Stronger outer rules for location pages. */
  strong?: boolean;
  className?: string;
};

export function LocationDetails({
  location,
  withLandmark = false,
  strong = false,
  className = "",
}: LocationDetailsProps) {
  const tel = telHref(location.phone);

  const rows: { icon: IconName; label: string; value: React.ReactNode }[] = [
    {
      icon: "home",
      label: locationLabels.address,
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
    ...(withLandmark
      ? [
          {
            icon: "pin" as const,
            label: locationLabels.landmark,
            value: <Confirmable value={location.landmark} />,
          },
        ]
      : []),
    {
      icon: "clock",
      label: locationLabels.hours,
      value: isTBC(location.hours) ? (
        <TbcLabel />
      ) : (
        <table className="w-full max-w-sm text-left">
          <tbody>
            {location.hours.map((row) => (
              <tr key={row.days.join("-")}>
                <th scope="row" className="py-0.5 pr-space-md font-normal text-muted">
                  {formatDays(row.days)}
                </th>
                <td className="py-0.5 tabular-nums">{formatTimeRange(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      icon: "phone",
      label: locationLabels.phone,
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
      {/* dt and dd sit directly in each row, so the list keeps its
          term/value semantics; the icon lives inside the dt. */}
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
