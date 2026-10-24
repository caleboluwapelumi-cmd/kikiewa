import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCards } from "@/components/ServiceCards";
import { whatWeDo } from "@/data/site";

/** Home "What we do" (site plan, section 3.3): the six services. */
export function WhatWeDo() {
  return (
    <section className="section-y w-full border-t border-border bg-background">
      <div className="shell">
        <SectionHeading
          heading={whatWeDo.heading}
          aside={whatWeDo.intro}
          className="mb-space-2xl lg:mb-space-3xl"
        />
        <ServiceCards />
      </div>
    </section>
  );
}
