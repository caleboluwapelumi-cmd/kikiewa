import { Button, ButtonGroup } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { Slider } from "@/components/Slider";
import { hero } from "@/data/site";

/**
 * Home hero: four full-screen slides that crossfade (site plan, section 3.1).
 *
 * Captions are real text over the photograph. Two layers keep them at WCAG
 * AA on any image: a light scrim over the whole slide and a dark gradient
 * rising from the bottom, at least ~64% opaque wherever text sits, which
 * holds white text above 4.5:1 even on a white photograph.
 *
 * Slide 1's heading is the page's H1; the others share its styling as
 * paragraphs. Slide 1's image loads eagerly, the rest lazily.
 *
 * Each photograph zooms slowly (1 to 1.06) while its slide shows, under
 * the crossfade (.ken-burns in app/globals.css). No zoom under reduced motion.
 *
 * Height: the first screen, less the fixed header (and, below md, the
 * floating mobile action bar).
 */
export function HeroSlider() {
  return (
    <Slider
      label={hero.label}
      tone="dark"
      className="bg-primary"
      viewportClassName="h-[calc(100svh-var(--spacing-header)-var(--spacing-action-bar)-var(--spacing-action-bar-inset)*2)] min-h-[34rem] max-h-[60rem] md:h-[calc(100svh-var(--spacing-header))] lg:h-[calc(100svh-var(--spacing-header-desktop))]"
      controlsClassName="absolute inset-x-0 bottom-space-lg shell md:bottom-space-xl lg:justify-end"
      slideLabels={hero.slides.map((slide) => slide.heading)}
    >
      {hero.slides.map((slide, index) => {
        const Heading = index === 0 ? "h1" : "p";
        return (
          <div key={slide.heading} className="relative h-full">
            <ImageFrame
              image={slide.image.image}
              alt={slide.image.alt}
              ratio="h-full"
              orientation="landscape"
              tone="dark"
              bleed
              priority={index === 0}
              sizes="100vw"
              className="absolute inset-0"
              imageClassName="ken-burns"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-foreground/20"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/65 via-55% to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 pb-32 md:pb-36 lg:pb-space-3xl">
              <div className="shell">
                <div className="max-w-3xl lg:max-w-[46rem]">
                  <Heading className="font-display text-display-hero text-on-primary">
                    {slide.heading}
                  </Heading>
                  <p className="mt-space-md max-w-[46ch] text-body-lg text-on-primary/90">
                    {slide.line}
                  </p>
                  <ButtonGroup stack className="mt-space-lg">
                    <Button href={slide.cta.href} variant="onDark">
                      {slide.cta.label}
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Slider>
  );
}
