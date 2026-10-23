import Image from "next/image";

/**
 * Photography frame.
 *
 * The design calls for commissioned photography that does not exist yet, so
 * each frame holds a quiet local placeholder (a hairline arch) at the correct
 * aspect ratio and says so on the page. Swap `src` for the real asset and
 * drop the placeholder caption once photography lands — the alt text is
 * already the real one.
 *
 * Every frame carries an inset hairline, so placeholders and real photographs
 * share the same finished edge.
 */

export type ImageTone = "neutral" | "warm";

/** Surface behind the (transparent) placeholder drawing. */
const tones: Record<ImageTone, string> = {
  // Clinical and default: the cool end of the alabaster scale
  neutral: "bg-surface-2",
  // Salon & spa: a soft accent wash over the section surface
  warm: "bg-accent/15",
};

type ImageFrameProps = {
  alt: string;
  /** Tailwind aspect-ratio utility, e.g. "aspect-[4/5]". */
  ratio: string;
  orientation?: "portrait" | "landscape";
  sizes: string;
  priority?: boolean;
  tone?: ImageTone;
  className?: string;
  /** Overlays rendered above the image (captions, badges). */
  children?: React.ReactNode;
  /** Slow, slight zoom when an ancestor `group` is hovered. */
  zoomOnHover?: boolean;
};

export function ImageFrame({
  alt,
  ratio,
  orientation = "landscape",
  sizes,
  priority = false,
  tone = "neutral",
  className = "",
  children,
  zoomOnHover = false,
}: ImageFrameProps) {
  return (
    <div
      className={[
        "relative w-full overflow-hidden rounded-xs",
        tones[tone],
        ratio,
        className,
      ].join(" ")}
    >
      <Image
        src={
          orientation === "portrait"
            ? "/images/placeholder-portrait.svg"
            : "/images/placeholder-landscape.svg"
        }
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={[
          "object-cover",
          zoomOnHover
            ? "transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
            : "",
        ].join(" ")}
      />

      {/* Inset hairline frame */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 border border-primary/10 md:inset-4"
      />

      <span className="absolute top-6 right-6 flex items-center gap-2 text-label-sm uppercase text-muted md:top-7 md:right-7">
        <span aria-hidden="true" className="inline-block h-px w-4 bg-muted/60" />
        Image to be supplied
      </span>

      {children}
    </div>
  );
}
