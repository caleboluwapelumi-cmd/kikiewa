import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { ValuesList } from "@/components/ValuesList";
import { about, isTBC, seo, values } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.about);

/**
 * About (site plan, section 4). The story and team are hidden until the
 * client supplies them. Full layout comes with the next step.
 */
export default function AboutPage() {
  const story = isTBC(about.story.paragraphs) ? null : about.story.paragraphs;

  return (
    <>
      <PageIntro copy={about.intro} />

      {story ? (
        <section className="section-y w-full border-t border-border bg-background">
          <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
            <SectionHeading heading={about.story.heading} className="lg:col-span-4" />
            <div className="flex flex-col gap-space-md lg:col-span-8">
              {story.map((paragraph) => (
                <p key={paragraph} className="max-w-[60ch] text-pretty text-body-lg text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-y w-full border-t border-border bg-surface">
        <div className="shell grid grid-cols-1 gap-space-2xl md:grid-cols-2 lg:gap-gutter-desktop">
          {[about.vision, about.mission].map((statement) => (
            <div key={statement.heading} className="border-t-2 border-primary pt-space-lg">
              <h2 className="font-body text-label-sm uppercase text-secondary">{statement.heading}</h2>
              <p className="mt-space-md text-pretty font-display text-lead-mobile text-foreground lg:text-lead">
                {statement.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y w-full border-t border-border bg-background">
        <div className="shell">
          <ValuesList heading={about.valuesHeading} items={values} headingAs="h2" />
        </div>
      </section>

      <section className="w-full border-t border-border bg-background py-space-2xl lg:py-space-3xl">
        <div className="shell flex flex-col items-start gap-space-lg md:flex-row md:items-end md:justify-between">
          <SectionHeading heading={about.locations.heading} body={about.locations.body} />
          <Button href={about.locations.link.href} variant="quiet" icon="arrowRight">
            {about.locations.link.label}
          </Button>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
