import { ImageFrame } from "@/components/ImageFrame";
import type { GalleryItem } from "@/data/site";

/** A plain grid of gallery photographs. Renders nothing while empty. */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;
  return (
    <ul data-reveal-stagger className="grid grid-cols-2 gap-space-sm md:gap-gutter lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.src}>
          <figure>
            <ImageFrame image={item} alt={item.alt} ratio="aspect-[4/5]" sizes="(max-width: 1024px) 50vw, 33vw" />
            {item.caption ? (
              <figcaption className="mt-space-sm text-body-sm text-muted">{item.caption}</figcaption>
            ) : null}
          </figure>
        </li>
      ))}
    </ul>
  );
}
