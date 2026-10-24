import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Confirmable } from "@/components/Confirmable";
import { ConsultationSteps } from "@/components/ConsultationSteps";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { breadcrumbRoots, consultationHref, pages, services, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { formatDuration, formatNaira } from "@/lib/format";

export const metadata: Metadata = pageMetadata(seo.consultation);

const consultation = services.find((service) => service.slug === "consultation");

export default function ConsultationPage() {
  return (
    <>
      <PageIntro
        copy={pages.consultation}
        breadcrumbs={[
          breadcrumbRoots.home,
          breadcrumbRoots.skin,
          { label: pages.consultation.heading, href: "/medical-spa/consultation" },
        ]}
      >
        <div className="flex flex-col gap-space-xl">
          <dl className="grid max-w-xl grid-cols-2 divide-x divide-border border-y border-border-strong">
            <div className="py-space-md pr-space-lg">
              <dt className="text-label-sm uppercase text-muted">Duration</dt>
              <dd className="mt-space-xs text-body-md text-foreground">
                <Confirmable value={consultation?.durationMins} format={formatDuration} />
              </dd>
            </div>
            <div className="py-space-md pl-space-lg">
              <dt className="text-label-sm uppercase text-muted">Consultation fee</dt>
              <dd className="mt-space-xs text-body-md text-foreground">
                <Confirmable value={consultation?.priceFrom} format={formatNaira} />
              </dd>
            </div>
          </dl>
          <div>
            <Button href={consultationHref} size="lg" icon="arrowRight">
              Book a consultation
            </Button>
          </div>
        </div>
      </PageIntro>
      <ConsultationSteps />
      <CtaBand />
    </>
  );
}
