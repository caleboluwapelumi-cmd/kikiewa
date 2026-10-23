import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { ImageFrame } from "@/components/ImageFrame";
import { hero } from "@/data/site";

export function Hero() {
  return (
    <section className="w-full overflow-hidden bg-background pt-space-2xl pb-space-2xl md:pt-space-3xl lg:pt-28 lg:pb-32">
      <div className="shell">
        <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          {/* Text column — asymmetric 7 of 12 */}
          <div className="z-10 flex flex-col lg:col-span-7">
            <p className="mb-space-lg flex items-center gap-3 text-label-sm uppercase text-secondary">
              <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
              {hero.eyebrow}
            </p>

            <h1 className="max-w-[14em] text-balance text-display-hero-mobile text-primary lg:text-display-hero">
              {hero.heading}
            </h1>

            <p className="mt-space-lg max-w-[52ch] text-pretty text-body-lg text-muted">
              {hero.body}
            </p>

            <div className="mt-space-xl flex flex-wrap items-center gap-x-space-xl gap-y-space-sm">
              <Button href={hero.primaryCta.href} size="lg" icon="arrowRight">
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} size="lg" variant="quiet">
                {hero.secondaryCta.label}
              </Button>
            </div>

            <dl className="mt-space-2xl grid grid-cols-1 border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-border">
              {hero.stats.map((stat) => (
                <div
                  key={stat.value}
                  className="flex flex-col gap-space-sm border-b border-border py-space-md sm:border-b-0 sm:px-space-lg sm:pt-space-lg sm:pb-0 sm:first:pl-0"
                >
                  <dt className="font-display text-headline-sm text-primary">
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
          <div className="relative lg:col-span-5">
            <ImageFrame
              alt={hero.image.alt}
              ratio="aspect-[4/5]"
              orientation="portrait"
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            >
              <div className="absolute inset-x-6 bottom-6 border border-border bg-background/95 p-space-md md:inset-x-8 md:bottom-8 md:p-space-lg">
                <span className="block text-label-sm uppercase text-secondary">
                  {hero.image.caption}
                </span>
                <p className="mt-space-sm text-body-sm text-foreground">
                  {hero.image.body}
                </p>
              </div>
            </ImageFrame>

            {/* Credential badge, offset over the frame edge */}
            <div className="absolute top-10 -left-6 hidden max-w-[13rem] flex-col gap-space-sm border border-border bg-card p-space-lg shadow-float sm:flex lg:-left-12">
              <Icon name="shield" className="size-5 text-secondary" />
              <span className="font-display text-title-lg text-primary">
                {hero.badge.title}
              </span>
              <span className="text-body-sm text-muted">{hero.badge.body}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
