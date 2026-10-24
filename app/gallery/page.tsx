import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { ImageFrame } from "@/components/ImageFrame";
import { PageIntro } from "@/components/PageIntro";
import { gallery, galleryEmpty, gallerySections, pages, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.gallery);

export default function GalleryPage() {
  return (
    <>
      <PageIntro copy={pages.gallery}>
        <nav aria-label="Gallery sections" className="flex flex-wrap gap-x-space-lg gap-y-space-sm">
          {gallerySections.map((section) => (
            <a
              key={section.division}
              href={"#" + section.division}
              className="link-rule py-1 text-label-md uppercase text-primary hover:text-secondary"
            >
              {section.title}
            </a>
          ))}
        </nav>
      </PageIntro>

      {gallerySections.map((section) => {
        const items = gallery.filter((item) => item.division === section.division);
        return (
          <section
            key={section.division}
            id={section.division}
            aria-labelledby={section.division + "-heading"}
            className="w-full border-t border-border bg-background py-space-2xl lg:py-space-3xl"
          >
            <div className="shell">
              <h2 id={section.division + "-heading"} className="text-headline-md text-primary">
                {section.title}
              </h2>
              {items.length ? (
                <ul className="mt-space-xl grid grid-cols-2 gap-space-sm md:gap-gutter lg:grid-cols-3">
                  {items.map((item) => (
                    <li key={item.src}>
                      <ImageFrame
                        image={item}
                        alt={item.alt}
                        ratio="aspect-[4/5]"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-space-md max-w-[56ch] text-pretty text-body-md text-muted">
                  {galleryEmpty}
                </p>
              )}
            </div>
          </section>
        );
      })}
      <CtaBand />
    </>
  );
}
