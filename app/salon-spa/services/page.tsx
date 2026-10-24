import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { ServiceMenu } from "@/components/ServiceMenu";
import { pages } from "@/data/site";

export const metadata: Metadata = pages.salonServices.meta;

export default function SalonServicesPage() {
  return (
    <>
      <PageIntro copy={pages.salonServices} />
      <ServiceMenu division="salon-spa" />
      <CtaBand />
    </>
  );
}
