import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Confirmable, TbcLabel } from "@/components/Confirmable";
import { formatOpeningHours } from "@/lib/format";
import { footer, isTBC, locations, serviceLinks, site, socials } from "@/data/site";

/**
 * Plum footer (site plan, section 3.9): logo and line, then Services,
 * Kikiewa, Visit (both locations, same details) and Follow (hidden until
 * social links are confirmed). Text sits at white or white/75, both clear
 * AA on plum, and `data-tone="dark"` switches the focus ring to white.
 */

const columnHeading = "mb-space-sm font-body text-label-sm uppercase text-on-primary/75";

const linkClass = "link-rule w-fit py-0.5 text-body-md text-on-primary/80 hover:text-on-primary";

export function Footer() {
  return (
    <footer data-tone="dark" className="w-full bg-primary pb-space-lg text-on-primary">
      <div className="shell">
        <div className="grid grid-cols-1 gap-space-xl border-y border-on-primary/15 pt-space-2xl pb-space-2xl md:grid-cols-2 lg:grid-cols-12 lg:gap-gutter-desktop lg:pt-space-3xl">
          <div className="flex flex-col gap-space-md md:col-span-2 lg:col-span-3">
            <Link href="/" className="-ml-1 w-fit p-1">
              <Logo variant="mono" className="h-16 w-auto text-cream" />
            </Link>
            <p className="font-display text-headline-sm text-on-primary">{footer.tagline}</p>
          </div>

          <nav aria-label={footer.servicesHeading} className="flex flex-col gap-space-sm lg:col-span-2">
            <h2 className={columnHeading}>{footer.servicesHeading}</h2>
            {serviceLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <nav aria-label={footer.kikiewaHeading} className="flex flex-col gap-space-sm lg:col-span-2">
            <h2 className={columnHeading}>{footer.kikiewaHeading}</h2>
            {footer.kikiewaLinks.map((link) => (
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
                  <Link href={location.href} className="link-rule w-fit text-title-md hover:text-on-primary">
                    {location.title}
                  </Link>
                  <span className="text-body-sm text-on-primary/75">
                    <Confirmable value={location.address} />
                  </span>
                  <span className="text-body-sm text-on-primary/75">
                    {isTBC(location.hours) ? (
                      <TbcLabel>Hours to be confirmed</TbcLabel>
                    ) : (
                      location.hours.map(formatOpeningHours).join(" · ")
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {socials.length ? (
            <nav aria-label={footer.followHeading} className="flex flex-col gap-space-sm lg:col-span-2">
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
          <nav aria-label="Legal" className="flex items-center gap-space-lg">
            {footer.legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="link-rule py-0.5 hover:text-on-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
