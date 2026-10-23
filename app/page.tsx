import { CredibilityStrip } from "@/components/CredibilityStrip";
import { CtaBand } from "@/components/CtaBand";
import { DivisionCards } from "@/components/DivisionCards";
import { EnrolmentBanner } from "@/components/EnrolmentBanner";
import { Hero } from "@/components/Hero";
import { LocationCards } from "@/components/LocationCards";

export default function Home() {
  return (
    <>
      <Hero />
      <DivisionCards />
      <LocationCards />
      <CredibilityStrip />
      <EnrolmentBanner />
      <CtaBand />
    </>
  );
}
