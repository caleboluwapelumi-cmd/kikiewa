import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { ServiceMenu } from "@/components/ServiceMenu";
import { pages } from "@/data/site";

export const metadata: Metadata = pages.treatments.meta;

export default function TreatmentsPage() {
  return (
    <>
      <PageIntro copy={pages.treatments}>
        <div className="flex flex-wrap items-center gap-x-space-xl gap-y-space-sm">
          <Button href="/book?service=consultation" size="lg" icon="arrowRight">
            Book a consultation
          </Button>
          <Button href="/medical-spa/concerns" size="lg" variant="quiet">
            Browse by concern
          </Button>
        </div>
      </PageIntro>
      <ServiceMenu division="medical-spa" />
      <CtaBand />
    </>
  );
}
