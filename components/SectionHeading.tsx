type SectionHeadingProps = {
  eyebrow: string;
  heading: string;
  body?: string;
  /** Heading level — sections use h2, page titles h1. */
  as?: "h1" | "h2" | "h3";
  /** Display size of the heading. */
  size?: "xl" | "lg" | "sm";
  align?: "start" | "center";
  /** Light surfaces by default; "dark" for text on the plum bands. */
  tone?: "light" | "dark";
  /** Rendered to the right of the heading on desktop (divisions section). */
  aside?: string;
  className?: string;
};

/**
 * Eyebrow, heading and optional standfirst. The short accent hairline before
 * the eyebrow is the one recurring signature across all three divisions.
 */
export function SectionHeading({
  eyebrow,
  heading,
  body,
  as: Tag = "h2",
  size = "lg",
  align = "start",
  tone = "light",
  aside,
  className = "",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  const centered = align === "center";

  const headingClass = [
    size === "xl"
      ? "text-display-hero-mobile lg:text-display-hero"
      : size === "lg"
        ? "text-headline-lg-mobile lg:text-headline-lg"
        : "text-headline-md",
    "text-balance",
    dark ? "text-on-primary" : "text-primary",
  ].join(" ");

  return (
    <div
      className={[
        "flex flex-col gap-space-lg",
        aside ? "md:flex-row md:items-end md:justify-between md:gap-gutter-desktop" : "",
        centered ? "items-center text-center" : "",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "flex flex-col",
          centered ? "items-center" : "",
          aside ? "md:max-w-2xl" : "",
        ].join(" ")}
      >
        <span
          className={[
            "mb-space-md flex items-center gap-3 text-label-sm uppercase",
            dark ? "text-on-primary/75" : "text-secondary",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={[
              "inline-block h-px w-8 shrink-0",
              dark ? "bg-on-primary/40" : "bg-accent",
            ].join(" ")}
          />
          {eyebrow}
        </span>
        <Tag className={headingClass}>{heading}</Tag>
        {body ? (
          <p
            className={[
              "mt-space-md max-w-[60ch] text-pretty text-body-lg",
              dark ? "text-on-primary/80" : "text-muted",
            ].join(" ")}
          >
            {body}
          </p>
        ) : null}
      </div>

      {aside ? (
        <p className="max-w-md text-pretty text-body-md text-muted md:pb-1">
          {aside}
        </p>
      ) : null}
    </div>
  );
}
