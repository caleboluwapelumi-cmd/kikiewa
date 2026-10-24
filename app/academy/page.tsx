import type { Metadata } from "next";
import { PeacockDivider } from "@/components/brand/PeacockDivider";
import { Button } from "@/components/Button";
import { ClassSlideshow } from "@/components/ClassSlideshow";
import { CourseCards } from "@/components/CourseCards";
import { CtaBand } from "@/components/CtaBand";
import { Faq } from "@/components/Faq";
import { SectionHeading } from "@/components/SectionHeading";
import { Steps } from "@/components/Steps";
import { Testimonials } from "@/components/Testimonials";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import { WideHero } from "@/components/WideHero";
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
 * Kikiewa Academy (site plan, section 6): hero, why train with us, the two
 * courses, inside our classes (the shared Slider), how to apply, student
 * testimonials (same rules as Home), FAQs (confirmed answers only), closing
 * band. The page's one peacock divider opens the class slideshow.
 */
export default function AcademyPage() {
  const why = confirmedInProduction(academy.why);

  return (
    <>
      <WideHero copy={academy.intro} image={academy.image}>
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
      </WideHero>

      <section className="section-y w-full border-t border-border bg-background">
        <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <SectionHeading heading={academy.whyHeading} className="lg:col-span-4" />
          <ol
            className={[
              "grid grid-cols-1 border-t border-border-strong lg:col-span-8",
              why.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
            ].join(" ")}
          >
            {why.map((point, index) => (
              <li
                key={point.title}
                className="border-b border-border py-space-lg md:border-b-0 md:py-space-xl md:pr-space-lg md:[&+li]:border-l md:[&+li]:pl-space-lg"
              >
                <p aria-hidden="true" className="text-label-sm tabular-nums text-secondary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-space-md text-balance font-display text-headline-sm text-primary lg:text-headline-md">
                  {point.title}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="courses" className="section-y w-full border-t border-border bg-surface">
        <div className="shell">
          <SectionHeading heading={academy.coursesHeading} className="mb-space-2xl lg:mb-space-3xl" />
          <CourseCards titleAs="h3" />
        </div>
      </section>

      <section className="section-y w-full border-t border-border bg-background">
        <div className="shell">
          <PeacockDivider className="mb-space-2xl lg:mb-space-3xl" />
          <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
            <SectionHeading heading={academy.classesHeading} className="lg:col-span-4" />
            <div className="lg:col-span-8">
              <ClassSlideshow label={academy.classesHeading} sizes="(max-width: 1024px) 100vw, 820px" />
            </div>
          </div>
        </div>
      </section>

      <Steps
        heading={academy.applyHeading}
        steps={academy.apply}
        surface="surface"
        note={
          <div className="flex flex-col items-start gap-space-lg">
            {isTBC(academy.requirements) ? null : (
              <p className="max-w-[60ch] text-pretty text-body-md text-muted">{academy.requirements}</p>
            )}
            <WhatsAppAction label={cta.whatsapp} message={whatsappMessages.academy} />
          </div>
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
