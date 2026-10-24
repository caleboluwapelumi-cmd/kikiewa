import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { ExpectationPoints } from "@/components/ExpectationPoints";
import { GalleryStrip } from "@/components/GalleryStrip";
import { IntroStatement } from "@/components/IntroStatement";
import { LocationBlock } from "@/components/LocationBlock";
import { SalonSpaHero } from "@/components/SalonSpaHero";
import { ServiceCategories } from "@/components/ServiceCategories";
import { ebuteLocation, salonSpa, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.salonSpa);

/** Footer is rendered once by the root layout, so it is not repeated here. */
export default function SalonSpaPage() {
  return (
    <>
      <SalonSpaHero />
      <IntroStatement text={salonSpa.intro} rule={false} />
      <ServiceCategories />
      <ExpectationPoints />
      {/* The page's one peacock divider */}
      <GalleryStrip
        eyebrow={salonSpa.gallery.eyebrow}
        heading={salonSpa.gallery.heading}
        items={salonSpa.gallery.items}
        divider
      />
      <LocationBlock
        location={ebuteLocation}
        copy={salonSpa.location}
        tone="warm"
      />
      <CtaBand />
    </>
  );
}
