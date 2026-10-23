type SectionHeadingProps = {
  eyebrow: string;
  heading: string;
  body?: string;
  /** Heading level — sections use h2, the credibility strip h3, page titles h1. */
  as?: "h1" | "h2" | "h3";
  /** Display size of the heading. */
  size?: "lg" | "sm";
  align?: "start" | "center";
  /** Rendered to the right of the heading on desktop (divisions section). */
  aside?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  heading,
  body,
  as: Tag = "h2",
  size = "lg",
  align = "start",
  aside,
  className = "",
}: SectionHeadingProps) {
  const headingClass =
    size === "lg"
      ? "text-headline-lg-mobile lg:text-headline-lg text-primary"
      : "text-headline-sm text-primary";

  return (
    <div
      className={[
        "flex flex-col gap-space-md",
        aside ? "md:flex-row md:items-end md:justify-between" : "",
        align === "center" ? "items-center text-center" : "",
        className,
      ].join(" ")}
    >
      <div
        className={
          align === "center" ? "flex flex-col items-center" : "flex flex-col"
        }
      >
        <span className="mb-space-xs block text-label-sm uppercase text-secondary">
          {eyebrow}
        </span>
        <Tag className={headingClass}>{heading}</Tag>
        {body ? (
          <p
            className={[
              "mt-space-sm text-body-lg text-muted",
              align === "center" ? "" : "max-w-2xl",
            ].join(" ")}
          >
            {body}
          </p>
        ) : null}
      </div>

      {aside ? (
        <p className="text-body-md text-muted md:max-w-md">{aside}</p>
      ) : null}
    </div>
  );
}
