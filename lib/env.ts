/**
 * True only when NEXT_PUBLIC_SITE_ENV is "production". Every other build
 * (local, previews) tells search engines to stay away: app/robots.ts
 * disallows all and the root metadata sets noindex, nofollow.
 * The variable is set in the hosting dashboard at launch, nowhere in code.
 */
export const isProductionSite = process.env.NEXT_PUBLIC_SITE_ENV === "production";
