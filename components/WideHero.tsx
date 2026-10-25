import { ImageFrame } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import type { ImageSlot, PageCopy } from "@/data/site";

/**
 * Opening section for top-level pages (About, Academy): the H1 on the left,
 * the standfirst and actions on the right, then one wide photograph across
 * the full shell. The photograph is above the fold, so it loads eagerly.
 */
type WideHeroProps = {
  copy: PageCopy;
  image: ImageSlot;
  children?: React.ReactNode;
};

export function WideHero({ copy, image, children }: WideHeroProps) {
  return (
    <section className="w-full bg-background pt-space-2xl pb-space-2xl md:pt-space-3xl lg:pt-28 lg:pb-space-3xl">
      <div className="shell">
        <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12 lg:items-end lg:gap-gutter-desktop">
          <SectionHeading
            eyebrow={copy.eyebrow}
            heading={copy.heading}
            as="h1"
            size="xl"
            className="lg:col-span-7"
          />
          <div className="flex flex-col items-start gap-space-lg lg:col-span-4 lg:col-start-9 lg:pb-2">
            <p className="max-w-[44ch] text-pretty text-body-lg text-muted">{copy.body}</p>
            {children}
          </div>
        </div>

        <ImageFrame
          image={image.image}
          alt={image.alt}
          placeholder={image.caption}
          ratio="aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]"
          tone="warm"
          priority
          sizes="(max-width: 1360px) 100vw, 1232px"
          className="mt-space-2xl lg:mt-space-3xl"
        />
      </div>
    </section>
  );
}
