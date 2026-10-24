import type { Metadata } from "next";
import { ConsultationSteps } from "@/components/ConsultationSteps";
import { CredentialsBlock } from "@/components/CredentialsBlock";
import { CtaBand } from "@/components/CtaBand";
import { LocationBlock } from "@/components/LocationBlock";
import { MedicalSpaHero } from "@/components/MedicalSpaHero";
import { MedicalSpaIntro } from "@/components/MedicalSpaIntro";
import { TreatmentCards } from "@/components/TreatmentCards";
import { medicalSpa, nitelLocation, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.medicalSpa);

export default function MedicalSpaPage() {
  return (
    <>
      <MedicalSpaHero />
      <MedicalSpaIntro />
      <TreatmentCards />
      <ConsultationSteps />
      <CredentialsBlock />
      <LocationBlock
        location={nitelLocation}
        copy={medicalSpa.location}
        tone="clinical"
      />
      <CtaBand />
    </>
  );
}
