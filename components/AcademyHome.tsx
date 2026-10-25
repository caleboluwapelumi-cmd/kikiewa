import { Button } from "@/components/Button";
import { ClassSlideshow } from "@/components/ClassSlideshow";
import { CourseCards } from "@/components/CourseCards";
import { SectionHeading } from "@/components/SectionHeading";
import { academyHome } from "@/data/site";

/**
 * Home academy section (site plan, section 3.5): class slideshow on the
 * left, the two course cards and "See our courses" on the right.
 */
export function AcademyHome() {
  return (
    <section className="section-y w-full border-t border-border bg-surface">
      <div className="shell">
        <SectionHeading
          eyebrow={academyHome.eyebrow}
          heading={academyHome.heading}
          body={academyHome.body}
          className="mb-space-2xl lg:mb-space-3xl"
        />
        <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <div className="lg:col-span-7">
            <ClassSlideshow
              label={academyHome.slideshowLabel}
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
          <div className="flex flex-col gap-space-lg lg:col-span-5">
            <CourseCards compact />
            <Button href={academyHome.cta.href} className="self-start">
              {academyHome.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
