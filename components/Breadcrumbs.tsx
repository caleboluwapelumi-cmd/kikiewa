import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import type { NavLink } from "@/data/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

/**
 * Visible breadcrumb trail plus its BreadcrumbList JSON-LD. The last item
 * is the current page: plain text, marked aria-current.
 */
export function Breadcrumbs({ trail, className = "" }: { trail: NavLink[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <ol className="flex flex-wrap items-center gap-x-space-sm text-label-sm uppercase text-muted">
        {trail.map((link, index) => {
          const current = index === trail.length - 1;
          return (
            <li key={link.href} className="flex items-center gap-x-space-sm">
              {current ? (
                <span aria-current="page" className="text-foreground">
                  {link.label}
                </span>
              ) : (
                <>
                  <Link href={link.href} className="link-touch hover:text-primary">
                    {link.label}
                  </Link>
                  <span aria-hidden="true" className="inline-block h-px w-3 bg-border-strong" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
