import { ImageFrame } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import type { ImageSlot } from "@/data/site";

/**
 * Heading and a line, then a strip of three portrait photographs (About,
 * "We keep learning"). Three across at every width: a strip, not a gallery.
 */
type LearningStripProps = {
  heading: string;
  body: string;
  images: ImageSlot[];
};

export function LearningStrip({ heading, body, images }: LearningStripProps) {
  return (
    <section className="section-y w-full border-t border-border bg-surface">
      <div className="shell">
        <SectionHeading heading={heading} body={body} className="mb-space-2xl max-w-2xl lg:mb-space-3xl" />
        <ul className="grid grid-cols-3 gap-space-sm md:gap-gutter lg:gap-gutter-desktop">
          {images.map((slot, index) => (
            <li key={slot.image?.src ?? index}>
              <ImageFrame
                image={slot.image}
                alt={slot.alt}
                ratio="aspect-[3/4]"
                orientation="portrait"
                tone="warm"
                sizes="(max-width: 1360px) 33vw, 400px"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
