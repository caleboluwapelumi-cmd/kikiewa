import Link from "next/link";
import { Icon } from "@/components/Icon";
import { callSheet, contact, contactHref, locations, type OrTBC } from "@/data/site";
import { telHref } from "@/lib/phone";

/**
 * The main line first (once confirmed), then one row per location, each
 * calling that number; a row whose number is still TBC opens /contact
 * instead. Shared by the mobile Call sheet and /book. No hooks, so it
 * renders on the server or the client.
 */
export function CallSheetList({ onNavigate }: { onNavigate?: () => void }) {
  const rows: { id: string; title: string; phone: OrTBC<string> }[] = [
    ...(telHref(contact.phone) ? [{ id: "main", title: callSheet.mainLine, phone: contact.phone }] : []),
    ...locations.map((location) => ({ id: location.id, title: location.title, phone: location.phone })),
  ];

  return (
    <ul className="divide-y divide-border border-b border-border">
      {rows.map((row) => {
        const tel = telHref(row.phone);
        const rowClass =
          "flex min-h-16 items-center justify-between gap-space-md px-space-lg py-space-md transition-colors duration-200 hover:bg-surface";
        const content = (
          <>
            <span className="flex flex-col gap-space-xs">
              <span className="text-title-md text-primary">{row.title}</span>
              <span className="text-body-sm text-muted">{tel ? row.phone : callSheet.fallback}</span>
            </span>
            <Icon name={tel ? "phone" : "arrowRight"} className="size-5 shrink-0 text-secondary" />
          </>
        );

        return (
          <li key={row.id}>
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
