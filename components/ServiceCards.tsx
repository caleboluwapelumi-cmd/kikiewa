import Link from "next/link";
import { ImageFrame } from "@/components/ImageFrame";
import { Tag } from "@/components/Tag";
import { serviceCategories, servicePage } from "@/data/site";

/**
 * The six service cards: image, name, one line. Used by Home "What we do"
 * and the /services hub. The whole card is the link (the name's ::after
 * covers it), so each card has one link, named by its title. The focus ring
 * is drawn on the stretched ::after so it outlines the whole card.
 *
 * Home: a swipe row on phones (one card and a peek of the next), a grid
 * from md. The hub stacks them, large, at every width.
 *
 * `large` (the hub): two to a row from lg, with bigger photographs, a
 * number and the "Consultation required" tag on consultation-led services.
 */
type ServiceCardsProps = {
  /** h3 under a section heading (Home), h2 when the page H1 is above (hub). */
  titleAs?: "h2" | "h3";
  large?: boolean;
};

export function ServiceCards({ titleAs: Title = "h3", large = false }: ServiceCardsProps) {
  return (
    <ul
      data-reveal-stagger
      className={
        large
          ? "grid grid-cols-1 gap-x-gutter gap-y-space-2xl sm:grid-cols-2 lg:gap-x-gutter-desktop lg:gap-y-space-3xl"
          : "scroll-row md:scroll-row-off md:grid-cols-2 md:gap-x-gutter md:gap-y-space-xl lg:grid-cols-3 lg:gap-x-gutter-desktop lg:gap-y-space-2xl"
      }
    >
      {serviceCategories.map((category, index) => (
        <li key={category.slug} className="group relative flex flex-col">
          <ImageFrame
            image={category.image.image}
            alt={category.image.alt}
            ratio={large ? "aspect-[4/3] sm:aspect-[4/5] lg:aspect-[5/4]" : "aspect-[4/5] md:aspect-[5/6]"}
            orientation={large ? "landscape" : "portrait"}
            tone={category.consultationLed ? "neutral" : "warm"}
            sizes={
              large
                ? "(max-width: 640px) 100vw, (max-width: 1360px) 50vw, 600px"
                : "(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
            }
            zoomOnHover
          />
          {large ? (
            <p className="mt-space-lg flex min-h-7 items-center justify-between gap-space-md text-label-sm uppercase tabular-nums text-muted">
              <span>
                <span className="sr-only">Service </span>
                {String(index + 1).padStart(2, "0")}
              </span>
              {category.consultationLed ? <Tag label={servicePage.consultationTag} /> : null}
            </p>
          ) : null}
          <Title
            className={[
              "text-primary",
              large ? "mt-space-sm text-headline-lg lg:text-headline-md" : "mt-space-lg text-headline-sm",
            ].join(" ")}
          >
            <Link
              href={category.href}
              className="transition-colors duration-200 after:absolute after:inset-0 after:rounded-card group-hover:text-secondary focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-secondary"
            >
              {category.name}
            </Link>
          </Title>
          <p
            className={[
              "mt-space-xs text-muted",
              large ? "max-w-[44ch] text-body-lg" : "max-w-[38ch] text-body-md",
            ].join(" ")}
          >
            {category.cardLine}
          </p>
        </li>
      ))}
    </ul>
  );
}
