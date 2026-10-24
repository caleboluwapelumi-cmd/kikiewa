import { Confirmable } from "@/components/Confirmable";
import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { credibility, credibilityIntro, hasConfirmed } from "@/data/site";

/**
 * Assurance standards, set as a ruled register rather than cards: a
 * governance list should read like a document, not an offer.
 * Renders nothing until at least one detail is confirmed.
 */
export function CredibilityStrip() {
  if (!hasConfirmed(credibility.map((item) => item.detail))) return null;

  return (
    <section className="section-y w-full border-y border-border bg-surface">
      <div className="shell">
        <SectionHeading
          eyebrow={credibilityIntro.eyebrow}
          heading={credibilityIntro.heading}
          className="mb-space-2xl"
        />

        <ul className="grid grid-cols-1 border-t border-border-strong md:grid-cols-2 lg:grid-cols-4">
          {credibility.map((item) => (
            <li
              key={item.title}
              className="flex flex-col border-b border-border py-space-lg md:px-space-lg md:odd:border-r md:odd:pl-0 lg:border-b-0 lg:border-r lg:py-space-xl lg:first:pl-0 lg:last:border-r-0 lg:[&:nth-child(3)]:pl-space-lg"
            >
              <div className="flex items-center justify-between text-secondary">
                <span className="text-label-sm uppercase">{item.standard}</span>
                <Icon name={item.icon} className="size-5" />
              </div>
              <h3 className="mt-space-lg text-title-lg text-primary">{item.title}</h3>
              <p className="mt-space-sm text-pretty text-body-sm text-muted">
                {item.body}
              </p>
              <p className="mt-space-md flex flex-wrap items-baseline gap-x-space-sm gap-y-space-xs border-t border-border pt-space-sm text-label-sm uppercase text-foreground">
                {item.detailLabel}
                <Confirmable value={item.detail} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
