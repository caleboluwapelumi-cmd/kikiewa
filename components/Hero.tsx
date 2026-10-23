import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { ImageFrame } from "@/components/ImageFrame";
import { hero } from "@/data/site";

export function Hero() {
  return (
    <section className="w-full overflow-hidden bg-background py-space-xl lg:py-28">
      <div className="shell">
        <div className="grid grid-cols-1 items-center gap-gutter-desktop lg:grid-cols-12">
          {/* Text column — asymmetric 7 of 12 */}
          <div className="z-10 flex flex-col lg:col-span-7">
            <div className="mb-space-md flex items-center gap-space-sm">
              <span className="inline-block h-px w-8 bg-secondary" />
              <span className="text-label-sm uppercase text-secondary">
                {hero.eyebrow}
              </span>
            </div>

            <h1 className="mb-space-md max-w-2xl text-display-hero-mobile text-primary lg:text-display-hero">
              {hero.heading}
            </h1>

            <p className="mb-space-xl max-w-xl text-body-lg text-muted">
              {hero.body}
            </p>

            <div className="flex flex-wrap items-center gap-space-md">
              <Button href={hero.primaryCta.href} size="lg" icon="arrowRight">
                {hero.primaryCta.label}
              </Button>
              <Button
                href={hero.secondaryCta.href}
                size="lg"
                variant="quiet"
              >
                {hero.secondaryCta.label}
              </Button>
            </div>

            <dl className="mt-space-xl grid grid-cols-1 gap-space-md rounded-xs bg-surface p-space-md sm:grid-cols-3">
              {hero.stats.map((stat) => (
                <div key={stat.value}>
                  <dt className="block text-headline-sm text-primary">
                    {stat.value}
                  </dt>
                  <dd className="text-label-sm uppercase text-muted">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual column — asymmetric 5 of 12 */}
          <div className="relative mt-space-lg lg:col-span-5 lg:mt-0">
            <ImageFrame
              alt={hero.image.alt}
              ratio="aspect-[4/5]"
              orientation="portrait"
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="shadow-md"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              <div className="absolute inset-x-6 bottom-6 rounded-xs bg-background/90 p-space-md backdrop-blur-md">
                <span className="block text-label-sm uppercase text-secondary">
                  {hero.image.caption}
                </span>
                <p className="mt-1 text-body-sm text-foreground">
                  {hero.image.body}
                </p>
              </div>
            </ImageFrame>

            {/* Floating credential badge */}
            <div className="absolute -top-6 -left-8 hidden max-w-[200px] flex-col gap-1 rounded-xs bg-card p-5 shadow-xl sm:flex">
              <Icon name="shield" className="size-6 text-secondary" />
              <span className="mt-1 text-title-md text-primary">
                {hero.badge.title}
              </span>
              <span className="text-body-sm leading-snug text-muted">
                {hero.badge.body}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
