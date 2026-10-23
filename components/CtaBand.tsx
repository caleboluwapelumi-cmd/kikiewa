import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { ctaBand } from "@/data/site";

export function CtaBand() {
  return (
    <section className="w-full bg-card py-space-xl lg:py-24">
      <div className="shell text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center">
          <SectionHeading
            eyebrow={ctaBand.eyebrow}
            heading={ctaBand.heading}
            body={ctaBand.body}
            align="center"
            className="mb-space-lg"
          />
          <Button
            href={ctaBand.cta.href}
            size="lg"
            icon="calendar"
            className="px-10 py-5"
          >
            {ctaBand.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
