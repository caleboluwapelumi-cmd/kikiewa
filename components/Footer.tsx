import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Confirmable } from "@/components/Confirmable";
import { contact, footer, hoursLink, locations, site } from "@/data/site";

/**
 * Plum footer, per the brand tokens ("primary: buttons, key accents,
 * footer"). The mono logo sits in cream; text sits at white or white/75 —
 * both clear AA on plum — and `data-tone="dark"` switches the focus ring
 * to white.
 */

const columnHeading =
  "mb-space-sm font-body text-label-sm uppercase text-on-primary/75";

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
            <div className="pt-space-xs">
              <span className="inline-flex flex-wrap items-baseline gap-x-space-sm border border-on-primary/30 px-space-sm py-space-xs text-label-sm uppercase text-on-primary/80">
                {footer.licence.label}
                <Confirmable value={footer.licence.value} />
              </span>
            </div>
          </div>

          <nav aria-label="Divisions" className="flex flex-col gap-space-sm lg:col-span-3">
            <h2 className={columnHeading}>Divisions</h2>
            {footer.divisionLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-rule w-fit py-0.5 text-body-md text-on-primary/80 hover:text-on-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-space-md lg:col-span-3">
            <h2 className={columnHeading}>Lagos Practices</h2>
            {locations.map((location) => (
              <div key={location.id} className="flex flex-col gap-space-xs">
                <Link
                  href={location.href}
                  className="link-rule w-fit text-title-md hover:text-on-primary"
                >
                  {location.name}
                </Link>
                <span className="text-body-sm text-on-primary/75">
                  {location.services}
                </span>
                <span className="text-body-sm text-on-primary/75">
                  <Confirmable value={location.address} />
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-space-sm lg:col-span-2">
            <h2 className={columnHeading}>Inquiries</h2>
            <span className="text-body-sm text-on-primary/75">
              {footer.inquiriesLabel}
            </span>
            <span className="flex flex-col gap-space-xs text-body-md">
              <span className="text-label-sm uppercase text-on-primary/75">Email</span>
              <Confirmable
                value={contact.email}
                format={(email) => (
                  <a href={"mailto:" + email} className="link-rule hover:text-on-primary">
                    {email}
                  </a>
                )}
              />
            </span>
            <Link
              href={hoursLink.href}
              className="link-rule w-fit pt-space-xs text-body-sm text-on-primary/80 hover:text-on-primary"
            >
              {hoursLink.label}
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-space-sm pt-space-lg text-body-sm text-on-primary/75 md:flex-row md:items-center">
          <span>
            © {site.copyrightYear} {site.name} · {site.city}.
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
