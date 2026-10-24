import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { concernHref, concerns, medicalSpa } from "@/data/site";

/**
 * Concerns as a hairline grid of cards, each leading to its own page
 * (/medical-spa/concerns/[concern]). Only concerns present in data render.
 * Concerns don't link to treatments yet: suitability is decided at
 * consultation.
 *
 * The concern name is the link; it stretches over the whole card, so the
 * card is one target with a short accessible name.
 */
type ConcernCardsProps = {
  id?: string;
  /** Show the section heading. Off on /medical-spa/concerns, where the page h1 leads. */
  withHeading?: boolean;
};

export function ConcernCards({ id, withHeading = true }: ConcernCardsProps) {
  if (concerns.length === 0) return null;
  const { concernsIntro } = medicalSpa;
  const Title = withHeading ? "h3" : "h2";

  return (
    <section id={id} className="section-y w-full border-t border-border bg-background">
      <div className="shell">
        {withHeading ? (
          <SectionHeading
            eyebrow={concernsIntro.eyebrow}
            heading={concernsIntro.heading}
            body={concernsIntro.body}
            className="mb-space-2xl"
          />
        ) : null}

        {/* 1px gaps over the rule colour draw the grid lines */}
        <ul className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {concerns.map((concern, index) => (
            <li
              key={concern.slug}
              className="group relative flex flex-col bg-card p-space-lg transition-colors duration-300 ease-out-soft hover:bg-background md:p-8 lg:p-10"
            >
              <span className="text-label-sm tabular-nums text-secondary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Title className="mt-space-md text-headline-sm text-primary md:mt-space-xl">
                <Link
                  href={concernHref(concern)}
                  className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-secondary"
                >
                  {concern.name}
                </Link>
              </Title>
              <p className="mt-space-sm mb-space-lg max-w-[40ch] text-pretty text-body-md text-muted">
                {concern.summary}
              </p>
              <span
                aria-hidden="true"
                className="mt-auto inline-flex items-center gap-space-sm text-label-md uppercase text-primary group-hover:text-secondary"
              >
                {concernsIntro.cardLink}
                <Icon
                  name="arrowRight"
                  className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
