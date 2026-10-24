import { ImageFrame } from "@/components/ImageFrame";
import { PeacockDivider } from "@/components/brand/PeacockDivider";
import { SectionHeading } from "@/components/SectionHeading";
import { salonSpa } from "@/data/site";

/**
 * Gallery of the Ebute space, set as an editorial mosaic: one large frame,
 * one wide, two small. Each slot shows its photograph once data/site.ts has
 * one, and a placeholder that says so until then.
 *
 * Layout per position (mobile 2 columns, desktop 4 columns × 2 rows). On
 * desktop the grid itself holds a 2:1 shape and every frame fills its area,
 * so the mosaic stays aligned at any width.
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

export function GalleryStrip() {
  const { gallery } = salonSpa;

  return (
    <section className="section-y w-full bg-background">
      <div className="shell">
        {/* The salon page's one peacock divider */}
        <PeacockDivider className="mb-space-2xl lg:mb-space-3xl" />
        <SectionHeading
          eyebrow={gallery.eyebrow}
          heading={gallery.heading}
          className="mb-space-2xl"
        />

        <ul className="grid grid-cols-2 gap-space-sm md:gap-gutter lg:aspect-[2/1] lg:grid-cols-4 lg:grid-rows-2">
          {gallery.items.map((item, index) => {
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
