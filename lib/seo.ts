import type { Metadata } from "next";
import { site, type PageMeta } from "@/data/site";

/** The default share image (app/opengraph-image.png). */
const shareImage = { url: "/opengraph-image.png", width: 1200, height: 630, alt: site.name };

/**
 * Metadata for one page from its row in `seo` (data/site.ts): absolute title
 * (no template), description, canonical and Open Graph. Paths resolve
 * against metadataBase (https://kikiewa.com) set in app/layout.tsx.
 *
 * Page metadata merges shallowly over the root layout's, so Open Graph is
 * given in full here, including the share image: the file-based one in app/
 * otherwise reaches the home page only.
 */

export function pageMetadata(page: PageMeta): Metadata {
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.ogLocale,
      url: page.path,
      title: page.title,
      description: page.description,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [shareImage],
    },
  };
}
