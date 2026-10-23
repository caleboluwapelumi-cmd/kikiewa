import Image from "next/image";

/**
 * Photography frame.
 *
 * The design calls for commissioned photography that does not exist yet, so
 * each frame holds a neutral local placeholder at the correct aspect ratio
 * and says so on the page. Swap `src` for the real asset and drop `pending`
 * once photography lands — the alt text is already the real one.
 */

type ImageFrameProps = {
  alt: string;
  /** Tailwind aspect-ratio utility, e.g. "aspect-[4/5]". */
  ratio: string;
  orientation?: "portrait" | "landscape";
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Overlays rendered above the image (captions, badges). */
  children?: React.ReactNode;
  zoomOnHover?: boolean;
};

export function ImageFrame({
  alt,
  ratio,
  orientation = "landscape",
  sizes,
  priority = false,
  className = "",
  children,
  zoomOnHover = false,
}: ImageFrameProps) {
  return (
    <div
      className={[
        "relative w-full overflow-hidden rounded-xs bg-surface",
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
            ? "transition-transform duration-700 group-hover:scale-105"
            : "",
        ].join(" ")}
      />
      <span className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center">
        <span className="rounded-xs bg-card/85 px-space-sm py-space-xs text-label-sm uppercase text-muted">
          Image to be supplied
        </span>
      </span>
      {children}
    </div>
  );
}
