import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { medicalSpa } from "@/data/site";

/**
 * Medical spa hero. Deliberately quieter than the home hero: no stat block,
 * no floating badge and no image overlay — a statement, one supporting line
 * and a single action, on the cool neutral frame.
 */
export function MedicalSpaHero() {
  const { hero } = medicalSpa;

  return (
    <section className="w-full bg-background pt-space-2xl pb-space-2xl md:pt-space-3xl lg:pt-28 lg:pb-28">
      <div className="shell">
        <div className="grid grid-cols-1 items-end gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <div className="flex flex-col lg:col-span-7 lg:pb-space-xl">
            <p className="mb-space-lg flex items-center gap-3 text-label-sm uppercase text-secondary">
              <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
              {hero.eyebrow}
            </p>

            <h1 className="max-w-[12em] text-balance text-display-hero-mobile text-primary lg:text-display-hero">
              {hero.heading}
            </h1>

            <p className="mt-space-lg max-w-[52ch] text-pretty text-body-lg text-muted">
              {hero.body}
            </p>

            <div className="mt-space-xl flex flex-wrap items-center gap-x-space-xl gap-y-space-sm">
              <Button href={hero.cta.href} size="lg" icon="arrowRight">
                {hero.cta.label}
              </Button>
              <Button
                href={hero.secondaryCta.href}
                size="lg"
                variant="quiet"
                icon="whatsapp"
                iconPosition="leading"
              >
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <ImageFrame
              image={hero.image.asset}
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
