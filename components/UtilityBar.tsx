import Link from "next/link";
import { contact, contactHref, hoursLink, utilityBar } from "@/data/site";
import { telHref } from "@/lib/phone";

/**
 * Desktop-only strip above the main header bar:
 * "Ikorodu, Lagos · {phone} · Opening hours · Contact".
 * The phone is left out while it is TBC. Quiet by design: cream surface,
 * small type, no brand colour fills.
 */
export function UtilityBar() {
  const tel = telHref(contact.phone);

  return (
    <div className="hidden h-9 border-b border-border bg-surface lg:block">
      <div className="shell flex h-full items-center justify-between gap-space-lg text-body-sm">
        <p className="flex items-baseline gap-space-sm">
          <span className="text-muted">{utilityBar.place}</span>
          {tel ? (
            <>
              <span aria-hidden="true" className="text-border-strong">
                ·
              </span>
              <a href={tel} className="link-rule text-foreground hover:text-primary">
                {contact.phone}
              </a>
            </>
          ) : null}
        </p>

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
