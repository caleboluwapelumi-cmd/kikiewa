import Link from "next/link";
import { contactHref, hoursLink, locations } from "@/data/site";
import { telHref } from "@/lib/phone";

/**
 * Desktop-only strip above the main header bar: both locations with their
 * phone numbers (left out while TBC), and links to hours and contact.
 * Quiet by design: cream surface, small type, no brand colour fills.
 */
export function UtilityBar() {
  return (
    <div className="hidden h-9 border-b border-border bg-surface lg:block">
      <div className="shell flex h-full items-center justify-between gap-space-lg text-body-sm">
        <ul className="flex items-center gap-space-xl" aria-label="Location phone numbers">
          {locations.map((location) => {
            const tel = telHref(location.phone);
            return (
              <li key={location.id} className="flex items-baseline gap-space-sm">
                <span className="text-muted">{location.services} —</span>
                <Link
                  href={location.href}
                  className="link-rule font-medium text-foreground hover:text-primary"
                >
                  {location.name}
                </Link>
                {tel ? (
                  <>
                    <span aria-hidden="true" className="text-border-strong">
                      ·
                    </span>
                    <a href={tel} className="link-rule text-foreground hover:text-primary">
                      {location.phone}
                    </a>
                  </>
                ) : null}
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
