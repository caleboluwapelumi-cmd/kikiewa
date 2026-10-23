import { LocationCard } from "@/components/LocationCard";
import { SectionHeading } from "@/components/SectionHeading";
import { locations, locationsPage } from "@/data/site";

/**
 * Both branches two-up, as the page heading section of /locations. Same
 * compact card as the home page — only the heading levels differ, since this
 * heading is the page title.
 */
export function LocationsDirectory() {
  return (
    <section className="section-y w-full bg-background">
      <div className="shell">
        <SectionHeading
          eyebrow={locationsPage.eyebrow}
          heading={locationsPage.heading}
          body={locationsPage.body}
          as="h1"
          className="mb-space-2xl"
        />

        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2 lg:gap-gutter-desktop">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              titleAs="h2"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
