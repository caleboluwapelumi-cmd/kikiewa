import Link from "next/link";
import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { PeacockDivider } from "@/components/brand/PeacockDivider";
import { SectionHeading } from "@/components/SectionHeading";
import { findServiceCategory, ourWork } from "@/data/site";

/**
 * Home "Our work" (site plan, section 3.4): a grid of recent work. Each tile
 * links to its service page and shows the service name on hover and focus.
 * Touch screens can't hover, so there the name always shows.
 *
 * The page's one peacock divider sits above the heading.
 */
export function OurWork() {
  return (
    <section className="section-y w-full border-t border-border bg-background">
      <div className="shell">
        <PeacockDivider className="mb-space-2xl lg:mb-space-3xl" />

        <div className="mb-space-2xl flex flex-col gap-space-lg md:flex-row md:items-end md:justify-between md:gap-gutter-desktop">
          <SectionHeading heading={ourWork.heading} body={ourWork.intro} />
          <Button href={ourWork.link.href} variant="quiet" icon="arrowRight" className="self-start md:self-auto">
            {ourWork.link.label}
          </Button>
        </div>

        <ul className="grid grid-cols-2 gap-space-sm md:gap-gutter lg:grid-cols-4">
          {ourWork.items.map((item) => {
            const category = findServiceCategory(item.category);
            return (
              <li key={item.alt}>
                <Link
                  href={category.href}
                  className="group relative block focus-visible:outline-none focus-visible:after:absolute focus-visible:after:inset-0 focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-secondary"
                >
                  <ImageFrame
                    image={item.image}
                    alt={item.alt}
                    ratio="aspect-[4/5]"
                    orientation="portrait"
                    tone="warm"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    zoomOnHover
                  >
                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-space-sm bg-primary/90 px-space-md py-space-sm text-label-md uppercase text-on-primary transition-opacity duration-300 ease-out-soft [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:opacity-100">
                      {category.name}
                    </span>
                  </ImageFrame>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
