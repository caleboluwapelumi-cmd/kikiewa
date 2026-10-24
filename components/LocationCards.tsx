import { LocationCard } from "@/components/LocationCard";
import { SectionHeading } from "@/components/SectionHeading";
import { locations, locationsSection } from "@/data/site";

/** Home "Visit us in Ikorodu" (site plan, section 3.7): two equal cards. */
export function LocationCards() {
  return (
    <section className="section-y w-full border-t border-border bg-background">
      <div className="shell">
        <SectionHeading
          heading={locationsSection.heading}
          aside={locationsSection.intro}
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
