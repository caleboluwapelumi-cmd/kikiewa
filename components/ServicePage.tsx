import { Button } from "@/components/Button";
import { CtaBand } from "@/components/CtaBand";
import { Faq } from "@/components/Faq";
import { GalleryGrid } from "@/components/GalleryGrid";
import { IntroStatement } from "@/components/IntroStatement";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { PageNote } from "@/components/PageNote";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceMenu } from "@/components/ServiceMenu";
import { Steps } from "@/components/Steps";
import { Testimonials } from "@/components/Testimonials";
import {
  bookingHref,
  breadcrumbRoots,
  consultationHref,
  cta,
  findServiceCategory,
  gallery,
  servicePage,
  testimonials,
  whatsappHref,
  whatsappMessages,
  contact,
  type ServiceSlug,
} from "@/data/site";
import { serviceJsonLd } from "@/lib/jsonld";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * The service page template (site plan, section 5), shared by all six:
 * hero, intro, menu, what to expect, our work (hidden while empty), FAQs
 * (confirmed answers only), testimonials (same rules as Home), the
 * disclaimer where there is one, closing band.
 *
 * Aesthetics books a consultation, never a treatment, and sits in the
 * cooler register (tone-clinical in app/globals.css).
 */
export function ServicePage({ slug }: { slug: ServiceSlug }) {
  const category = findServiceCategory(slug);
  const work = gallery.filter((item) => item.category === slug);
  const reviews = testimonials.filter((item) => item.service === slug);
  const primary = category.consultationLed
    ? { label: cta.consultation, href: consultationHref }
    : { label: cta.book, href: bookingHref + "?service=" + slug };
  const chat = category.consultationLed
    ? whatsappLink(contact.whatsapp, whatsappMessages.consultation)
    : whatsappHref;

  return (
    <div className={category.consultationLed ? "tone-clinical" : undefined}>
      <JsonLd data={serviceJsonLd(category)} />
      <PageHero
        copy={{ eyebrow: servicePage.eyebrow, heading: category.heading, body: category.line }}
        breadcrumbs={[
          breadcrumbRoots.home,
          breadcrumbRoots.services,
          { label: category.name, href: category.href },
        ]}
        image={category.image}
      >
        <div className="flex flex-wrap items-center gap-x-space-xl gap-y-space-sm">
          <Button href={primary.href} size="lg" icon="arrowRight">
            {primary.label}
          </Button>
          <Button href={chat} size="lg" variant="quiet" icon="whatsapp" iconPosition="leading">
            {cta.whatsapp}
          </Button>
        </div>
      </PageHero>

      <IntroStatement text={category.intro} />
      <ServiceMenu slug={slug} />

      {category.expect ? (
        <Steps heading={servicePage.expectHeading} steps={category.expect} surface="surface" />
      ) : null}

      {work.length ? (
        <section className="section-y w-full border-t border-border bg-background">
          <div className="shell">
            <SectionHeading heading={servicePage.workHeading} className="mb-space-2xl" />
            <GalleryGrid items={work} />
          </div>
        </section>
      ) : null}

      <Faq heading={servicePage.faqHeading} items={category.faqs} />
      <Testimonials items={reviews} />
      {category.disclaimer ? <PageNote text={category.disclaimer} /> : null}
      <CtaBand />
    </div>
  );
}
