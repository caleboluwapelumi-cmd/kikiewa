import Link from "next/link";
import { Button, ButtonGroup } from "@/components/Button";
import { Confirmable } from "@/components/Confirmable";
import { CtaBand } from "@/components/CtaBand";
import { FactTable } from "@/components/FactTable";
import { Icon } from "@/components/Icon";
import { IntroStatement } from "@/components/IntroStatement";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Steps } from "@/components/Steps";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import {
  academy,
  breadcrumbRoots,
  contact,
  courses,
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
 * Course page (site plan, section 6), shared by both courses: hero with the
 * course name, overview, what you'll learn, the facts table (each fact
 * "To be confirmed" until supplied), how to apply, a call to action, then
 * the closing band. Course JSON-LD carries confirmed fields only.
 */
export function CoursePage({ slug }: { slug: CourseSlug }) {
  const course = findCourse(slug);
  const other = courses.find((item) => item.slug !== slug);
  const chat = whatsappLink(contact.whatsapp, whatsappMessages.academy);

  return (
    <>
      <JsonLd data={courseJsonLd(course)} />
      <PageHero
        copy={{ eyebrow: academy.intro.eyebrow, heading: course.name, body: course.cardLine }}
        breadcrumbs={[breadcrumbRoots.home, breadcrumbRoots.academy, { label: course.name, href: course.href }]}
        image={course.image}
      >
        <ButtonGroup stack>
          <Button href="#apply">{academy.applyHeading}</Button>
          <Button href={chat} variant="whatsapp">
            {cta.whatsapp}
          </Button>
        </ButtonGroup>
      </PageHero>

      <IntroStatement text={course.overview} label={academy.overviewLabel} />

      <section className="section-y w-full border-t border-border bg-background">
        <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <SectionHeading heading={academy.learnHeading} className="lg:col-span-4" />
          <ul className="border-t border-border-strong lg:col-span-7 lg:col-start-6">
            {course.modules.map((module, index) => (
              <li key={module} className="flex items-baseline gap-space-lg border-b border-border py-space-lg">
                <span aria-hidden="true" className="text-label-sm tabular-nums text-secondary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-headline-sm text-primary lg:text-headline-md">{module}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y w-full border-t border-border bg-surface">
        <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <SectionHeading heading={academy.factsHeading} className="lg:col-span-4" />
          <FactTable
            className="lg:col-span-7 lg:col-start-6"
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
        id="apply"
        heading={academy.applyHeading}
        steps={academy.apply}
        note={
          isTBC(academy.requirements) ? null : (
            <p className="max-w-[60ch] text-pretty text-body-md text-muted">{academy.requirements}</p>
          )
        }
      />

      <section className="w-full border-t border-border bg-surface py-space-2xl md:py-space-3xl lg:py-28">
        <div className="shell grid grid-cols-1 gap-space-xl lg:grid-cols-12 lg:items-end lg:gap-gutter-desktop">
          <div className="flex flex-col items-start gap-space-lg lg:col-span-7">
            <SectionHeading heading={academy.courseCta.heading} body={academy.courseCta.body} />
            <ButtonGroup>
              <WhatsAppAction label={cta.whatsapp} message={whatsappMessages.academy} />
              <Button href={academy.courseCta.secondary.href} variant="secondary">
                {academy.courseCta.secondary.label}
              </Button>
            </ButtonGroup>
          </div>

          {other ? (
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-label-sm uppercase text-muted">{academy.otherCourse}</p>
              <Link
                href={other.href}
                className="group mt-space-sm flex items-center justify-between gap-space-md border-y border-border-strong py-space-md font-display text-headline-md text-primary transition-colors duration-200 hover:text-secondary"
              >
                {other.name}
                <Icon
                  name="arrowRight"
                  className="size-4 shrink-0 text-secondary transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
                />
              </Link>
              <p className="mt-space-sm text-body-md text-muted">{other.cardLine}</p>
            </div>
          ) : null}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
