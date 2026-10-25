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
import { ServiceSigns } from "@/components/ServiceSigns";
import { Steps } from "@/components/Steps";
import { Testimonials } from "@/components/Testimonials";
import {
  bookingHref,
  breadcrumbRoots,
  consultationHref,
  contact,
  cta,
  findServiceCategory,
  gallery,
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
 * hero, intro, menu, what to expect, signs (facials only), our work
 * (hidden while empty), FAQs
 * (confirmed answers only), testimonials (same rules as Home), the
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
      {category.signs ? <ServiceSigns signs={category.signs} /> : null}

      {work.length ? (
        <section className="section-y w-full border-t border-border bg-background">
          <div className="shell">
            <div className="mb-space-2xl flex flex-col gap-space-lg md:flex-row md:items-end md:justify-between">
              <SectionHeading heading={servicePage.workHeading} />
              <Button href={"/gallery?service=" + slug} variant="quiet" icon="arrowRight" className="self-start md:self-auto">
                {cta.seeWork}
              </Button>
            </div>
            <GalleryGrid items={work} />
          </div>
        </section>
      ) : null}

      <Faq heading={servicePage.faqHeading} items={category.faqs} />
      <Testimonials items={reviews} />
      {category.disclaimer ? <PageNote text={category.disclaimer} /> : null}
      <CtaBand primary={clinical ? primary : undefined} secondary={clinical ? { label: cta.whatsapp, href: chat } : undefined} />
    </div>
  );
}
