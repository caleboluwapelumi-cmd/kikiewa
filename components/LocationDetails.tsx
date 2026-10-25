import { Confirmable, TbcLabel } from "@/components/Confirmable";
import { Icon, type IconName } from "@/components/Icon";
import { branchPhone, isTBC, locationLabels, site, type Location } from "@/data/site";
import { formatDays, formatTimeRange, groupHours } from "@/lib/format";
import { telHref } from "@/lib/phone";

/**
 * A branch's address, hours and phone as hairline-ruled rows. Unconfirmed
 * values show the "To be confirmed" label. Hours come from the per-day data,
 * grouped ("Mon to Sat", "Sun closed"). The phone is the branch's own line,
 * else the business line, as a tel: link. `withLandmark` adds the landmark
 * row (branch pages).
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
  const phone = branchPhone(location);
  const tel = telHref(phone);

  const rows: { icon: IconName; label: string; value: React.ReactNode }[] = [
    {
      icon: "home",
      label: locationLabels.address,
      value: (
        <span className="flex flex-col gap-space-xs">
          <span>
            <Confirmable value={location.address} />
          </span>
          {isTBC(location.address) ? (
            <span>
              {location.name}, {site.area}
            </span>
          ) : null}
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
            {groupHours(location.hours).map((group) => (
              <tr key={group.days.join("-")}>
                <th scope="row" className="py-0.5 pr-space-md font-normal whitespace-nowrap text-muted">
                  {formatDays(group.days)}
                </th>
                <td className="py-0.5 whitespace-nowrap tabular-nums">
                  {group.hours ? formatTimeRange(group.hours) : locationLabels.closed}
                </td>
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
        <a href={tel} className="link-touch hover:text-secondary">
          {phone}
        </a>
      ) : (
        <Confirmable value={phone} />
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
