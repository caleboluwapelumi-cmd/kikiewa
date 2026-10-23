import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ImageFrame } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { divisions, divisionsIntro } from "@/data/site";

export function DivisionCards() {
  return (
    <section id="divisions" className="w-full bg-surface py-space-xl lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow={divisionsIntro.eyebrow}
          heading={divisionsIntro.heading}
          aside={divisionsIntro.body}
          className="mb-space-xl"
        />

        <div className="grid grid-cols-1 gap-gutter-desktop md:grid-cols-2 lg:grid-cols-3">
          {divisions.map((division) => (
            <article
              key={division.title}
              className="group flex flex-col overflow-hidden rounded-xs bg-card shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <ImageFrame
                alt={division.imageAlt}
                ratio="aspect-[16/11]"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                zoomOnHover
              >
                <div className="absolute top-4 left-4 rounded-xs bg-background/90 px-3 py-1 backdrop-blur-sm">
                  <span className="text-label-sm uppercase text-primary">
                    {division.index}
                  </span>
                </div>
              </ImageFrame>

              <div className="flex flex-1 flex-col justify-between p-8">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-secondary">
                    <Icon name={division.icon} className="size-4 shrink-0" />
                    <span className="text-label-sm uppercase">
                      {division.eyebrow}
                    </span>
                  </div>
                  <h3 className="mb-3 text-headline-md text-primary">
                    {division.title}
                  </h3>
                  <p className="mb-6 text-body-md text-muted">{division.body}</p>
                </div>

                <Link
                  href={division.href}
                  className="flex items-center gap-2 rounded-xs bg-surface px-4 py-3 text-title-md text-primary transition-colors group-hover:text-secondary"
                >
                  <span>{division.cta}</span>
                  <Icon
                    name="arrowRight"
                    className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
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
