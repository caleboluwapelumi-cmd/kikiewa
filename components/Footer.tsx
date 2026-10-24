import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { contact, footer, isTBC, locations, site } from "@/data/site";

/**
 * Plum footer, per the brand tokens ("primary: buttons, key accents,
 * footer"). The mono logo sits in cream; text sits at white or white/75 —
 * both clear AA on plum — and `data-tone="dark"` switches the focus ring
 * to white.
 *
 * Unconfirmed details (licence, addresses, email) are left out rather than
 * shown as "To be confirmed".
 */

const columnHeading =
  "mb-space-sm font-body text-label-sm uppercase text-on-primary/75";

const linkClass =
  "link-rule w-fit py-0.5 text-body-md text-on-primary/80 hover:text-on-primary";

export function Footer() {
  return (
    <footer
      data-tone="dark"
      className="w-full bg-primary pb-space-lg text-on-primary"
    >
      <div className="shell">
        <div className="grid grid-cols-1 gap-space-xl border-y border-on-primary/15 pt-space-2xl pb-space-2xl md:grid-cols-2 lg:grid-cols-12 lg:gap-gutter-desktop lg:pt-space-3xl">
          <div className="flex flex-col gap-space-md lg:col-span-4">
            <Link href="/" className="-ml-1 w-fit p-1">
              <Logo variant="mono" className="h-16 w-auto text-cream" />
            </Link>
            <p className="max-w-sm text-pretty text-body-md text-on-primary/75">
              {footer.blurb}
            </p>
            {isTBC(footer.licence.value) ? null : (
              <div className="pt-space-xs">
                <span className="inline-flex flex-wrap items-baseline gap-x-space-sm border border-on-primary/30 px-space-sm py-space-xs text-label-sm uppercase text-on-primary/80">
                  {footer.licence.label}
                  <span>{footer.licence.value}</span>
                </span>
              </div>
            )}
          </div>

          <nav aria-label={footer.exploreHeading} className="flex flex-col gap-space-sm lg:col-span-3">
            <h2 className={columnHeading}>{footer.exploreHeading}</h2>
            {footer.divisionLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-space-md lg:col-span-3">
            <h2 className={columnHeading}>{footer.visitHeading}</h2>
            {locations.map((location) => (
              <div key={location.id} className="flex flex-col gap-space-xs">
                <Link
                  href={location.href}
                  className="link-rule w-fit text-title-md hover:text-on-primary"
                >
                  {location.area}
                </Link>
                <span className="text-body-sm text-on-primary/75">
                  {location.services}
                </span>
                {isTBC(location.address) ? null : (
                  <span className="text-body-sm text-on-primary/75">
                    {location.address}
                  </span>
                )}
                {isTBC(location.hours) ? null : (
                  <span className="text-body-sm text-on-primary/75">
                    {location.hours}
                  </span>
                )}
              </div>
            ))}
          </div>

          <nav aria-label={footer.helpHeading} className="flex flex-col gap-space-sm lg:col-span-2">
            <h2 className={columnHeading}>{footer.helpHeading}</h2>
            {footer.helpLinks.map((link) => (
              <Link key={link.label} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
            {isTBC(contact.email) ? null : (
              <a href={"mailto:" + contact.email} className={linkClass}>
                {contact.email}
              </a>
            )}
          </nav>
        </div>

        <p className="max-w-[72ch] pt-space-lg text-pretty text-body-sm text-on-primary/75">
          {footer.medicalNote}
        </p>

        <div className="flex flex-col items-start justify-between gap-space-sm pt-space-md text-body-sm text-on-primary/75 md:flex-row md:items-center">
          <span>
            © {site.copyrightYear} {site.name}. {footer.rights}
          </span>
          <nav aria-label="Legal" className="flex items-center gap-space-lg">
            {footer.legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-rule py-0.5 hover:text-on-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
