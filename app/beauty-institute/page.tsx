import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { CourseCards } from "@/components/CourseCards";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { pages } from "@/data/site";

export const metadata: Metadata = pages.institute.meta;

export default function BeautyInstitutePage() {
  return (
    <>
      <PageIntro copy={pages.institute}>
        <div className="flex flex-wrap items-center gap-x-space-xl gap-y-space-sm">
          <Button href="/beauty-institute/admissions" size="lg" icon="arrowRight">
            Admissions
          </Button>
          <Button href="/beauty-institute/courses" size="lg" variant="quiet">
            All courses
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
