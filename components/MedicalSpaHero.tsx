import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { medicalSpa } from "@/data/site";

/**
 * Skin & aesthetics hero, in the clinical register. Text leads, with an
 * "On this page" index ruled like a document's contents beside it; the
 * photograph runs wide underneath. No tinted band, no offset frame, nothing
 * decorative: the Hair & Beauty hero is the warm one.
 */
export function MedicalSpaHero() {
  const { hero, contents } = medicalSpa;

  return (
    <section className="w-full bg-background pt-space-2xl md:pt-space-3xl lg:pt-28">
      <div className="shell">
        <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:items-end lg:gap-gutter-desktop">
          <div className="flex flex-col lg:col-span-8">
            <p className="mb-space-lg flex items-center gap-3 text-label-sm uppercase text-secondary">
              <span aria-hidden="true" className="inline-block h-px w-8 shrink-0 bg-accent" />
              {hero.eyebrow}
            </p>

            <h1 className="max-w-[13em] text-balance text-display-hero-mobile text-primary lg:text-display-hero">
              {hero.heading}
            </h1>

            <p className="mt-space-lg max-w-[54ch] text-pretty text-body-lg text-muted">
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

          <nav
            aria-labelledby="medical-spa-contents"
            className="hidden md:block lg:col-span-3 lg:col-start-10"
          >
            <p id="medical-spa-contents" className="text-label-sm uppercase text-muted">
              {contents.label}
            </p>
            <ol className="mt-space-md border-t border-border-strong">
              {contents.links.map((link, index) => (
                <li key={link.href} className="border-b border-border">
                  <a
                    href={link.href}
                    className="flex items-baseline gap-space-md py-3 text-body-sm text-foreground transition-colors duration-200 hover:text-secondary"
                  >
                    <span className="text-label-sm tabular-nums text-secondary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="mt-space-2xl lg:mt-space-3xl">
          <ImageFrame
            image={hero.image.asset}
            alt={hero.image.alt}
            ratio="aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]"
            orientation="landscape"
            priority
            sizes="(max-width: 1360px) 100vw, 1232px"
          />
        </div>
      </div>
    </section>
  );
}
