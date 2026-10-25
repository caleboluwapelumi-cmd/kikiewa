import { Button, ButtonGroup } from "@/components/Button";
import { CtaBand } from "@/components/CtaBand";
import { Faq } from "@/components/Faq";
import { GalleryGrid } from "@/components/GalleryGrid";
import { MethodStrip } from "@/components/MethodStrip";
import { IntroStatement } from "@/components/IntroStatement";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { PageNote } from "@/components/PageNote";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceMenu } from "@/components/ServiceMenu";
import { ServiceSigns } from "@/components/ServiceSigns";
import { Steps } from "@/components/Steps";
import { Testimonials } from "@/components/Testimonials";
import { WorkPlaceholderGrid } from "@/components/WorkPlaceholderGrid";
import {
  bookingHref,
  breadcrumbRoots,
  consultationHref,
  contact,
  cta,
  findServiceCategory,
  gallery,
  howWeWork,
  servicePage,
  testimonials,
  whatsappHref,
  whatsappMessages,
  type ServiceSlug,
} from "@/data/site";
import { serviceJsonLd } from "@/lib/jsonld";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * The service page template (site plan, section 5), shared by all six:
 * hero, intro, menu, what to expect (the four steps of the Kikiewa method,
 * with this service's line for each, under the method strip), signs
 * (facials only), our work (three placeholder tiles until photographs
 * arrive), FAQs (confirmed answers only), testimonials (same rules as Home), the
 * disclaimer where there is one, closing band.
 *
 * Aesthetics books a consultation, never a treatment: the hero, menu and
 * closing band all say "Book a consultation". It sits in the cooler
 * register (tone-clinical in app/globals.css) and carries no peacock.
 */
export function ServicePage({ slug }: { slug: ServiceSlug }) {
  const category = findServiceCategory(slug);
  const work = gallery.filter((item) => item.category === slug);
  const reviews = testimonials.filter((item) => item.service === slug);
  const clinical = category.consultationLed;
  const expect = howWeWork.steps.map((step) => ({ title: step.name, body: category.expect[step.id] }));

  const primary = clinical
    ? { label: cta.consultation, href: consultationHref }
    : { label: cta.book, href: bookingHref + "?service=" + slug };
  const chat = clinical ? whatsappLink(contact.whatsapp, whatsappMessages.consultation) : whatsappHref;

  return (
    <div className={clinical ? "tone-clinical" : undefined}>
      <JsonLd data={serviceJsonLd(category)} />
      <PageHero
        copy={{ eyebrow: servicePage.eyebrow, heading: category.heading, body: category.line }}
        breadcrumbs={[breadcrumbRoots.home, breadcrumbRoots.services, { label: category.name, href: category.href }]}
        image={category.heroImage ?? category.image}
        imageTone={clinical ? "neutral" : "warm"}
      >
        <ButtonGroup stack>
          <Button href={primary.href}>{primary.label}</Button>
          <Button href={chat} variant="whatsapp">
            {cta.whatsapp}
          </Button>
        </ButtonGroup>
      </PageHero>

      <IntroStatement text={category.intro} />
      <ServiceMenu slug={slug} />

      <Steps lead={<MethodStrip />} heading={servicePage.expectHeading} steps={expect} surface="surface" />
      {category.signs ? <ServiceSigns signs={category.signs} /> : null}

      <section className="section-y w-full border-t border-border bg-background">
        <div className="shell">
          <div className="mb-space-xl flex flex-col gap-space-lg md:mb-space-2xl md:flex-row md:items-end md:justify-between">
            <SectionHeading heading={servicePage.workHeading} />
            <Button href={"/gallery?service=" + slug} variant="secondary" className="self-start md:self-auto">
              {cta.seeWork}
            </Button>
          </div>
          {work.length ? <GalleryGrid items={work} /> : <WorkPlaceholderGrid categories={[slug, slug, slug]} />}
        </div>
      </section>

      <Faq heading={servicePage.faqHeading} items={category.faqs} />
      <Testimonials items={reviews} />
      {category.disclaimer ? <PageNote text={category.disclaimer} /> : null}
      <CtaBand primary={clinical ? primary : undefined} secondary={clinical ? { label: cta.whatsapp, href: chat } : undefined} />
    </div>
  );
}
