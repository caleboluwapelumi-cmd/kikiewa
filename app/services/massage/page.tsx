import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.massage);

export default function Page() {
  return <ServicePage slug="massage" />;
}
