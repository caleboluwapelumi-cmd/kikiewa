import { brandPromise } from "@/data/site";

/**
 * The promise, straight after the hero: one large serif statement, then the
 * three promises in short columns under fine accent rules.
 */
export function BrandPromise() {
  const { heading, statement, pillars } = brandPromise;

  return (
    <section
      aria-labelledby="promise-heading"
      className="section-y w-full border-y border-border bg-surface"
    >
      <div className="shell">
        <h2 id="promise-heading" className="sr-only">
          {heading}
        </h2>
        <p className="max-w-[24em] text-pretty font-display text-headline-lg-mobile text-primary lg:text-headline-lg">
          {statement}
        </p>

        <ul className="mt-space-2xl grid grid-cols-1 gap-space-xl md:grid-cols-3 md:gap-gutter-desktop lg:mt-space-3xl">
          {pillars.map((pillar, index) => (
            <li key={pillar.title} className="flex flex-col border-t border-accent pt-space-lg">
              <span aria-hidden="true" className="text-label-sm uppercase tabular-nums text-secondary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-space-md text-headline-sm text-primary">{pillar.title}</h3>
              <p className="mt-space-sm max-w-[36ch] text-pretty text-body-md text-muted">
                {pillar.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
