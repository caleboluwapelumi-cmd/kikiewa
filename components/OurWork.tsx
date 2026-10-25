import Link from "next/link";
import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { PeacockDivider } from "@/components/brand/PeacockDivider";
import { SectionHeading } from "@/components/SectionHeading";
import { findServiceCategory, ourWork, workCaption } from "@/data/site";

/**
 * Home "Our work" (site plan, section 3.4): six tiles of recent work as a
 * swipe row on phones (with a peek of the next tile) and a grid from md.
 * Until photographs arrive each tile shows the designed placeholder. Each tile
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

        <div className="mb-space-xl flex flex-col gap-space-lg md:mb-space-2xl md:flex-row md:items-end md:justify-between md:gap-gutter-desktop">
          <SectionHeading heading={ourWork.heading} body={ourWork.intro} />
          <Button href={ourWork.link.href} variant="secondary" className="self-start md:shrink-0 md:self-auto">
            {ourWork.link.label}
          </Button>
        </div>

        <ul data-reveal-stagger className="scroll-row md:scroll-row-off md:grid-cols-3 md:gap-gutter lg:gap-gutter-desktop [&>li]:w-[min(68%,18rem)] md:[&>li]:w-auto">
          {ourWork.items.map((item) => {
            const category = findServiceCategory(item.category);
            return (
              <li key={item.alt}>
                <Link
                  href={category.href}
                  className="group relative block rounded-card focus-visible:outline-none focus-visible:after:absolute focus-visible:after:inset-0 focus-visible:after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-secondary"
                >
                  <ImageFrame
                    image={item.image}
                    alt={item.alt}
                    placeholder={workCaption(item.category)}
                    ratio="aspect-[4/5]"
                    orientation="portrait"
                    tone="warm"
                    sizes="(max-width: 768px) 68vw, 33vw"
                    zoomOnHover
                  >
                    <span className="absolute bottom-3 left-3 flex items-center rounded-chip bg-primary/90 px-3.5 py-1.5 text-label-md uppercase text-on-primary transition-opacity duration-300 ease-out-soft [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:opacity-100">
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
