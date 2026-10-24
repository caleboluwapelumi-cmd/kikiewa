import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { DivisionCards } from "@/components/DivisionCards";
import { EnrolmentBanner } from "@/components/EnrolmentBanner";
import { Hero } from "@/components/Hero";
import { LocationCards } from "@/components/LocationCards";
import { seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.home);

/**
 * Credentials, credibility, team and reviews stay off Home until the client
 * confirms them (copy deck: hide, don't placeholder).
 */
export default function Home() {
  return (
    <>
      <Hero />
      <DivisionCards />
      <LocationCards />
      <EnrolmentBanner />
      <CtaBand />
    </>
  );
}
