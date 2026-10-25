import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { isProductionSite } from "@/lib/env";

/** Crawling is allowed only on the production site (lib/env.ts), which also points at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return isProductionSite
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: site.url + "/sitemap.xml" }
    : { rules: { userAgent: "*", disallow: "/" } };
}
