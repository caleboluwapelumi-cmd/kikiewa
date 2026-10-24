import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { PeacockDivider } from "@/components/brand/PeacockDivider";
import { SectionHeading } from "@/components/SectionHeading";
import type { GallerySlot, NavLink } from "@/data/site";

/**
 * A gallery set as an editorial mosaic: one large frame, one wide, two
 * small. Each slot shows its photograph once data/site.ts has one, and a
 * placeholder that says so until then.
 *
 * Layout per position (mobile 2 columns, desktop 4 columns × 2 rows). On
 * desktop the grid itself holds a 2:1 shape and every frame fills its area,
 * so the mosaic stays aligned at any width.
 *
 * `divider` places the peacock divider above the heading. A page carries at
 * most one, so only pass it where the page has none elsewhere.
 */
const layout = [
  {
    item: "col-span-2 lg:row-span-2",
    ratio: "aspect-[4/3] lg:aspect-auto lg:h-full",
    orientation: "portrait" as const,
    sizes: "(max-width: 1024px) 100vw, 50vw",
  },
  {
    item: "col-span-2",
    ratio: "aspect-[2/1] lg:aspect-auto lg:h-full",
    orientation: "landscape" as const,
    sizes: "(max-width: 1024px) 100vw, 50vw",
  },
  {
    item: "",
    ratio: "aspect-square lg:aspect-auto lg:h-full",
    orientation: "portrait" as const,
    sizes: "(max-width: 1024px) 50vw, 25vw",
  },
  {
    item: "",
    ratio: "aspect-square lg:aspect-auto lg:h-full",
    orientation: "portrait" as const,
    sizes: "(max-width: 1024px) 50vw, 25vw",
  },
];

type GalleryStripProps = {
  eyebrow?: string;
  heading: string;
  body?: string;
  items: GallerySlot[];
  /** "See more work" and the like, beside the heading on desktop. */
  link?: NavLink;
  divider?: boolean;
};

export function GalleryStrip({
  eyebrow,
  heading,
  body,
  items,
  link,
  divider = false,
}: GalleryStripProps) {
  return (
    <section className="section-y w-full bg-background">
      <div className="shell">
        {divider ? <PeacockDivider className="mb-space-2xl lg:mb-space-3xl" /> : null}

        <div className="mb-space-2xl flex flex-col gap-space-lg md:flex-row md:items-end md:justify-between md:gap-gutter-desktop">
          <SectionHeading eyebrow={eyebrow} heading={heading} body={body} />
          {link ? (
            <Button
              href={link.href}
              variant="quiet"
              icon="arrowRight"
              className="self-start md:self-auto"
            >
              {link.label}
            </Button>
          ) : null}
        </div>

        <ul className="grid grid-cols-2 gap-space-sm md:gap-gutter lg:aspect-[2/1] lg:grid-cols-4 lg:grid-rows-2">
          {items.map((item, index) => {
            const slot = layout[index % layout.length];
            return (
              <li key={item.alt} className={slot.item}>
                <ImageFrame
                  image={item.image}
                  alt={item.alt}
                  ratio={slot.ratio}
                  orientation={slot.orientation}
                  tone="warm"
                  sizes={slot.sizes}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
