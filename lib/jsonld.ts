import { isTBC, site, type FaqItem, type NavLink } from "@/data/site";

/**
 * Structured data builders (reference/seo-plan.md, section 4). Only verified
 * fields go in: anything TBC is left out, never filled in.
 */

type JsonLdObject = Record<string, unknown>;

function absolute(href: string): string {
  return href === "/" ? site.url : site.url + href;
}

/** BreadcrumbList for a trail of links, the current page last. */
export function breadcrumbJsonLd(trail: NavLink[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((link, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: link.label,
      item: absolute(link.href),
    })),
  };
}

/** Questions that render on the page: those with a confirmed answer. */
export function answeredFaqs(items: FaqItem[]): { question: string; answer: string }[] {
  return items.flatMap((item) =>
    isTBC(item.answer) ? [] : [{ question: item.question, answer: item.answer }],
  );
}

/** FAQPage for the questions actually rendered. Null when there are none. */
export function faqJsonLd(items: FaqItem[]): JsonLdObject | null {
  const answered = answeredFaqs(items);
  if (answered.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: answered.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
