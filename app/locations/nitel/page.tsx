import type { Metadata } from "next";
import { LocationPage } from "@/components/LocationPage";
import { nitelLocation, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.nitel);

export default function NitelPage() {
  return <LocationPage location={nitelLocation} />;
}
