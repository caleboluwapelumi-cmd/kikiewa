import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { findServiceCategory, testimonialsSection, type Testimonial } from "@/data/site";
import { isProductionSite } from "@/lib/env";

/**
 * Quote cards (site plan, section 3.6): a swipe row on phones, with a peek
 * of the next card, and a grid from md. The row is focusable so it can be
 * scrolled from the keyboard.
 *
 * Only real testimonials, shared with permission. While there are none:
 * previews (NEXT_PUBLIC_SITE_ENV !== "production") show clearly labelled
 * placeholder cards, and production hides the section entirely.
 * Stars show only for Google reviews. No review schema until real reviews
 * are shown.
 */
type TestimonialsProps = {
  heading?: string;
  items: Testimonial[];
  /** Label on preview placeholder cards. */
  placeholder?: string;
  /** Section surface. */
  surface?: "background" | "surface";
};

export function Testimonials({
  heading = testimonialsSection.heading,
  items,
  placeholder = testimonialsSection.placeholder,
  surface = "background",
}: TestimonialsProps) {
  const placeholders = items.length === 0;
  if (placeholders && isProductionSite) return null;

  const cards = placeholders
    ? Array.from({ length: testimonialsSection.placeholderCount }, (_, index) => (
        <PlaceholderCard key={index} label={placeholder} />
      ))
    : items.map((item) => <QuoteCard key={item.name + item.quote.slice(0, 24)} item={item} />);
  const columns = cards.length >= 3 ? "lg:grid-cols-3" : "";

  return (
    <section
      className={[
        "section-y w-full border-t border-border",
        surface === "surface" ? "bg-surface" : "bg-background",
      ].join(" ")}
    >
      <div className="shell">
        <SectionHeading heading={heading} className="mb-space-xl md:mb-space-2xl" />
        <ul
          tabIndex={0}
          aria-label={testimonialsSection.label}
          data-reveal-stagger
          className={["scroll-row md:scroll-row-off md:grid-cols-2 md:gap-gutter lg:gap-gutter-desktop", columns].join(" ")}
        >
          {cards.map((card) => (
            <li key={card.key} className="flex">
              {card}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function QuoteCard({ item }: { item: Testimonial }) {
  const stars = item.source === "google" && item.rating ? item.rating : null;
  return (
    <figure className="flex w-full flex-col rounded-card border border-border bg-card p-space-lg md:p-8">
      {stars ? (
        <p className="mb-space-md flex gap-1 text-secondary">
          <span className="sr-only">Rated {stars} out of 5 on Google</span>
          {Array.from({ length: stars }, (_, index) => (
            <Icon key={index} name="star" className="size-4 fill-current" />
          ))}
        </p>
      ) : null}
      <blockquote className="font-display text-lead text-foreground">
        <p>{item.quote}</p>
      </blockquote>
      <figcaption className="mt-auto pt-space-lg text-label-sm uppercase text-muted">
        {item.name}
        {item.service ? <span> · {findServiceCategory(item.service).name}</span> : null}
      </figcaption>
    </figure>
  );
}

function PlaceholderCard({ label }: { label: string }) {
  return (
    <figure className="flex min-h-48 w-full flex-col justify-center rounded-card border border-dashed border-border-strong bg-card p-space-lg md:min-h-56 md:p-8">
      <p className="flex items-center gap-3 text-label-md uppercase text-muted">
        <span aria-hidden="true" className="inline-block h-px w-8 shrink-0 bg-border-strong" />
        {label}
      </p>
    </figure>
  );
}
