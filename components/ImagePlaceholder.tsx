import { markMono } from "@/components/brand/paths";
import { isProductionSite } from "@/lib/env";

/**
 * What an image frame shows until its photograph arrives: a soft gradient
 * from cream into plum, the mono peacock mark centred at low opacity, and
 * (previews only) a small caption saying what goes there, e.g.
 * "Our work · Nails". It fills its parent, so it keeps the frame's size
 * and aspect ratio, and never reads as a broken image or a grey box.
 *
 * Production keeps the placeholder and drops the caption. Screen readers
 * hear "Photo coming soon". Placeholders are not stock photographs: the
 * OwnImageAsset type still refuses stock in Our work.
 */

export type PlaceholderTone = "neutral" | "warm" | "dark";

const gradients: Record<PlaceholderTone, string> = {
  // Cream into a plum wash
  warm: "bg-linear-to-br from-cream from-15% via-surface-warm to-primary/25",
  // Cooler and quieter (aesthetics, inside tone-clinical)
  neutral: "bg-linear-to-br from-background from-15% via-surface-2 to-primary/15",
  // Deep plum, for frames that carry light text
  dark: "bg-linear-to-br from-primary to-primary-hover",
};

type ImagePlaceholderProps = {
  /** What the photograph will show. Previews only. */
  caption?: string;
  tone?: PlaceholderTone;
  /** Extra classes on the mark (the hover zoom). */
  markClassName?: string;
  className?: string;
};

export function ImagePlaceholder({ caption, tone = "warm", markClassName = "", className = "" }: ImagePlaceholderProps) {
  const dark = tone === "dark";
  return (
    <div
      role="img"
      aria-label="Photo coming soon"
      className={["absolute inset-0 overflow-hidden", gradients[tone], className].join(" ")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={markMono.viewBox}
        aria-hidden="true"
        focusable="false"
        className={[
          "absolute top-1/2 left-1/2 h-[34%] max-h-44 min-h-12 w-auto -translate-x-1/2 -translate-y-1/2",
          dark ? "text-cream opacity-20" : "text-primary opacity-[0.13]",
          markClassName,
        ].join(" ")}
      >
        {markMono.paths.map((d, index) => (
          <path key={index} d={d} fill="currentColor" fillRule="evenodd" />
        ))}
      </svg>
      {caption && !isProductionSite ? (
        <span
          className={[
            "absolute inset-x-5 top-5 flex items-start gap-2 font-body text-label-sm uppercase md:inset-x-6 md:top-6",
            dark ? "text-on-primary/85" : "text-primary",
          ].join(" ")}
        >
          <span aria-hidden="true" className="mt-[0.45rem] inline-block h-px w-4 shrink-0 bg-current opacity-60" />
          {caption}
        </span>
      ) : null}
    </div>
  );
}
