import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { SkinNote } from "@/components/SkinNote";
import { TreatmentTable } from "@/components/TreatmentTable";
import {
  breadcrumbRoots,
  consultationHref,
  medicalSpa,
  pages,
  seo,
} from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.treatments);

export default function TreatmentsPage() {
  return (
    <>
      <PageIntro
        copy={pages.treatments}
        breadcrumbs={[breadcrumbRoots.home, breadcrumbRoots.skin, breadcrumbRoots.treatments]}
      >
        <div className="flex flex-wrap items-center gap-x-space-xl gap-y-space-sm">
          <Button href={consultationHref} size="lg" icon="arrowRight">
            Book a consultation
          </Button>
          <Button href={breadcrumbRoots.concerns.href} size="lg" variant="quiet">
            Browse by concern
          </Button>
        </div>
      </PageIntro>
      <TreatmentTable withHeading={false} />
      <SkinNote text={medicalSpa.pageNote} />
      <CtaBand />
    </>
  );
}
