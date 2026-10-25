import Link from "next/link";
import { Icon } from "@/components/Icon";
import { branchPhone, callSheet, contact, contactHref, locations, type OrTBC } from "@/data/site";
import { telHref } from "@/lib/phone";

/**
 * One row per branch ("Ebute branch", "Nitel branch"), each calling the
 * branch's own line or, until that is confirmed, the business line. The
 * main line gets its own row only while a branch has no number at all;
 * such a row opens /contact instead. Shared by the mobile Call sheet and /book. No hooks, so it
 * renders on the server or the client.
 */
export function CallSheetList({ onNavigate }: { onNavigate?: () => void }) {
  const branchRows = locations.map((location) => ({
    id: location.id,
    title: location.title,
    phone: branchPhone(location),
  }));
  const needsMainLine = branchRows.some((row) => !telHref(row.phone)) && telHref(contact.phone);
  const rows: { id: string; title: string; phone: OrTBC<string> }[] = [
    ...(needsMainLine ? [{ id: "main", title: callSheet.mainLine, phone: contact.phone }] : []),
    ...branchRows,
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
            <Icon name={tel ? "phone" : "chevronRight"} className="size-5 shrink-0 text-secondary" />
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
