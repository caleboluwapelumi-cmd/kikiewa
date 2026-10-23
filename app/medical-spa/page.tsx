import type { Metadata } from "next";
import { ConsultationSteps } from "@/components/ConsultationSteps";
import { CredentialsBlock } from "@/components/CredentialsBlock";
import { CtaBand } from "@/components/CtaBand";
import { LocationBlock } from "@/components/LocationBlock";
import { MedicalSpaHero } from "@/components/MedicalSpaHero";
import { MedicalSpaIntro } from "@/components/MedicalSpaIntro";
import { TreatmentCards } from "@/components/TreatmentCards";
import { medicalSpa, nitelLocation } from "@/data/site";

export const metadata: Metadata = {
  title: medicalSpa.meta.title,
  description: medicalSpa.meta.description,
};

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
