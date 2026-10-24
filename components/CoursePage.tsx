import { Button } from "@/components/Button";
import { Confirmable } from "@/components/Confirmable";
import { CtaBand } from "@/components/CtaBand";
import { FactRow } from "@/components/FactRow";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Steps } from "@/components/Steps";
import {
  academy,
  breadcrumbRoots,
  classSlides,
  contact,
  cta,
  findCourse,
  isTBC,
  whatsappMessages,
  type CourseSlug,
} from "@/data/site";
import { formatNaira } from "@/lib/format";
import { courseJsonLd } from "@/lib/jsonld";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Course page (site plan, section 6): name, overview, what you'll learn,
 * the facts (each "To be confirmed" until supplied), how to apply.
 */
export function CoursePage({ slug }: { slug: CourseSlug }) {
  const course = findCourse(slug);
  const chat = whatsappLink(contact.whatsapp, whatsappMessages.academy);

  return (
    <>
      <JsonLd data={courseJsonLd(course)} />
      <PageHero
        copy={{ eyebrow: academy.intro.eyebrow, heading: course.name, body: course.overview }}
        breadcrumbs={[breadcrumbRoots.home, breadcrumbRoots.academy, { label: course.name, href: course.href }]}
        image={classSlides[slug === "cosmetology" ? 1 : 3]}
      >
        <Button href={chat} size="lg" icon="whatsapp" iconPosition="leading">
          {cta.whatsapp}
        </Button>
      </PageHero>

      <section className="section-y w-full border-t border-border bg-background">
        <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <SectionHeading heading={academy.learnHeading} className="lg:col-span-4" />
          <ul className="border-t border-border-strong lg:col-span-8">
            {course.modules.map((module) => (
              <li key={module} className="border-b border-border py-space-md font-display text-headline-sm text-primary">
                {module}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="w-full border-t border-border bg-surface py-space-2xl lg:py-space-3xl">
        <div className="shell">
          <SectionHeading heading={academy.factsHeading} size="sm" className="mb-space-lg" />
          <FactRow
            facts={[
              { label: academy.facts.duration, value: <Confirmable value={course.duration} /> },
              { label: academy.facts.schedule, value: <Confirmable value={course.schedule} /> },
              { label: academy.facts.fee, value: <Confirmable value={course.fee} format={formatNaira} /> },
              { label: academy.facts.nextIntake, value: <Confirmable value={course.nextIntake} /> },
              { label: academy.facts.certificate, value: <Confirmable value={course.certificate} /> },
            ]}
          />
        </div>
      </section>

      <Steps
        heading={academy.applyHeading}
        steps={academy.apply}
        note={
          isTBC(academy.requirements) ? null : (
            <p className="max-w-[60ch] text-body-md text-muted">{academy.requirements}</p>
          )
        }
      />
      <CtaBand />
    </>
  );
}
