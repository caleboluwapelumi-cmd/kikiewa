import { markMono } from "@/components/brand/paths";

/**
 * The peacock mark, small and centred between two fine hairlines. Purely
 * decorative (aria-hidden); drawn in currentColor, the accent by default.
 *
 * Use it at most once per page, and never on the clinical medical spa pages:
 * the competitor study calls for no decorative flourishes there.
 */
export function PeacockDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-peacock-divider=""
      className={["flex items-center justify-center gap-space-md text-accent", className].join(" ")}
    >
      <span className="h-px w-12 bg-current opacity-50 md:w-20" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={markMono.viewBox}
        focusable="false"
        className="h-8 w-auto"
      >
        {markMono.paths.map((d, index) => (
          <path key={index} d={d} fill="currentColor" fillRule="evenodd" />
        ))}
      </svg>
      <span className="h-px w-12 bg-current opacity-50 md:w-20" />
    </div>
  );
}
