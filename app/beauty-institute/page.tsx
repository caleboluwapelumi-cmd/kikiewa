import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { CourseCards } from "@/components/CourseCards";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { instituteActions, pages, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.institute);

export default function BeautyInstitutePage() {
  return (
    <>
      <PageIntro copy={pages.institute}>
        <div className="flex flex-wrap items-center gap-x-space-xl gap-y-space-sm">
          <Button href={instituteActions.viewCourses.href} size="lg" icon="arrowRight">
            {instituteActions.viewCourses.label}
          </Button>
          <Button href={instituteActions.bookVisit.href} size="lg" variant="quiet">
            {instituteActions.bookVisit.label}
          </Button>
        </div>
      </PageIntro>
      <section className="section-y w-full border-t border-border bg-surface">
        <div className="shell">
          <CourseCards />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
