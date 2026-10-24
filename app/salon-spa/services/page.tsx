import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { ServiceMenu } from "@/components/ServiceMenu";
import { pages, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.salonServices);

export default function SalonServicesPage() {
  return (
    <>
      <PageIntro copy={pages.salonServices} />
      <ServiceMenu division="salon-spa" />
      <CtaBand />
    </>
  );
}
