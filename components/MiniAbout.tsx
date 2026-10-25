import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { ValuesList } from "@/components/ValuesList";
import { howWeWork, miniAbout } from "@/data/site";

/**
 * Home "About Kikiewa" (site plan, section 3.2): the vision in a sentence,
 * a link to /about, and beside it one portrait with the four steps of
 * "How we work" as a compact numbered list.
 */
export function MiniAbout() {
  return (
    <section className="section-y w-full bg-background">
      <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:items-center lg:gap-gutter-desktop">
        <div className="flex flex-col items-start lg:col-span-6">
          <SectionHeading eyebrow={miniAbout.eyebrow} heading={miniAbout.heading} />
          <p className="mt-space-lg max-w-[56ch] text-body-lg text-muted">
            {miniAbout.body}
          </p>
          <Button href={miniAbout.link.href} variant="secondary" className="mt-space-xl">
            {miniAbout.link.label}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-space-xl sm:grid-cols-2 sm:items-end lg:col-span-5 lg:col-start-8">
          <ImageFrame
            image={miniAbout.image.image}
            alt={miniAbout.image.alt}
            ratio="aspect-[4/5]"
            orientation="portrait"
            tone="warm"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          />
          <ValuesList
            heading={howWeWork.heading}
            items={howWeWork.steps.map((step) => ({ title: step.name }))}
            compact
            ordered
          />
        </div>
      </div>
    </section>
  );
}
