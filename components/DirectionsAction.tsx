import { Button, type ButtonVariant } from "@/components/Button";
import { TbcLabel } from "@/components/Confirmable";
import { cta, isTBC, locationLabels, type Location } from "@/data/site";

/**
 * "Get directions" to a location's Google Maps pin. While the pin is TBC it
 * says so instead, so no link points at a guessed place.
 */
export function DirectionsAction({
  location,
  variant = "quiet",
}: {
  location: Location;
  variant?: ButtonVariant;
}) {
  if (isTBC(location.mapUrl)) {
    return (
      <span className="inline-flex h-12 items-center">
        <TbcLabel className="normal-case tracking-normal">{locationLabels.directionsTbc}</TbcLabel>
      </span>
    );
  }
  return (
    <Button href={location.mapUrl} variant={variant} icon="compass" iconPosition="leading">
      {cta.directions}
    </Button>
  );
}
