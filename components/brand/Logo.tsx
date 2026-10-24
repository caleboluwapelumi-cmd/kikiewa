import { logo, logoMono, type LogoTone } from "@/components/brand/paths";

/**
 * The Kikiewa logo, inlined so it scales cleanly and can take theme colours.
 * SVGs never go through next/image.
 *
 * - "colour" (default): full-colour logo for cream surfaces. Its fills come
 *   from the primary, secondary and accent tokens.
 * - "mono": one colour, drawn in currentColor. Use on plum surfaces with a
 *   text colour, e.g. `className="text-cream"`.
 *
 * Size it with a height utility (e.g. `h-11 w-auto`): the viewBox keeps the
 * proportions. The accessible name is "Kikiewa".
 */

const toneFill: Record<LogoTone, string> = {
  primary: "fill-primary",
  secondary: "fill-secondary",
  accent: "fill-accent",
};

type LogoProps = {
  variant?: "colour" | "mono";
  className?: string;
};

export function Logo({ variant = "colour", className = "" }: LogoProps) {
  const art = variant === "mono" ? logoMono : logo;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={art.viewBox}
      role="img"
      aria-label="Kikiewa"
      focusable="false"
      className={className}
    >
      {variant === "mono"
        ? logoMono.paths.map((d, index) => (
            <path key={index} d={d} fill="currentColor" fillRule="evenodd" />
          ))
        : logo.paths.map((path, index) => (
            <path
              key={index}
              d={path.d}
              fillRule="evenodd"
              className={toneFill[path.tone]}
            />
          ))}
    </svg>
  );
}
