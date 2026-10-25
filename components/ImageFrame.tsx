import Image from "next/image";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { ImageAsset } from "@/data/site";
import { isProductionSite } from "@/lib/env";

/**
 * Photography frame.
 *
 * - With an `image` (an ImageAsset from data/site.ts): renders it through
 *   next/image, filling the frame at the given aspect ratio, with `sizes`
 *   so the browser picks the right width.
 * - Without one: the designed placeholder (components/ImagePlaceholder.tsx)
 *   in the same frame: gradient, peacock mark and, on previews, a caption
 *   saying what goes there (`placeholder`, else the alt text). The `alt`
 *   text is kept ready for the real photograph.
 *
 * SVGs never go through next/image (and images.dangerouslyAllowSVG stays
 * off): an ImageAsset pointing at an .svg fails loudly instead.
 *
 * Frames have soft 16px corners (radius-card) and an inset hairline with
 * matching concentric corners, so placeholders and real photographs share
 * the same finished edge. Full-bleed frames (the hero) have neither.
 *
 * Temporary images (source "stock-temp" or "instagram-temp") carry a small
 * "Temp image" badge on previews, so nobody mistakes them for final. Kept
 * stock (source "stock") has no badge. The badge never renders in
 * production, where check:images blocks temporary images anyway.
 */

export type ImageTone = "neutral" | "warm" | "dark";

/** Surface behind the photograph while it loads. */
const tones: Record<ImageTone, string> = {
  // Default: the cool end of the cream scale
  neutral: "bg-surface-2",
  // Cream with a soft accent wash
  warm: "bg-surface-warm",
  // Plum, for frames that carry light text on top (the hero slides)
  dark: "bg-primary",
};

type ImageFrameProps = {
  /** The photograph. Leave out to show the placeholder. */
  image?: ImageAsset;
  /** Alt text the photograph will carry. A real image uses its own `alt`. */
  alt: string;
  /** Placeholder caption (previews only), e.g. "Our work · Nails". Defaults to `alt`. */
  placeholder?: string;
  /** Tailwind aspect-ratio utility, e.g. "aspect-[4/5]". */
  ratio: string;
  /** Kept for callers; the placeholder fits any shape. */
  orientation?: "portrait" | "landscape";
  /** next/image `sizes`: how wide the frame renders at each breakpoint. */
  sizes: string;
  /** Above the fold (heroes): load eagerly at high fetch priority. */
  priority?: boolean;
  tone?: ImageTone;
  className?: string;
  /** Overlays rendered above the image (captions, badges). */
  children?: React.ReactNode;
  /** Slow, slight zoom when an ancestor `group` is hovered. Hover devices
      only, and never under reduced motion. */
  zoomOnHover?: boolean;
  /** Extra classes on the photograph itself (the hero's Ken Burns). */
  imageClassName?: string;
  /** Full-bleed: no rounding and no inset hairline (the hero). */
  bleed?: boolean;
};

export function ImageFrame({
  image,
  alt,
  placeholder,
  ratio,
  sizes,
  priority = false,
  tone = "neutral",
  className = "",
  children,
  zoomOnHover = false,
  imageClassName = "",
  bleed = false,
}: ImageFrameProps) {
  if (image && /\.svg($|[?#])/i.test(image.src)) {
    throw new Error(
      `ImageFrame: "${image.src}" is an SVG. SVGs must not go through next/image; inline them as components instead.`,
    );
  }

  const zoom = zoomOnHover
    ? "motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out-soft [@media(hover:hover)]:motion-safe:group-hover:scale-[1.04]"
    : "";

  return (
    <div
      className={[
        "relative isolate w-full overflow-hidden",
        bleed ? "" : "rounded-card",
        tones[tone],
        ratio,
        className,
      ].join(" ")}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          // `priority` is deprecated in Next 16; eager + high fetch priority
          // is the recommended way to load an above-the-fold image first.
          loading={priority ? "eager" : undefined}
          fetchPriority={priority ? "high" : undefined}
          className={["object-cover", zoom, imageClassName].join(" ")}
        />
      ) : (
        <ImagePlaceholder caption={placeholder ?? alt} tone={tone} markClassName={zoom} />
      )}

      {/* Inset hairline frame */}
      {bleed ? null : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 rounded-inset border border-primary/10"
        />
      )}

      {children}

      {image && isTemporary(image) && !isProductionSite ? (
        <span
          aria-hidden="true"
          title={image.source === "stock-temp" ? "Stock photo (Unsplash), to be replaced" : "Instagram photo, to be replaced"}
          className="pointer-events-none absolute top-2 left-2 z-10 whitespace-nowrap rounded-chip bg-foreground/80 px-2 py-0.5 text-label-sm uppercase text-on-primary sm:top-4 sm:left-4 sm:px-2.5 sm:py-1"
        >
          Temp image
        </span>
      ) : null}
    </div>
  );
}

/** Stand-ins until the photoshoot: badged on previews, blocked in production by check:images. */
function isTemporary(image: ImageAsset): boolean {
  return image.source === "stock-temp" || image.source === "instagram-temp";
}
