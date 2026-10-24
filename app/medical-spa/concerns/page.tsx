import type { Metadata } from "next";
import { ConcernCards } from "@/components/ConcernCards";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { SkinNote } from "@/components/SkinNote";
import { breadcrumbRoots, medicalSpa, pages, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.concerns);

export default function ConcernsPage() {
  return (
    <>
      <PageIntro
        copy={pages.concerns}
        breadcrumbs={[breadcrumbRoots.home, breadcrumbRoots.skin, breadcrumbRoots.concerns]}
      />
      <ConcernCards withHeading={false} />
      <SkinNote text={medicalSpa.pageNote} />
      <CtaBand />
    </>
  );
}
