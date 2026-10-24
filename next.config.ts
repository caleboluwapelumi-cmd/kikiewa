import type { NextConfig } from "next";

/**
 * Old URLs from the previous site structure, redirected permanently (308)
 * to their new homes (reference/site-plan.md, section 2). `:path*` also
 * matches the bare path, so each rule covers the section and everything
 * under it. These are not pages: `npm run check:seo` fails if any of them
 * is ever built as one.
 */
const legacyRedirects: { source: string; destination: string }[] = [
  { source: "/salon-spa/:path*", destination: "/services" },
  { source: "/medical-spa/:path*", destination: "/services/aesthetics" },
  { source: "/beauty-institute/:path*", destination: "/academy" },
  { source: "/licensing", destination: "/about" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return legacyRedirects.map((rule) => ({ ...rule, permanent: true }));
  },
};

export default nextConfig;
