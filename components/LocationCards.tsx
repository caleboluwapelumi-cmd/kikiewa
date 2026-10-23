import { LocationCard } from "@/components/LocationCard";
import { SectionHeading } from "@/components/SectionHeading";
import { locations, locationsIntro } from "@/data/site";

/** Both branches, two-up on desktop. */
export function LocationCards() {
  return (
    <section className="section-y w-full bg-background">
      <div className="shell">
        <SectionHeading
          eyebrow={locationsIntro.eyebrow}
          heading={locationsIntro.heading}
          body={locationsIntro.body}
          className="mb-space-2xl"
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
