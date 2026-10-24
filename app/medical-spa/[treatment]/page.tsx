import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { Confirmable } from "@/components/Confirmable";
import { ConsultationSteps } from "@/components/ConsultationSteps";
import { CtaBand } from "@/components/CtaBand";
import { FactRow } from "@/components/FactRow";
import { NextStep } from "@/components/NextStep";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { Tag } from "@/components/Tag";
import {
  breadcrumbRoots,
  contact,
  findTreatment,
  isTBC,
  medicalBookingHref,
  medicalTreatments,
  nitelLocation,
  treatmentHref,
  treatmentMeta,
  treatmentPage,
  whatsappMessages,
} from "@/data/site";
import { formatDuration, formatNaira } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Fully static. A slug that isn't in data renders completely before the
 * response starts, so notFound() sends a real 404 rather than a 200 shell.
 */
export const ensureStatic = "navigation";

/** One page per treatment, prerendered from data/site.ts. */
export function generateStaticParams() {
  return medicalTreatments().map((service) => ({ treatment: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/medical-spa/[treatment]">): Promise<Metadata> {
  const { treatment } = await params;
  const service = findTreatment(treatment);
  return service ? pageMetadata(treatmentMeta(service)) : {};
}

/**
 * Treatment detail (copy deck: "Treatment detail"). Fact row, what to
 * expect, aftercare (hidden while TBC), the disclaimer and the booking
 * action. Consultation-led treatments book the consultation; the others
 * (makeover services) book directly and skip the clinical sections.
 * "Who it may suit" and "Related concerns" wait for client copy and for
 * concern→treatment links.
 */
export default async function TreatmentPage({
  params,
}: PageProps<"/medical-spa/[treatment]">) {
  const { treatment } = await params;
  const service = findTreatment(treatment);
  if (!service) notFound();

  const consultationLed = service.requiresConsultation;
  const action = {
    label: consultationLed ? treatmentPage.consultationCta : treatmentPage.bookCta,
    href: medicalBookingHref(service),
  };
  const whatsapp = {
    label: treatmentPage.whatsappLabel,
    href: whatsappLink(contact.whatsapp, whatsappMessages.medical),
    whatsapp: true,
  };
  const aftercare =
    service.aftercare && !isTBC(service.aftercare) && service.aftercare.length > 0
      ? service.aftercare
      : null;

  return (
    <>
      <PageIntro
        copy={{ eyebrow: treatmentPage.eyebrow, heading: service.name, body: service.summary }}
        breadcrumbs={[
          breadcrumbRoots.home,
          breadcrumbRoots.skin,
          breadcrumbRoots.treatments,
          { label: service.name, href: treatmentHref(service) },
        ]}
      >
        <div className="flex flex-col items-start gap-space-xl">
          <div className="flex w-full flex-col gap-space-md">
            <FactRow
              className="w-full md:w-auto md:self-start"
              facts={[
                {
                  label: treatmentPage.facts.duration,
                  value: <Confirmable value={service.durationMins} format={formatDuration} />,
                },
                {
                  label: treatmentPage.facts.price,
                  value: <Confirmable value={service.priceFrom} format={formatNaira} />,
                },
                { label: treatmentPage.facts.location, value: nitelLocation.area },
              ]}
            />
            {consultationLed ? (
              <p>
                <Tag label={treatmentPage.facts.consultationTag} />
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-x-space-xl gap-y-space-sm">
            <Button href={action.href} size="lg" icon="arrowRight">
              {action.label}
            </Button>
            <Button href={whatsapp.href} size="lg" variant="quiet" icon="whatsapp" iconPosition="leading">
              {whatsapp.label}
            </Button>
          </div>
        </div>
      </PageIntro>

      {consultationLed ? (
        <ConsultationSteps eyebrow={null} heading={treatmentPage.expectHeading} surface="surface" />
      ) : null}

      {aftercare ? (
        <section className="section-y w-full border-t border-border bg-background">
          <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
            <SectionHeading heading={treatmentPage.aftercareHeading} className="lg:col-span-4" />
            <ul className="border-t border-border-strong lg:col-span-8">
              {aftercare.map((point) => (
                <li key={point} className="border-b border-border py-space-md text-body-md text-foreground">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {consultationLed ? (
        <NextStep body={treatmentPage.disclaimer} smallPrint action={action} secondary={whatsapp} />
      ) : null}
      <CtaBand />
    </>
  );
}
