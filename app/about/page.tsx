import type { Metadata } from "next";
import { PeacockDivider } from "@/components/brand/PeacockDivider";
import { CtaBand } from "@/components/CtaBand";
import { ImageFrame } from "@/components/ImageFrame";
import { LearningStrip } from "@/components/LearningStrip";
import { LocationsStrip } from "@/components/LocationsStrip";
import { SectionHeading } from "@/components/SectionHeading";
import { TeamGrid } from "@/components/TeamGrid";
import { ValuesList } from "@/components/ValuesList";
import { WideHero } from "@/components/WideHero";
import { about, isTBC, seo, values } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.about);

/**
 * About (site plan, section 4): hero, our story (hidden until supplied),
 * vision and mission side by side, how we work, we keep learning, our team
 * (hidden until real names exist), the two locations, closing band.
 *
 * The page's one peacock divider opens the vision and mission.
 */
export default function AboutPage() {
  const story = isTBC(about.story.paragraphs) ? null : about.story.paragraphs;

  return (
    <>
      <WideHero copy={about.intro} image={about.image} />

      {story ? (
        <section className="section-y w-full border-t border-border bg-background">
          <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
            <SectionHeading heading={about.story.heading} className="lg:col-span-4" />
            <div className="flex flex-col gap-space-lg lg:col-span-7 lg:col-start-6">
              {story.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === 0
                      ? "max-w-[34em] text-pretty font-display text-lead-mobile text-foreground lg:text-lead"
                      : "max-w-[60ch] text-pretty text-body-lg text-muted"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-y w-full border-t border-border bg-surface">
        <div className="shell">
          <PeacockDivider className="mb-space-2xl lg:mb-space-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2">
            {[about.vision, about.mission].map((statement, index) => (
              <div
                key={statement.heading}
                className={
                  index === 0
                    ? "pb-space-xl md:pr-space-xl md:pb-0 lg:pr-space-3xl"
                    : "border-t border-border-strong pt-space-xl md:border-t-0 md:border-l md:pt-0 md:pl-space-xl lg:pl-space-3xl"
                }
              >
                <h2 className="flex items-center gap-3 font-body text-label-sm uppercase text-secondary">
                  <span aria-hidden="true" className="inline-block h-px w-8 shrink-0 bg-accent" />
                  {statement.heading}
                </h2>
                <p className="mt-space-lg text-pretty font-display text-lead-mobile text-primary md:text-lead lg:text-headline-lg-mobile">
                  {statement.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y w-full border-t border-border bg-background">
        <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:items-center lg:gap-gutter-desktop">
          <div className="flex flex-col gap-space-2xl lg:col-span-5">
            <SectionHeading heading={about.valuesHeading} />
            <ImageFrame
              image={about.valuesImage.image}
              alt={about.valuesImage.alt}
              ratio="aspect-[4/3] lg:aspect-[4/5]"
              orientation="portrait"
              tone="warm"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ValuesList items={values} />
          </div>
        </div>
      </section>

      <LearningStrip heading={about.learning.heading} body={about.learning.body} images={about.learning.images} />

      <TeamGrid heading={about.team.heading} body={about.team.body} members={about.team.members} />

      <LocationsStrip
        eyebrow={about.locations.eyebrow}
        heading={about.locations.heading}
        body={about.locations.body}
        link={about.locations.link}
      />
      <CtaBand />
    </>
  );
}
