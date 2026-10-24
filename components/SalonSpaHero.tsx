import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { salonSpa } from "@/data/site";

/**
 * Salon & spa hero. Same grid as the medical spa hero, warmer setting: the
 * section sits on the tinted surface, the frame carries an accent wash, and
 * an offset accent hairline sits behind it — the page's one signature detail.
 */
export function SalonSpaHero() {
  const { hero } = salonSpa;

  return (
    <section className="w-full border-b border-border bg-surface pt-space-2xl pb-space-3xl md:pt-space-3xl lg:pt-28 lg:pb-32">
      <div className="shell">
        <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <div className="flex flex-col lg:col-span-6">
            <p className="mb-space-lg flex items-center gap-3 text-label-sm uppercase text-secondary">
              <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
              {hero.eyebrow}
            </p>

            <h1 className="max-w-[13em] text-balance text-display-hero-mobile text-primary lg:text-display-hero">
              {hero.heading}
            </h1>

            <p className="mt-space-lg max-w-[50ch] text-pretty text-body-lg text-muted">
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

          <div className="relative mr-4 mb-4 lg:col-span-5 lg:col-start-8 lg:mr-0">
            {/* Offset accent hairline, decorative */}
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-x-4 translate-y-4 border border-accent md:translate-x-6 md:translate-y-6"
            />
            <ImageFrame
              image={hero.image.asset}
              alt={hero.image.alt}
              ratio="aspect-[4/5]"
              orientation="portrait"
              priority
              tone="warm"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
