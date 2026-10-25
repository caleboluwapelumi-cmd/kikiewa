import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Confirmable, TbcLabel } from "@/components/Confirmable";
import { formatHoursGroup, groupHours } from "@/lib/format";
import { contact, footer, isTBC, locationLabels, locations, serviceLinks, shopHref, site, socials } from "@/data/site";
import { shopEnabled } from "@/lib/shop";
import { telHref } from "@/lib/phone";

/**
 * Plum footer (site plan, section 3.9): logo and line, then Services,
 * Kikiewa (Shop only while the shop is on), Visit (both branches, same
 * details) and Follow (hidden until
 * social links are confirmed). Text sits at white or white/75, both clear
 * AA on plum, and `data-tone="dark"` switches the focus ring to white.
 */

const columnHeading = "mb-space-xs font-body text-label-sm uppercase text-on-primary/75";

// link-touch: 48px rows for touch, underline under the text (globals.css)
const linkClass = "link-touch w-fit text-body-md text-on-primary/80 hover:text-on-primary";

export function Footer() {
  const tel = telHref(contact.phone);
  return (
    <footer data-tone="dark" className="w-full bg-primary pb-space-lg text-on-primary">
      <div className="shell">
        <div className="grid grid-cols-1 gap-space-xl border-y border-on-primary/15 pt-space-2xl pb-space-2xl md:grid-cols-2 lg:grid-cols-12 lg:gap-gutter-desktop lg:pt-space-3xl">
          <div className="flex flex-col gap-space-md md:col-span-2 lg:col-span-3">
            <Link href="/" className="-ml-1 w-fit p-1">
              <Logo variant="mono" className="h-16 w-auto text-cream" />
            </Link>
            <p className="font-display text-headline-sm text-on-primary">{footer.tagline}</p>
            {tel ? (
              <p className="text-body-md text-on-primary/80">
                {footer.phoneLabel}{" "}
                <a href={tel} className="link-touch text-on-primary">
                  {contact.phone}
                </a>
              </p>
            ) : null}
          </div>

          <nav aria-label={footer.servicesHeading} className="flex flex-col lg:col-span-2">
            <h2 className={columnHeading}>{footer.servicesHeading}</h2>
            {serviceLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <nav aria-label={footer.kikiewaHeading} className="flex flex-col lg:col-span-2">
            <h2 className={columnHeading}>{footer.kikiewaHeading}</h2>
            {footer.kikiewaLinks
              .filter((link) => shopEnabled || link.href !== shopHref)
              .map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
          </nav>

          <div className="flex flex-col gap-space-md md:col-span-2 lg:col-span-3">
            <h2 className={columnHeading}>{footer.visitHeading}</h2>
            <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-1">
              {locations.map((location) => (
                <div key={location.id} className="flex flex-col gap-space-xs">
                  <Link href={location.href} className="link-touch w-fit text-title-md hover:text-on-primary">
                    {location.title}
                  </Link>
                  <span className="text-body-sm text-on-primary/75">
                    <Confirmable value={location.address} />
                  </span>
                  <span className="text-body-sm text-on-primary/75">
                    {isTBC(location.hours) ? (
                      <TbcLabel>Hours to be confirmed</TbcLabel>
                    ) : (
                      groupHours(location.hours)
                        .map((group) => formatHoursGroup(group, locationLabels.closed.toLowerCase()))
                        .join(" · ")
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {socials.length ? (
            <nav aria-label={footer.followHeading} className="flex flex-col lg:col-span-2">
              <h2 className={columnHeading}>{footer.followHeading}</h2>
              {socials.map((link) => (
                <a key={link.href} href={link.href} className={linkClass} rel="noopener">
                  {link.label}
                </a>
              ))}
            </nav>
          ) : null}
        </div>

        <p className="max-w-[72ch] pt-space-lg text-pretty text-body-sm text-on-primary/75">{footer.note}</p>

        <div className="flex flex-col items-start justify-between gap-space-sm pt-space-md text-body-sm text-on-primary/75 md:flex-row md:items-center">
          <span>
            © {site.copyrightYear} {site.name}
          </span>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-space-lg">
            {footer.legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="link-touch hover:text-on-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
