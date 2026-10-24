import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import type { FaqItem } from "@/data/site";
import { answeredFaqs, faqJsonLd } from "@/lib/jsonld";

/**
 * Questions as native <details> rows between hairlines: keyboard and
 * screen-reader support come with the element. Questions whose answer is
 * TBC are left out, and the FAQPage JSON-LD lists exactly the questions
 * rendered here.
 */
type FaqProps = {
  id?: string;
  eyebrow?: string;
  heading: string;
  items: FaqItem[];
};

export function Faq({ id, eyebrow, heading, items }: FaqProps) {
  const answered = answeredFaqs(items);
  const jsonLd = faqJsonLd(items);
  if (answered.length === 0) return null;

  return (
    <section id={id} className="section-y w-full border-t border-border bg-background">
      {jsonLd ? <JsonLd data={jsonLd} /> : null}
      <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
        <SectionHeading eyebrow={eyebrow} heading={heading} className="lg:col-span-4" />

        <div className="border-t border-border-strong lg:col-span-8">
          {answered.map((item) => (
            <details key={item.question} className="group border-b border-border">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-space-lg py-space-lg text-title-lg text-foreground transition-colors duration-200 hover:text-primary [&::-webkit-details-marker]:hidden">
                {item.question}
                {/* Plus that becomes a minus when open */}
                <span aria-hidden="true" className="relative mt-2 size-3 shrink-0 text-secondary">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-out-soft group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-[60ch] pb-space-lg text-pretty text-body-md text-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
