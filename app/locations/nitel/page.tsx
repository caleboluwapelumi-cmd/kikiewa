import type { Metadata } from "next";
import { LocationPage } from "@/components/LocationPage";
import { nitelLocation } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(nitelLocation.seo);

export default function Page() {
  return <LocationPage location={nitelLocation} />;
}
