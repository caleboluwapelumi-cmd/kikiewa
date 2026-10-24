import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConsultationSteps } from "@/components/ConsultationSteps";
import { CtaBand } from "@/components/CtaBand";
import { NextStep } from "@/components/NextStep";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { SkinNote } from "@/components/SkinNote";
import {
  breadcrumbRoots,
  concernHref,
  concernMeta,
  concernPage,
  concerns,
  consultationHref,
  findConcern,
  medicalSpa,
} from "@/data/site";
import { pageMetadata } from "@/lib/seo";

/**
 * Fully static. A slug that isn't in data renders completely before the
 * response starts, so notFound() sends a real 404 rather than a 200 shell.
 */
export const ensureStatic = "navigation";

/** One page per concern in data/site.ts. */
export function generateStaticParams() {
  return concerns.map((concern) => ({ concern: concern.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/medical-spa/concerns/[concern]">): Promise<Metadata> {
  const { concern: slug } = await params;
  const concern = findConcern(slug);
  return concern ? pageMetadata(concernMeta(concern)) : {};
}

/**
 * Concern detail (copy deck: "Concern detail"). The intro, then the first
 * step: a consultation. "Treatments we may recommend" stays off until the
 * client confirms which treatments suit each concern, so no concern links
 * to a treatment yet.
 */
export default async function ConcernPage({
  params,
}: PageProps<"/medical-spa/concerns/[concern]">) {
  const { concern: slug } = await params;
  const concern = findConcern(slug);
  if (!concern) notFound();

  const others = concerns.filter((other) => other.slug !== concern.slug);

  return (
    <>
      <PageIntro
        copy={{
          eyebrow: concernPage.eyebrow,
          heading: concern.name + concernPage.headingSuffix,
          body: concern.summary + " " + concernPage.introSuffix,
        }}
        breadcrumbs={[
          breadcrumbRoots.home,
          breadcrumbRoots.skin,
          breadcrumbRoots.concerns,
          { label: concern.name, href: concernHref(concern) },
        ]}
      />

      <NextStep
        heading={concernPage.next.heading}
        body={concernPage.next.body}
        action={{ label: concernPage.next.cta, href: consultationHref }}
        secondary={concernPage.next.more}
      />

      <ConsultationSteps surface="surface" />

      {others.length > 0 ? (
        <section className="section-y w-full border-t border-border bg-background">
          <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
            <SectionHeading heading={concernPage.othersHeading} size="sm" className="lg:col-span-4" />
            <ul className="grid grid-cols-1 border-t border-border-strong md:grid-cols-2 md:gap-x-gutter-desktop lg:col-span-8">
              {others.map((other) => (
                <li key={other.slug} className="border-b border-border">
                  <Link
                    href={concernHref(other)}
                    className="flex items-center justify-between gap-space-md py-space-md text-title-md text-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {other.name}
                    <span aria-hidden="true" className="inline-block h-px w-4 shrink-0 bg-border-strong" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <SkinNote text={medicalSpa.pageNote} />
      <CtaBand />
    </>
  );
}
