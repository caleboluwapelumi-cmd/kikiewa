import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ImageFrame } from "@/components/ImageFrame";
import { serviceCategories } from "@/data/site";

/**
 * The six service cards: image, name, one line. Used by Home "What we do"
 * and the /services hub. The whole card is the link (the name's ::after
 * covers it), so each card has one link, named by its title. The focus ring
 * is drawn on the stretched ::after so it outlines the whole card.
 */
type ServiceCardsProps = {
  /** h3 under a section heading (Home), h2 when the page H1 is above (hub). */
  titleAs?: "h2" | "h3";
  large?: boolean;
};

export function ServiceCards({ titleAs: Title = "h3", large = false }: ServiceCardsProps) {
  return (
    <ul className="grid grid-cols-1 gap-x-gutter gap-y-space-xl sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-gutter-desktop lg:gap-y-space-2xl">
      {serviceCategories.map((category) => (
        <li key={category.slug} className="group relative flex flex-col">
          <ImageFrame
            image={category.image.image}
            alt={category.image.alt}
            ratio={large ? "aspect-[4/3] sm:aspect-[4/5]" : "aspect-[4/3] sm:aspect-[5/6]"}
            orientation="portrait"
            tone="warm"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            zoomOnHover
          />
          <Title className="mt-space-lg text-headline-sm text-primary">
            <Link
              href={category.href}
              className="flex items-center justify-between gap-space-md transition-colors duration-200 after:absolute after:inset-0 group-hover:text-secondary focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-secondary"
            >
              {category.name}
              <Icon
                name="arrowRight"
                className="size-4 shrink-0 text-secondary transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
              />
            </Link>
          </Title>
          <p className="mt-space-xs max-w-[38ch] text-pretty text-body-md text-muted">
            {category.cardLine}
          </p>
        </li>
      ))}
    </ul>
  );
}
