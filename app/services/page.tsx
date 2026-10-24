import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCards } from "@/components/ServiceCards";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import { seo, servicesHub, whatsappMessages } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.services);

/**
 * All services (site plan, section 5): the page heading, six large image
 * cards (the photographs lead here), then "Not sure what to book?".
 */
export default function ServicesPage() {
  return (
    <>
      <PageIntro copy={servicesHub.intro} />

      <section className="w-full bg-background pb-space-3xl lg:pb-32">
        <div className="shell">
          <ServiceCards titleAs="h2" large />
        </div>
      </section>

      <section className="w-full border-t border-border bg-surface py-space-2xl md:py-space-3xl lg:py-28">
        <div className="shell grid grid-cols-1 gap-space-xl lg:grid-cols-12 lg:items-end lg:gap-gutter-desktop">
          <SectionHeading
            eyebrow={servicesHub.help.eyebrow}
            heading={servicesHub.help.heading}
            body={servicesHub.help.body}
            className="lg:col-span-7"
          />
          <div className="lg:col-span-4 lg:col-start-9 lg:justify-self-end">
            <WhatsAppAction label={servicesHub.help.cta} message={whatsappMessages.general} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
