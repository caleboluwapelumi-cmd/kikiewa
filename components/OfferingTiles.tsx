import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ImageFrame } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { offerings, offeringsIntro } from "@/data/site";

/**
 * "All of you, under one roof": six image tiles, one per thing people come
 * to Kikiewa for. The whole tile is the link (the name's ::after covers it),
 * so each tile has one link, named by its title. The focus ring is drawn on
 * the stretched ::after so it outlines the whole tile.
 */
export function OfferingTiles() {
  return (
    <section className="section-y w-full bg-background">
      <div className="shell">
        <SectionHeading
          heading={offeringsIntro.heading}
          aside={offeringsIntro.body}
          className="mb-space-2xl lg:mb-space-3xl"
        />

        <ul className="grid grid-cols-1 gap-x-gutter gap-y-space-xl sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-gutter-desktop lg:gap-y-space-2xl">
          {offerings.map((offering) => (
            <li key={offering.name} className="group relative flex flex-col">
              <ImageFrame
                image={offering.image}
                alt={offering.imageAlt}
                ratio="aspect-[4/3] sm:aspect-[4/5]"
                orientation="portrait"
                tone="warm"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                zoomOnHover
              />
              <h3 className="mt-space-lg text-headline-sm text-primary">
                <Link
                  href={offering.href}
                  className="flex items-center justify-between gap-space-md transition-colors duration-200 after:absolute after:inset-0 group-hover:text-secondary focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-secondary"
                >
                  {offering.name}
                  <Icon
                    name="arrowRight"
                    className="size-4 shrink-0 text-secondary transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
                  />
                </Link>
              </h3>
              <p className="mt-space-xs max-w-[36ch] text-pretty text-body-md text-muted">
                {offering.line}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
