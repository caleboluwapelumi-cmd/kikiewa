import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageIntro } from "@/components/PageIntro";
import { gallery, galleryFilters, galleryPage, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.gallery);

/**
 * Our work (site plan, section 7). Interactive filters and the <dialog>
 * lightbox come with the next step; for now each filter jumps to its
 * section, and sections without photographs are left out.
 */
export default function GalleryPage() {
  const sections = galleryFilters
    .map((filter) => ({ ...filter, items: gallery.filter((item) => item.category === filter.slug) }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      <PageIntro copy={galleryPage.intro}>
        {sections.length ? (
          <nav aria-label={galleryPage.filtersLabel} className="flex flex-wrap gap-x-space-lg gap-y-space-sm">
            {sections.map((section) => (
              <a
                key={section.slug}
                href={"#" + section.slug}
                className="link-rule py-1 text-label-md uppercase text-primary hover:text-secondary"
              >
                {section.label}
              </a>
            ))}
          </nav>
        ) : (
          <p className="max-w-[56ch] text-pretty text-body-md text-muted">{galleryPage.empty}</p>
        )}
      </PageIntro>

      {sections.map((section) => (
        <section
          key={section.slug}
          id={section.slug}
          aria-labelledby={section.slug + "-heading"}
          className="w-full border-t border-border bg-background py-space-2xl lg:py-space-3xl"
        >
          <div className="shell">
            <h2 id={section.slug + "-heading"} className="mb-space-xl text-headline-md text-primary">
              {section.label}
            </h2>
            <GalleryGrid items={section.items} />
          </div>
        </section>
      ))}
      <CtaBand />
    </>
  );
}
