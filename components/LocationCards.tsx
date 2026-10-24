import { LocationCard } from "@/components/LocationCard";
import { SectionHeading } from "@/components/SectionHeading";
import { findUs, locations } from "@/data/site";

/** "Find us in Ikorodu": both locations, two-up on desktop. */
export function LocationCards() {
  return (
    <section className="section-y w-full bg-background">
      <div className="shell">
        <SectionHeading
          heading={findUs.heading}
          aside={findUs.body}
          className="mb-space-2xl lg:mb-space-3xl"
        />

        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2 lg:gap-gutter-desktop">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </div>
    </section>
  );
}
