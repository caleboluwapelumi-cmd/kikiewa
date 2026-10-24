import { SectionHeading } from "@/components/SectionHeading";
import type { PageCopy } from "@/data/site";

/**
 * Opening section for secondary pages: eyebrow, the page's h1 and a
 * standfirst, with optional actions underneath.
 */
type PageIntroProps = {
  copy: Pick<PageCopy, "eyebrow" | "heading" | "body">;
  children?: React.ReactNode;
  className?: string;
};

export function PageIntro({ copy, children, className = "" }: PageIntroProps) {
  return (
    <section
      className={[
        "w-full bg-background pt-space-2xl pb-space-2xl md:pt-space-3xl lg:pt-28 lg:pb-space-3xl",
        className,
      ].join(" ")}
    >
      <div className="shell">
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
