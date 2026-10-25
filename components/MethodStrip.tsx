import Link from "next/link";
import { Icon } from "@/components/Icon";
import { howWeWork, servicePage } from "@/data/site";

/**
 * The method in one line ("Listen. Tailor. Solve. Bring your beauty out."),
 * linking to the full "How we work" section on /about. Sits above "What to
 * expect" on every service page.
 */
export function MethodStrip() {
  return (
    <Link
      href={howWeWork.href}
      className="group flex flex-col gap-space-sm border-y border-border-strong py-space-md sm:flex-row sm:items-center sm:justify-between sm:gap-space-lg"
    >
      <span className="font-display text-headline-sm text-primary transition-colors duration-200 group-hover:text-secondary">
        {servicePage.methodStrip}
      </span>
      <span className="inline-flex shrink-0 items-center gap-space-sm text-label-sm uppercase text-secondary">
        {servicePage.methodStripLink}
        <Icon
          name="arrowRight"
          className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
