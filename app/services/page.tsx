import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCards } from "@/components/ServiceCards";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import { seo, servicesHub, whatsappMessages } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.services);

/** All services (site plan, section 5): six cards, then "Not sure what to book?". */
export default function ServicesPage() {
  return (
    <>
      <PageIntro copy={servicesHub.intro} />
      <section className="w-full bg-background pb-space-3xl">
        <div className="shell">
          <ServiceCards titleAs="h2" large />
        </div>
      </section>
      <section className="w-full border-t border-border bg-surface py-space-2xl lg:py-space-3xl">
        <div className="shell flex flex-col items-start gap-space-lg md:flex-row md:items-end md:justify-between">
          <SectionHeading heading={servicesHub.help.heading} body={servicesHub.help.body} />
          <WhatsAppAction label={servicesHub.help.cta} message={whatsappMessages.general} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
