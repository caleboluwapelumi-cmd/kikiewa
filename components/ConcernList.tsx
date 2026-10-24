import { Button } from "@/components/Button";
import { concerns } from "@/data/site";

/**
 * Concerns, set as a ruled register. Each one leads to a consultation rather
 * than to a named treatment: suitability is decided in person.
 */
export function ConcernList() {
  return (
    <section className="section-y w-full border-t border-border bg-background">
      <div className="shell">
        <ul className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2">
          {concerns.map((concern) => (
            <li
              key={concern.slug}
              id={concern.slug}
              className="flex flex-col bg-card p-space-lg md:p-10"
            >
              <h2 className="text-headline-sm text-primary">{concern.name}</h2>
              <p className="mt-space-sm mb-space-lg max-w-[48ch] text-pretty text-body-md text-muted">
                {concern.summary}
              </p>
              <Button
                href="/book?service=consultation"
                variant="quiet"
                icon="arrowRight"
                className="mt-auto self-start"
              >
                Book a consultation
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
