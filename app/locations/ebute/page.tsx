import type { Metadata } from "next";
import { LocationPage } from "@/components/LocationPage";
import { ebuteLocation } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(ebuteLocation.seo);

export default function Page() {
  return <LocationPage location={ebuteLocation} />;
}
