import Image from "next/image";
import type { ImageAsset } from "@/data/site";
import { isProductionSite } from "@/lib/env";

/**
 * Photography frame.
 *
 * - With an `image` (an ImageAsset from data/site.ts): renders it through
 *   next/image, filling the frame at the given aspect ratio, with `sizes`
 *   so the browser picks the right width.
 * - Without one: a quiet placeholder, a hairline arch drawn inline, labelled
 *   "Image to be supplied". The `alt` text is already the real one.
 *
 * SVGs never go through next/image (and images.dangerouslyAllowSVG stays
 * off): an ImageAsset pointing at an .svg fails loudly instead.
 *
 * Every frame carries an inset hairline, so placeholders and real photographs
 * share the same finished edge.
 *
 * Temporary images (source "stock-temp" or "instagram-temp") carry a small
 * "Temp image" badge on previews, so nobody mistakes them for final. The
 * badge never renders in production, where check:images blocks them anyway.
 */

export type ImageTone = "neutral" | "warm" | "dark";

/** Surface behind the placeholder drawing. */
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
  /** Alt text for the placeholder. A real image uses its own `alt`. */
  alt: string;
  /** Tailwind aspect-ratio utility, e.g. "aspect-[4/5]". */
  ratio: string;
  orientation?: "portrait" | "landscape";
  /** next/image `sizes`: how wide the frame renders at each breakpoint. */
  sizes: string;
  /** Above the fold (heroes): load eagerly at high fetch priority. */
  priority?: boolean;
  tone?: ImageTone;
  className?: string;
  /** Overlays rendered above the image (captions, badges). */
  children?: React.ReactNode;
  /** Slow, slight zoom when an ancestor `group` is hovered. */
  zoomOnHover?: boolean;
  /** Full-bleed: no rounding and no inset hairline (the hero). */
  bleed?: boolean;
};

export function ImageFrame({
  image,
  alt,
  ratio,
  orientation = "landscape",
  sizes,
  priority = false,
  tone = "neutral",
  className = "",
  children,
  zoomOnHover = false,
  bleed = false,
}: ImageFrameProps) {
  const dark = tone === "dark";
  if (image && /\.svg($|[?#])/i.test(image.src)) {
    throw new Error(
      `ImageFrame: "${image.src}" is an SVG. SVGs must not go through next/image; inline them as components instead.`,
    );
  }

  const zoom = zoomOnHover
    ? "transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
    : "";

  return (
    <div
      className={[
        "relative w-full overflow-hidden",
        bleed ? "" : "rounded-xs",
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
          className={["object-cover", zoom].join(" ")}
        />
      ) : (
        <>
          <PlaceholderArch
            orientation={orientation}
            alt={alt}
            className={["absolute inset-0 size-full", dark ? "stroke-on-primary" : "stroke-primary", zoom].join(" ")}
          />
          <span
            className={[
              "absolute inset-x-6 top-6 flex items-start justify-end gap-2 text-right text-label-sm uppercase md:inset-x-7 md:top-7",
              dark ? "text-on-primary/75" : "text-muted",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className={["mt-[0.4rem] inline-block h-px w-4 shrink-0", dark ? "bg-on-primary/50" : "bg-muted/60"].join(" ")}
            />
            Image to be supplied
          </span>
        </>
      )}

      {/* Inset hairline frame */}
      {bleed ? null : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 border border-primary/10 md:inset-4"
        />
      )}

      {children}

      {image && isTemporary(image) && !isProductionSite ? (
        <span
          aria-hidden="true"
          title={image.source === "stock-temp" ? "Stock photo (Unsplash), to be replaced" : "Instagram photo, to be replaced"}
          className="pointer-events-none absolute top-1.5 left-1.5 z-10 whitespace-nowrap bg-foreground/80 px-1.5 py-0.5 text-label-sm uppercase text-on-primary sm:top-3 sm:left-3 sm:px-2 sm:py-1 md:top-4 md:left-4"
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

/**
 * The placeholder drawing: a hairline arch and floor line in the primary
 * colour at low opacity, cropped like object-cover. Carries the alt text so
 * the frame still describes the photograph it is waiting for.
 */
function PlaceholderArch({
  orientation,
  alt,
  className,
}: {
  orientation: "portrait" | "landscape";
  alt: string;
  className: string;
}) {
  const portrait = orientation === "portrait";
  return (
    <svg
      viewBox={portrait ? "0 0 800 1000" : "0 0 800 550"}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt}
      className={["fill-none", className].join(" ")}
      strokeWidth={1.25}
    >
      {portrait ? (
        <>
          <path d="M270 780V420a130 130 0 0 1 260 0v360" opacity={0.22} vectorEffect="non-scaling-stroke" />
          <path d="M292 780V420a108 108 0 0 1 216 0v360" opacity={0.12} vectorEffect="non-scaling-stroke" />
          <path d="M0 780h800" opacity={0.14} vectorEffect="non-scaling-stroke" />
        </>
      ) : (
        <>
          <path d="M330 420V260a70 70 0 0 1 140 0v160" opacity={0.22} vectorEffect="non-scaling-stroke" />
          <path d="M344 420V260a56 56 0 0 1 112 0v160" opacity={0.12} vectorEffect="non-scaling-stroke" />
          <path d="M0 420h800" opacity={0.14} vectorEffect="non-scaling-stroke" />
        </>
      )}
    </svg>
  );
}
