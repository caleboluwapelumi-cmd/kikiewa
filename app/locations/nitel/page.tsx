import type { Metadata } from "next";
import { LocationPage } from "@/components/LocationPage";
import { nitelLocation } from "@/data/site";

export const metadata: Metadata = {
  title: "Medical Spa & Makeover in Nitel, Lagos",
  description:
    "The Kikiewa Nitel branch: medical spa, makeover and the Beauty Institute in Lagos. Address, opening hours and consultations.",
};

export default function NitelPage() {
  return <LocationPage location={nitelLocation} />;
}
