import { ImageFrame } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import type { ImageSlot } from "@/data/site";

/**
 * Heading and a line, then a pair of portrait photographs (About, "We keep
 * learning"). Two across at every width; from lg the heading sits on the left
 * and the pair on the right, the second photograph set lower so the two read
 * as a composed pair rather than a row with a gap.
 */
type LearningStripProps = {
  heading: string;
  body: string;
  images: ImageSlot[];
};

export function LearningStrip({ heading, body, images }: LearningStripProps) {
  return (
    <section className="section-y w-full border-t border-border bg-surface">
      <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:items-center lg:gap-gutter-desktop">
        <SectionHeading heading={heading} body={body} className="max-w-2xl lg:col-span-4" />
        <ul className="grid grid-cols-2 items-start gap-space-sm md:gap-gutter lg:col-span-7 lg:col-start-6 lg:gap-gutter-desktop">
          {images.map((slot, index) => (
            <li key={slot.image?.src ?? index} className={index % 2 === 1 ? "mt-space-2xl lg:mt-space-3xl" : undefined}>
              <ImageFrame
                image={slot.image}
                alt={slot.alt}
                ratio="aspect-[3/4]"
                orientation="portrait"
                tone="warm"
                sizes="(max-width: 1024px) 50vw, 400px"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
