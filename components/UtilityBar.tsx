import Link from "next/link";
import { TbcLabel } from "@/components/Confirmable";
import { contactHref, hoursLink, locations } from "@/data/site";
import { telHref } from "@/lib/phone";

/**
 * Desktop-only strip above the main header bar: both branches with their
 * phone numbers (or "To be confirmed"), and links to hours and contact.
 * Quiet by design: cream surface, small type, no brand colour fills.
 */
export function UtilityBar() {
  return (
    <div className="hidden h-9 border-b border-border bg-surface lg:block">
      <div className="shell flex h-full items-center justify-between gap-space-lg text-body-sm">
        <ul className="flex items-center gap-space-xl" aria-label="Branch phone numbers">
          {locations.map((location) => {
            const tel = telHref(location.phone);
            return (
              <li key={location.id} className="flex items-baseline gap-space-sm">
                <Link
                  href={location.href}
                  className="link-rule font-medium text-foreground hover:text-primary"
                >
                  {location.name}
                </Link>
                <span className="text-muted">{location.services}</span>
                <span aria-hidden="true" className="text-border-strong">
                  ·
                </span>
                {tel ? (
                  <a href={tel} className="link-rule text-foreground hover:text-primary">
                    {location.phone}
                  </a>
                ) : (
                  <span className="flex items-baseline gap-space-xs text-muted">
                    <span className="sr-only">Phone:</span>
                    <TbcLabel />
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <nav aria-label="Utility" className="flex items-center gap-space-lg">
          <Link href={hoursLink.href} className="link-rule text-muted hover:text-primary">
            {hoursLink.label}
          </Link>
          <Link href={contactHref} className="link-rule text-muted hover:text-primary">
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
}
