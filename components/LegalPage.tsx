import { TbcLabel } from "@/components/Confirmable";
import { PageIntro } from "@/components/PageIntro";
import { isTBC, legalPages, type PolicyPage } from "@/data/site";
import { isProductionSite } from "@/lib/env";

/**
 * Booking policy and privacy (site plan, section 7: headings only, content
 * from the client). Nothing is drafted here. A section waiting for its text
 * shows "To be supplied" on previews; in production that block is left out,
 * and the page is noindex until every section is filled (policyIsPending).
 */

export function policyIsPending(page: PolicyPage): boolean {
  return page.sections.some((section) => isTBC(section.paragraphs));
}

export function LegalPage({ page }: { page: PolicyPage }) {
  const pending = policyIsPending(page);
  return (
    <>
      <PageIntro copy={page.intro}>
        {pending ? <TbcLabel className="normal-case tracking-normal">{legalPages.pending}</TbcLabel> : null}
      </PageIntro>
      <section className="w-full border-t border-border bg-background pt-space-2xl pb-space-3xl">
        <div className="shell">
          <div className="max-w-[72ch] divide-y divide-border border-y border-border-strong">
            {page.sections.map((section) => (
              <section key={section.heading} className="py-space-lg md:py-space-xl">
                <h2 className="text-headline-sm text-primary">{section.heading}</h2>
                {isTBC(section.paragraphs) ? (
                  isProductionSite ? null : (
                    <p className="mt-space-sm">
                      <TbcLabel>{legalPages.toBeSupplied}</TbcLabel>
                    </p>
                  )
                ) : (
                  <div className="mt-space-sm flex flex-col gap-space-md">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-pretty text-body-md text-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
