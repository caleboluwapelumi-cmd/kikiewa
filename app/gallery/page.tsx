import type { Metadata } from "next";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import { CtaBand } from "@/components/CtaBand";
import { GalleryBrowser, GalleryView } from "@/components/gallery/GalleryBrowser";
import { PageIntro } from "@/components/PageIntro";
import { bookingHref, cta, gallery, galleryFilters, galleryPage, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

// Canonical is /gallery for every ?service= view (pageMetadata).
export const metadata: Metadata = pageMetadata(seo.gallery);

/**
 * Our work (site plan, section 7). The static page renders every photograph
 * ("All"); in the browser the ?service= filter applies. Until photography is
 * supplied the page shows an empty state instead.
 */
export default function GalleryPage() {
  return (
    <>
      <PageIntro copy={galleryPage.intro} />
      <section className="w-full border-t border-border bg-background py-space-2xl lg:py-space-3xl">
        <div className="shell">
          {gallery.length === 0 ? (
            <div className="flex flex-col items-start gap-space-lg border border-dashed border-border-strong p-space-lg md:p-space-xl">
              <p className="font-display text-headline-md text-primary">{galleryPage.empty}</p>
              <p className="max-w-[56ch] text-pretty text-body-md text-muted">{galleryPage.emptyBody}</p>
              <div className="flex flex-wrap items-center gap-x-space-xl gap-y-space-md">
                <Button href="/services" icon="arrowRight">
                  {cta.viewServices}
                </Button>
                <Button href={bookingHref} variant="quiet" icon="calendar" iconPosition="leading">
                  {cta.book}
                </Button>
              </div>
            </div>
          ) : (
            <Suspense fallback={<GalleryView items={gallery} filters={galleryFilters} active={null} />}>
              <GalleryBrowser items={gallery} filters={galleryFilters} />
            </Suspense>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
