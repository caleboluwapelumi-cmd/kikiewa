import { Button } from "@/components/Button";
import { cta, type Location } from "@/data/site";
import { directionsUrl } from "@/lib/maps";

/**
 * "Get directions" to a branch on Google Maps, as a secondary button. Opens
 * the Maps app on phones. A branch with a pin goes to that exact place; one
 * without searches its address (lib/maps.ts).
 */
export function DirectionsAction({ location }: { location: Location }) {
  return (
    <Button href={directionsUrl(location)} target="_blank" rel="noopener noreferrer" variant="secondary">
      {cta.directions}
      <span className="sr-only">: {location.title} (opens Google Maps)</span>
    </Button>
  );
}
