import Link from "next/link";
import { Icon } from "@/components/Icon";
import { callSheet, contactHref, locations } from "@/data/site";
import { telHref } from "@/lib/phone";

/**
 * One row per location, each calling that location's number; a row whose
 * number is still TBC opens /contact instead. Shared by the mobile Call
 * sheet and /book. No hooks, so it renders on the server or the client.
 */
export function CallSheetList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="divide-y divide-border border-b border-border">
      {locations.map((location) => {
        const tel = telHref(location.phone);
        const rowClass =
          "flex min-h-16 items-center justify-between gap-space-md px-space-lg py-space-md transition-colors duration-200 hover:bg-surface";
        const content = (
          <>
            <span className="flex flex-col gap-space-xs">
              <span className="text-title-md text-primary">{location.title}</span>
              <span className="text-body-sm text-muted">{tel ? location.phone : callSheet.fallback}</span>
            </span>
            <Icon name={tel ? "phone" : "arrowRight"} className="size-5 shrink-0 text-secondary" />
          </>
        );

        return (
          <li key={location.id}>
            {tel ? (
              <a href={tel} onClick={onNavigate} className={rowClass}>
                {content}
              </a>
            ) : (
              <Link href={contactHref} onClick={onNavigate} className={rowClass}>
                {content}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
