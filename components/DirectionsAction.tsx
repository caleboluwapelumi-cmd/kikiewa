import { Button } from "@/components/Button";
import { TbcLabel } from "@/components/Confirmable";
import { cta, isTBC, locationLabels, type Location } from "@/data/site";

/**
 * "Get directions" to a location's Google Maps pin, as a secondary button.
 * While the pin is TBC it says so instead, so no link points at a guessed
 * place.
 */
export function DirectionsAction({ location }: { location: Location }) {
  if (isTBC(location.mapUrl)) {
    return (
      <span className="inline-flex min-h-12 items-center">
        <TbcLabel className="normal-case tracking-normal">{locationLabels.directionsTbc}</TbcLabel>
      </span>
    );
  }
  return (
    <Button href={location.mapUrl} variant="secondary">
      {cta.directions}
    </Button>
  );
}
