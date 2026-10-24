import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { LocationsDirectory } from "@/components/LocationsDirectory";
import { seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.locations);

export default function LocationsPage() {
  return (
    <>
      <LocationsDirectory />
      <CtaBand />
    </>
  );
}
