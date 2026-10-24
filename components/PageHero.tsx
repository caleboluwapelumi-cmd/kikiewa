import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ImageFrame } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import type { ImageSlot, NavLink, PageCopy } from "@/data/site";

/**
 * Opening section for service and course pages: breadcrumbs, eyebrow, the
 * page's H1, one line and actions, beside one photograph (eager, as it is
 * above the fold).
 */
type PageHeroProps = {
  copy: PageCopy;
  breadcrumbs: NavLink[];
  image: ImageSlot;
  children?: React.ReactNode;
};

export function PageHero({ copy, breadcrumbs, image, children }: PageHeroProps) {
  return (
    <section className="w-full bg-background pt-space-lg pb-space-2xl md:pt-space-xl lg:pb-space-3xl">
      <div className="shell">
        <Breadcrumbs trail={breadcrumbs} className="mb-space-xl lg:mb-space-2xl" />
        <div className="grid grid-cols-1 items-end gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <div className="flex flex-col lg:col-span-6 lg:pb-space-xl">
            <SectionHeading eyebrow={copy.eyebrow} heading={copy.heading} body={copy.body} as="h1" size="xl" />
            {children ? <div className="mt-space-xl">{children}</div> : null}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ImageFrame
              image={image.image}
              alt={image.alt}
              ratio="aspect-[4/3] lg:aspect-[5/4]"
              tone="warm"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
