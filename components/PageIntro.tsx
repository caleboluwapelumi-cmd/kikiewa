import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeading } from "@/components/SectionHeading";
import type { NavLink, PageCopy } from "@/data/site";

/**
 * Opening section for secondary pages: eyebrow, the page's h1 and a
 * standfirst, with optional actions underneath. Nested pages pass their
 * breadcrumb trail (current page last), shown above the heading.
 */
type PageIntroProps = {
  copy: Pick<PageCopy, "eyebrow" | "heading" | "body">;
  breadcrumbs?: NavLink[];
  children?: React.ReactNode;
  className?: string;
};

export function PageIntro({ copy, breadcrumbs, children, className = "" }: PageIntroProps) {
  return (
    <section
      className={[
        "w-full bg-background pb-space-2xl lg:pb-space-3xl",
        // With breadcrumbs the trail takes the top spacing
        breadcrumbs ? "pt-space-lg md:pt-space-xl" : "pt-space-2xl md:pt-space-3xl lg:pt-28",
        className,
      ].join(" ")}
    >
      <div className="shell">
        {breadcrumbs ? (
          <Breadcrumbs trail={breadcrumbs} className="mb-space-xl lg:mb-space-2xl" />
        ) : null}
        <SectionHeading
          eyebrow={copy.eyebrow}
          heading={copy.heading}
          body={copy.body}
          as="h1"
          size="xl"
        />
        {children ? <div className="mt-space-xl">{children}</div> : null}
      </div>
    </section>
  );
}
