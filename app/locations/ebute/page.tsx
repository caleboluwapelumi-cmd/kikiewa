import type { Metadata } from "next";
import { LocationPage } from "@/components/LocationPage";
import { ebuteLocation } from "@/data/site";

export const metadata: Metadata = {
  title: "Salon & Spa in Ebute, Lagos",
  description:
    "The Kikiewa Ebute branch: salon and spa care in Lagos. Address, opening hours and booking.",
};

export default function EbutePage() {
  return <LocationPage location={ebuteLocation} />;
}
