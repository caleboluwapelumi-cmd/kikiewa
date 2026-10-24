import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { ClassSlideshow } from "@/components/ClassSlideshow";
import { CourseCards } from "@/components/CourseCards";
import { CtaBand } from "@/components/CtaBand";
import { Faq } from "@/components/Faq";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { Steps } from "@/components/Steps";
import { Testimonials } from "@/components/Testimonials";
import {
  academy,
  contact,
  cta,
  isTBC,
  seo,
  studentTestimonials,
  testimonialsSection,
  whatsappMessages,
} from "@/data/site";
import { confirmedInProduction } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata(seo.academy);

/**
 * Kikiewa Academy (site plan, section 6). Student testimonials follow the
 * Home rules; there are none yet. Full layout comes with the next step.
 */
export default function AcademyPage() {
  const why = confirmedInProduction(academy.why);

  return (
    <>
      <PageIntro copy={academy.intro}>
        <div className="flex flex-wrap items-center gap-x-space-xl gap-y-space-sm">
          <Button href="#courses" size="lg" icon="arrowRight">
            {cta.seeCourses}
          </Button>
          <Button
            href={whatsappLink(contact.whatsapp, whatsappMessages.academy)}
            size="lg"
            variant="quiet"
            icon="whatsapp"
            iconPosition="leading"
          >
            {cta.whatsapp}
          </Button>
        </div>
      </PageIntro>

      <section className="w-full border-t border-border bg-background py-space-2xl lg:py-space-3xl">
        <div className="shell grid grid-cols-1 gap-space-xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <SectionHeading heading={academy.whyHeading} size="sm" className="lg:col-span-4" />
          <ul className="grid grid-cols-1 gap-space-md md:grid-cols-3 lg:col-span-8">
            {why.map((point) => (
              <li key={point.title} className="border-t-2 border-primary pt-space-md font-display text-headline-sm text-primary">
                {point.title}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="courses" className="section-y w-full border-t border-border bg-surface">
        <div className="shell">
          <SectionHeading heading={academy.coursesHeading} className="mb-space-2xl" />
          <CourseCards />
        </div>
      </section>

      <section className="section-y w-full border-t border-border bg-background">
        <div className="shell">
          <SectionHeading heading={academy.classesHeading} className="mb-space-2xl" />
          <div className="max-w-4xl">
            <ClassSlideshow label={academy.classesHeading} sizes="(max-width: 1024px) 100vw, 900px" />
          </div>
        </div>
      </section>

      <Steps
        heading={academy.applyHeading}
        steps={academy.apply}
        surface="surface"
        note={
          isTBC(academy.requirements) ? null : (
            <p className="max-w-[60ch] text-body-md text-muted">{academy.requirements}</p>
          )
        }
      />
      <Testimonials
        heading={academy.testimonialsHeading}
        items={studentTestimonials}
        placeholder={testimonialsSection.studentPlaceholder}
      />
      <Faq heading={academy.faqHeading} items={academy.faqs} />
      <CtaBand />
    </>
  );
}
