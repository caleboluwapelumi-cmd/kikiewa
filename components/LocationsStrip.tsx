import Link from "next/link";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { locations, type NavLink } from "@/data/site";

/**
 * A short band naming both locations, each linking to its page, plus a link
 * to /locations. The two sit side by side with identical treatment: they
 * are equals.
 */
type LocationsStripProps = {
  eyebrow?: string;
  heading: string;
  body?: string;
  link: NavLink;
};

export function LocationsStrip({ eyebrow, heading, body, link }: LocationsStripProps) {
  return (
    <section className="w-full border-t border-border bg-surface py-space-2xl md:py-space-3xl lg:py-28">
      <div className="shell grid grid-cols-1 gap-space-xl lg:grid-cols-12 lg:items-end lg:gap-gutter-desktop">
        <div className="flex flex-col items-start gap-space-md lg:col-span-5">
          <SectionHeading eyebrow={eyebrow} heading={heading} body={body} />
          <Button href={link.href} variant="secondary">
            {link.label}
          </Button>
        </div>

        <ul className="grid grid-cols-1 border-t border-border-strong sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {locations.map((location, index) => (
            <li
              key={location.id}
              className={[
                "border-b border-border",
                index === 1 ? "sm:border-l sm:pl-space-lg" : "sm:pr-space-lg",
              ].join(" ")}
            >
              <Link
                href={location.href}
                className="group flex items-end justify-between gap-space-md py-space-lg transition-colors duration-200 hover:text-secondary"
              >
                <span className="flex flex-col gap-space-xs">
                  <span className="text-label-sm uppercase text-muted">{location.area}</span>
                  <span className="font-display text-headline-md text-primary transition-colors duration-200 group-hover:text-secondary">
                    {location.title}
                  </span>
                </span>
                <Icon
                  name="arrowRight"
                  className="mb-2 size-4 shrink-0 text-secondary transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
