import type { Metadata } from "next";
import { CourseCards } from "@/components/CourseCards";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { pages, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.courses);

export default function CoursesPage() {
  return (
    <>
      <PageIntro copy={pages.courses} />
      <section className="section-y w-full border-t border-border bg-surface">
        <div className="shell">
          <CourseCards />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
