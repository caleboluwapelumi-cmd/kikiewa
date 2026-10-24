import type { Metadata } from "next";
import { AcademyHome } from "@/components/AcademyHome";
import { CtaBand } from "@/components/CtaBand";
import { HeroSlider } from "@/components/HeroSlider";
import { LocationCards } from "@/components/LocationCards";
import { MiniAbout } from "@/components/MiniAbout";
import { OurWork } from "@/components/OurWork";
import { Testimonials } from "@/components/Testimonials";
import { WhatWeDo } from "@/components/WhatWeDo";
import { seo, testimonials } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.home);

/**
 * Home, in the site plan's order (section 3): hero slider, mini about, what
 * we do, our work, academy, testimonials, locations, closing band.
 */
export default function Home() {
  return (
    <>
      <HeroSlider />
      <MiniAbout />
      <WhatWeDo />
      <OurWork />
      <AcademyHome />
      <Testimonials items={testimonials} />
      <LocationCards />
      <CtaBand />
    </>
  );
}
