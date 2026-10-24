import type { Metadata } from "next";
import { ClinicalTeam } from "@/components/ClinicalTeam";
import { ConcernCards } from "@/components/ConcernCards";
import { ConsultationSteps } from "@/components/ConsultationSteps";
import { CredentialsBlock } from "@/components/CredentialsBlock";
import { CtaBand } from "@/components/CtaBand";
import { Faq } from "@/components/Faq";
import { IntroStatement } from "@/components/IntroStatement";
import { LocationBlock } from "@/components/LocationBlock";
import { MedicalSpaHero } from "@/components/MedicalSpaHero";
import { SkinNote } from "@/components/SkinNote";
import { TreatmentTable } from "@/components/TreatmentTable";
import { medicalSpa, nitelLocation, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.medicalSpa);

/**
 * Skin & Aesthetics, in the copy deck's section 3 order. The clinical tone
 * comes from app/medical-spa/layout.tsx. No peacock divider here: the
 * clinical pages carry no decorative flourishes. The clinical team and
 * "Our standards" render nothing until they hold confirmed data.
 */
export default function MedicalSpaPage() {
  const { intro, faq } = medicalSpa;

  return (
    <>
      <MedicalSpaHero />
      <IntroStatement text={intro.body} label={intro.label} rule={false} />
      <ConsultationSteps id="how-it-works" surface="surface" />
      <ConcernCards id="concerns" />
      <TreatmentTable id="treatments" />
      <ClinicalTeam />
      <CredentialsBlock />
      <Faq id="faq" eyebrow={faq.eyebrow} heading={faq.heading} items={faq.items} />
      <LocationBlock location={nitelLocation} copy={medicalSpa.location} tone="clinical" />
      <SkinNote text={medicalSpa.pageNote} />
      <CtaBand />
    </>
  );
}
