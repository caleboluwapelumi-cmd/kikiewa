import Link from "next/link";
import { utilityBar } from "@/data/site";

/**
 * Desktop-only strip above the main header bar:
 * "Ikorodu, Lagos · Ebute · Nitel" and the opening-hours link.
 * Quiet by design: cream surface, small type, no brand colour fills.
 */
export function UtilityBar() {
  return (
    <div className="hidden h-9 border-b border-border bg-surface lg:block">
      <div className="shell flex h-full items-center justify-between gap-space-lg text-body-sm">
        <p className="flex items-baseline gap-space-sm">
          <span className="text-muted">{utilityBar.place}</span>
          <span aria-hidden="true" className="text-border-strong">
            ·
          </span>
          <span className="text-foreground">{utilityBar.locations}</span>
        </p>
        <Link href={utilityBar.hoursLink.href} className="link-rule text-muted hover:text-primary">
          {utilityBar.hoursLink.label}
        </Link>
      </div>
    </div>
  );
}
