import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ImageFrame } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { divisions, divisionsIntro } from "@/data/site";

/**
 * The three divisions. Hairline cards, flat at rest; the whole card is the
 * link target (the link's ::after covers it), and hover lifts it slightly.
 * One link per card, named by its CTA text. The focus ring is drawn on the
 * stretched ::after so it outlines the whole clickable card.
 */
export function DivisionCards() {
  return (
    <section id="divisions" className="section-y w-full border-y border-border bg-surface">
      <div className="shell">
        <SectionHeading
          eyebrow={divisionsIntro.eyebrow}
          heading={divisionsIntro.heading}
          aside={divisionsIntro.body}
          className="mb-space-2xl"
        />

        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3 lg:gap-gutter-desktop">
          {divisions.map((division) => (
            <article
              key={division.title}
              className="group relative flex flex-col border border-border bg-card transition-[box-shadow,border-color,transform] duration-300 ease-out-soft focus-within:border-border-strong hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lift"
            >
              <ImageFrame
                image={division.image}
                alt={division.imageAlt}
                ratio="aspect-[4/3]"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                zoomOnHover
              >
                <span className="absolute top-6 left-6 border border-border bg-background px-space-sm py-space-xs text-label-sm uppercase text-primary md:top-7 md:left-7">
                  {division.index}
                </span>
              </ImageFrame>

              <div className="flex flex-1 flex-col p-space-lg lg:p-8">
                <p className="mb-space-md flex items-start gap-space-sm text-label-sm uppercase text-secondary">
                  <Icon name={division.icon} className="size-4 shrink-0" />
                  <span>{division.eyebrow}</span>
                </p>
                <h3 className="text-headline-md text-primary">{division.title}</h3>
                <p className="mt-space-sm mb-space-xl text-pretty text-body-md text-muted">
                  {division.body}
                </p>

                <Link
                  href={division.href}
                  className="mt-auto flex items-center justify-between border-t border-border pt-space-md text-label-md uppercase text-primary transition-colors duration-200 after:absolute after:inset-0 group-hover:text-secondary focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-secondary"
                >
                  <span>{division.cta}</span>
                  <Icon
                    name="arrowRight"
                    className="size-4 shrink-0 transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
