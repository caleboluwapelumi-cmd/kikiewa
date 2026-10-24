import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { ImageFrame } from "@/components/ImageFrame";
import { PageIntro } from "@/components/PageIntro";
import { gallery, pages, type DivisionSlug } from "@/data/site";

export const metadata: Metadata = pages.gallery.meta;

// DRAFT COPY - client approval needed
const sections: { division: DivisionSlug; title: string; empty: string }[] = [
  {
    division: "salon-spa",
    title: "Salon & Spa",
    empty: "Photographs of the Ebute salon and spa will appear here.",
  },
  {
    division: "medical-spa",
    title: "Medical Spa & Makeover",
    empty: "Photographs of the Nitel practice will appear here. We never show client faces or before-and-after images without written consent.",
  },
  {
    division: "institute",
    title: "Beauty Institute",
    empty: "Photographs of the institute's teaching rooms will appear here.",
  },
];

export default function GalleryPage() {
  return (
    <>
      <PageIntro copy={pages.gallery}>
        <nav aria-label="Gallery sections" className="flex flex-wrap gap-x-space-lg gap-y-space-sm">
          {sections.map((section) => (
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

      {sections.map((section) => {
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
                        alt={item.alt}
                        ratio="aspect-[4/5]"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-space-md max-w-[56ch] text-pretty text-body-md text-muted">
                  {section.empty}
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
