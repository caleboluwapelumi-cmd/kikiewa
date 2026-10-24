import type { Metadata } from "next";
import { LocationPage } from "@/components/LocationPage";
import { ebuteLocation, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.ebute);

export default function EbutePage() {
  return <LocationPage location={ebuteLocation} />;
}
