import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { LocationsDirectory } from "@/components/LocationsDirectory";
import { locationsPage } from "@/data/site";

export const metadata: Metadata = {
  title: locationsPage.meta.title,
  description: locationsPage.meta.description,
};

export default function LocationsPage() {
  return (
    <>
      <LocationsDirectory />
      <CtaBand />
    </>
  );
}
