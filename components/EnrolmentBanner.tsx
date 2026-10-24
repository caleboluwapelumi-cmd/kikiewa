import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { courses, enrolment, isTBC } from "@/data/site";

/**
 * Beauty Institute admissions. A single framed panel with a plum top rule —
 * aspirational in scale, credible in restraint: no decorative washes, and
 * the course list is set like a prospectus contents page and reads from the
 * same course records as the institute pages.
 */
export function EnrolmentBanner() {
  return (
    <section className="section-y w-full bg-background">
      <div className="shell">
        <div className="grid grid-cols-1 gap-space-2xl border border-t-2 border-border border-t-primary bg-card p-space-lg md:p-14 lg:grid-cols-12 lg:gap-gutter-desktop lg:p-16">
          <div className="flex flex-col lg:col-span-7">
            {isTBC(enrolment.flag) ? null : (
              <p className="mb-space-lg inline-flex w-fit items-center gap-space-sm border border-accent bg-accent/10 px-space-sm py-space-xs text-label-sm uppercase text-primary">
                <span aria-hidden="true" className="size-1.5 shrink-0 bg-secondary" />
                {enrolment.flagLabel}
                <span aria-hidden="true">·</span>
                <span>{enrolment.flag}</span>
              </p>
            )}

            <h2 className="text-balance text-headline-lg-mobile text-primary lg:text-headline-lg">
              {enrolment.heading}
            </h2>
            <p className="mt-space-md max-w-[56ch] text-pretty text-body-lg text-muted">
              {enrolment.body}
            </p>

            <div className="mt-space-xl flex flex-wrap items-center gap-space-md">
              <Button href={enrolment.primaryCta.href} size="lg" icon="arrowRight">
                {enrolment.primaryCta.label}
              </Button>
              <Button
                href={enrolment.secondaryCta.href}
                size="lg"
                variant="subtle"
              >
                {enrolment.secondaryCta.label}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:border-l lg:border-border lg:pl-gutter-desktop">
            <h3 className="font-body text-label-sm uppercase text-secondary">
              {enrolment.programmesTitle}
            </h3>
            <ol className="mt-space-md border-t border-border">
              {courses.map((course) => (
                <li
                  key={course.slug}
                  className="flex items-start gap-space-md border-b border-border py-space-md"
                >
                  <Icon
                    name="notes"
                    className="mt-1 size-4 shrink-0 text-secondary"
                  />
                  <span className="flex flex-col gap-space-xs">
                    <span className="font-display text-title-lg text-primary">
                      {course.name}
                    </span>
                    {isTBC(course.duration) ? null : (
                        <span className="flex flex-wrap items-baseline gap-x-space-sm text-body-sm text-muted">
                          Duration
                          <span>{course.duration}</span>
                        </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
