import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { ValuesList } from "@/components/ValuesList";
import type { ServiceSigns as ServiceSignsData } from "@/data/site";

/**
 * A titled, numbered list beside one portrait photograph, with a booking
 * button underneath ("Signs your facial is overdue"). The photograph sits
 * first on mobile and to the left from lg.
 *
 * The photograph never renders wider than 432px: the facials cover is only
 * 864px wide, and 432px keeps it sharp at 2x without upscaling.
 */
export function ServiceSigns({ signs }: { signs: ServiceSignsData }) {
  return (
    <section className="section-y w-full border-t border-border bg-background">
      <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:items-center lg:gap-gutter-desktop">
        <div className="mx-auto w-full max-w-[432px] lg:col-span-5">
          <ImageFrame
            image={signs.image.image}
            alt={signs.image.alt}
            ratio="aspect-[4/5]"
            orientation="portrait"
            tone="warm"
            sizes="(max-width: 480px) 100vw, 432px"
          />
        </div>
        <div className="flex flex-col gap-space-xl lg:col-span-6 lg:col-start-7">
          <SectionHeading heading={signs.heading} />
          <ValuesList items={signs.items} />
          <div>
            <Button href={signs.cta.href} size="lg" icon="arrowRight">
              {signs.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
