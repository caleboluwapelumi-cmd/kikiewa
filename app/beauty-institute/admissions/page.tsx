import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Confirmable } from "@/components/Confirmable";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import { courses, pages } from "@/data/site";

export const metadata: Metadata = pages.admissions.meta;

export default function AdmissionsPage() {
  return (
    <>
      <PageIntro copy={pages.admissions}>
        <div className="flex flex-wrap items-start gap-x-space-xl gap-y-space-md">
          <WhatsAppAction
            label="Ask about a course"
            message="Hello Kikiewa, I would like to ask about a course at the Beauty Institute."
          />
          <Button href="/beauty-institute/courses" variant="quiet" icon="arrowRight">
            Compare courses
          </Button>
        </div>
      </PageIntro>

      <section className="section-y w-full border-t border-border bg-surface">
        <div className="shell">
          <h2 className="text-headline-md text-primary">Next intake by course</h2>
          <dl className="mt-space-lg max-w-3xl divide-y divide-border border-y border-border-strong">
            {courses.map((course) => (
              <div
                key={course.slug}
                className="grid grid-cols-1 gap-space-xs py-space-md sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-space-lg"
              >
                <dt className="text-title-md text-foreground">{course.name}</dt>
                <dd className="text-body-md text-foreground">
                  <Confirmable value={course.nextIntake} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
