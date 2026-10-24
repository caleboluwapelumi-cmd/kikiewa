import type { MetadataRoute } from "next";
import { isProductionSite } from "@/lib/env";

/** Crawling is allowed only on the production site (lib/env.ts). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isProductionSite
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
  };
}
