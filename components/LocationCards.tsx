import { LocationCard } from "@/components/LocationCard";
import { SectionHeading } from "@/components/SectionHeading";
import { locations, locationsIntro } from "@/data/site";

/** Both branches, two-up on desktop. */
export function LocationCards() {
  return (
    <section className="w-full bg-background py-space-xl lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow={locationsIntro.eyebrow}
          heading={locationsIntro.heading}
          body={locationsIntro.body}
          className="mb-space-xl max-w-2xl"
        />

        <div className="grid grid-cols-1 gap-gutter-desktop lg:grid-cols-2">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </div>
    </section>
  );
}
