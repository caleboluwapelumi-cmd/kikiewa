import type { Metadata } from "next";
import { AcademyBand } from "@/components/AcademyBand";
import { BrandPromise } from "@/components/BrandPromise";
import { CtaBand } from "@/components/CtaBand";
import { Favourites } from "@/components/Favourites";
import { FeatureSplit } from "@/components/FeatureSplit";
import { GalleryStrip } from "@/components/GalleryStrip";
import { Hero } from "@/components/Hero";
import { LocationCards } from "@/components/LocationCards";
import { OfferingTiles } from "@/components/OfferingTiles";
import { homeGallery, seo, skinFeature, visitFeature } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.home);

/**
 * Home, in the copy deck's v2 order. Reviews, team, credentials and the
 * brand story stay off until the client confirms them (hide, don't
 * placeholder). The peacock divider appears once, over "Inside Kikiewa".
 */
export default function Home() {
  return (
    <>
      <Hero />
      <BrandPromise />
      <OfferingTiles />
      <FeatureSplit copy={skinFeature} imageSide="right" surface="surface" />
      <FeatureSplit copy={visitFeature} imageSide="left" tone="warm" />
      <Favourites />
      <GalleryStrip
        heading={homeGallery.heading}
        body={homeGallery.body}
        items={homeGallery.items}
        link={homeGallery.link}
        divider
      />
      <AcademyBand />
      <LocationCards />
      <CtaBand />
    </>
  );
}
