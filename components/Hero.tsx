import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { hero } from "@/data/site";

/**
 * Home hero: the brand line, set large, beside one tall photograph.
 * "Help me choose" opens WhatsApp (the contact page while the number is TBC).
 */
export function Hero() {
  return (
    <section className="w-full overflow-hidden bg-background pt-space-2xl pb-space-3xl md:pt-space-3xl lg:pt-28 lg:pb-36">
      <div className="shell">
        <div className="grid grid-cols-1 items-end gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <div className="flex flex-col lg:col-span-6 lg:pb-space-2xl">
            <p className="mb-space-lg flex items-center gap-3 text-label-sm uppercase text-secondary">
              <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
              {hero.eyebrow}
            </p>

            <h1 className="max-w-[9em] text-balance text-display-hero-mobile text-primary lg:text-display-hero">
              {hero.heading}
            </h1>

            <p className="mt-space-lg max-w-[46ch] text-pretty text-body-lg text-muted">
              {hero.body}
            </p>

            <div className="mt-space-xl flex flex-wrap items-center gap-x-space-xl gap-y-space-sm">
              <Button href={hero.primaryCta.href} size="lg" icon="arrowRight">
                {hero.primaryCta.label}
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

          <div className="lg:col-span-6 lg:col-start-7">
            <ImageFrame
              image={hero.image.asset}
              alt={hero.image.alt}
              ratio="aspect-[4/5] md:aspect-[4/3] lg:aspect-[5/6]"
              orientation="portrait"
              priority
              tone="warm"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
