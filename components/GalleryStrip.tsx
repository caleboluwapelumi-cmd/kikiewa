import { ImageFrame } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { salonSpa } from "@/data/site";

/**
 * Four-up gallery of the Ebute space. Photography has not been commissioned
 * yet, so every frame is a placeholder that says so — the alt text is already
 * the real one.
 */
export function GalleryStrip() {
  const { gallery } = salonSpa;

  return (
    <section className="w-full bg-background py-space-xl lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow={gallery.eyebrow}
          heading={gallery.heading}
          className="mb-space-xl"
        />

        <ul className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {gallery.items.map((item) => (
            <li key={item.alt}>
              <ImageFrame
                alt={item.alt}
                ratio="aspect-[3/4]"
                orientation="portrait"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
