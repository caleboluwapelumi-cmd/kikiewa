import { ImageFrame } from "@/components/ImageFrame";
import { findServiceCategory, workCaption, type ServiceSlug } from "@/data/site";

/**
 * Placeholder tiles for "Our work" while a category has no photographs:
 * a swipe row on phones, three across from md. Used by the service pages
 * (three tiles of that service) and /gallery (one per service).
 */
export function WorkPlaceholderGrid({ categories }: { categories: ServiceSlug[] }) {
  return (
    <ul className="scroll-row md:scroll-row-off md:grid-cols-3 md:gap-gutter lg:gap-gutter-desktop [&>li]:w-[min(68%,18rem)] md:[&>li]:w-auto">
      {categories.map((slug, index) => (
        <li key={slug + index}>
          <ImageFrame
            alt={`${findServiceCategory(slug).name} at Kikiewa, Ikorodu`}
            placeholder={workCaption(slug)}
            ratio="aspect-[4/5]"
            tone={findServiceCategory(slug).consultationLed ? "neutral" : "warm"}
            sizes="(max-width: 768px) 68vw, 33vw"
          />
        </li>
      ))}
    </ul>
  );
}
