import type { MetadataRoute } from "next";
import { policyIsPending } from "@/components/LegalPage";
import { legalPages, products, seo, site } from "@/data/site";
import { productHref } from "@/lib/shop";

/**
 * Every indexable page, from the `seo` table in data/site.ts. Left out:
 * policy pages while their text is pending (they are noindex), and the
 * shop until real products exist (with none, /shop is a 404 in
 * production). No lastModified: the content has no reliable dates yet.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const skip = new Set<string>([
    ...(policyIsPending(legalPages.bookingPolicy) ? [seo.bookingPolicy.path] : []),
    ...(policyIsPending(legalPages.privacy) ? [seo.privacy.path] : []),
    ...(products.length ? [] : [seo.shop.path]),
  ]);
  const paths = [
    ...Object.values(seo)
      .map((page) => page.path)
      .filter((path) => !skip.has(path)),
    ...products.map(productHref),
  ];
  return paths.map((path) => ({ url: path === "/" ? site.url : site.url + path }));
}
