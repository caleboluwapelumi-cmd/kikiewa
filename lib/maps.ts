import type { Location } from "@/data/site";

/**
 * Google Maps links for a branch, with no API key. A branch with a pin
 * (lat/lng, ideally a place ID) points at that exact place; one without
 * falls back to a text search (data/site.ts, BranchMap).
 */

/** Spaces as "+", commas left readable: "Obafemi+Awolowo+Road,+Ikorodu". */
function encodeQuery(text: string): string {
  return encodeURIComponent(text).replace(/%20/g, "+").replace(/%2C/gi, ",");
}

function pin(location: Location): { lat: number; lng: number } | null {
  const { lat, lng } = location.map;
  return lat !== undefined && lng !== undefined ? { lat, lng } : null;
}

/**
 * "Get directions": opens directions in the Google Maps app on phones, or
 * maps.google.com elsewhere.
 */
export function directionsUrl(location: Location): string {
  const base = "https://www.google.com/maps/dir/?api=1&destination=";
  const point = pin(location);
  if (point) {
    const place = location.map.placeId ? "&destination_place_id=" + location.map.placeId : "";
    return `${base}${point.lat},${point.lng}${place}`;
  }
  return base + encodeQuery(location.map.directionsQuery ?? `Kikiewa ${location.name} Ikorodu Lagos`);
}

/** The embedded map's iframe src (loaded only after "Show map" is tapped). */
export function mapEmbedUrl(location: Location): string {
  const point = pin(location);
  const query = point ? `${point.lat},${point.lng}` : encodeQuery(location.map.embedQuery ?? `${location.name}, Ikorodu, Lagos`);
  return `https://maps.google.com/maps?q=${query}&z=${point ? 16 : 15}&output=embed`;
}

/** The branch's Google Maps listing, for JSON-LD hasMap. Null without a place ID. */
export function mapsPlaceUrl(location: Location): string | null {
  return location.map.placeId ? "https://www.google.com/maps/place/?q=place_id:" + location.map.placeId : null;
}

/** Lat/lng for JSON-LD geo. Null without a pin. */
export function branchGeo(location: Location): { lat: number; lng: number } | null {
  return pin(location);
}
