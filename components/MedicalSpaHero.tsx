import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { medicalSpa } from "@/data/site";

/**
 * Medical spa hero. Deliberately quieter than the home hero: no stat block,
 * no floating badge and no image overlay — a statement, one supporting line
 * and a single action.
 */
export function MedicalSpaHero() {
  const { hero } = medicalSpa;

  return (
    <section className="w-full border-b border-border bg-background py-space-xl lg:py-32">
      <div className="shell">
        <div className="grid grid-cols-1 items-center gap-gutter-desktop lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col lg:col-span-7">
            <div className="mb-space-lg flex items-center gap-space-sm">
              <span className="inline-block h-px w-8 bg-accent" />
              <span className="text-label-sm uppercase text-secondary">
                {hero.eyebrow}
              </span>
            </div>

            <h1 className="max-w-2xl text-display-hero-mobile text-primary lg:text-display-hero">
              {hero.heading}
            </h1>

            <p className="mt-space-lg max-w-xl text-body-lg text-muted">
              {hero.body}
            </p>

            <div className="mt-space-xl">
              <Button href={hero.cta.href} size="lg" icon="arrowRight">
                {hero.cta.label}
              </Button>
            </div>
          </div>

          <div className="mt-space-lg lg:col-span-5 lg:mt-0">
            <ImageFrame
              alt={hero.image.alt}
              ratio="aspect-[4/5]"
              orientation="portrait"
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
