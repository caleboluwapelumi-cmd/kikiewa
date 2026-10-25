import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { LocationCard } from "@/components/LocationCard";
import { PageIntro } from "@/components/PageIntro";
import { locations, locationsPage, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.locations);

/** Both branches, two equal cards with a click-to-load map each (site plan, section 7). */
export default function LocationsPage() {
  return (
    <>
      <PageIntro copy={locationsPage} />
      <section className="w-full bg-background pb-space-3xl">
        <div className="shell grid grid-cols-1 gap-gutter lg:grid-cols-2 lg:gap-gutter-desktop">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} titleAs="h2" withMap />
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
