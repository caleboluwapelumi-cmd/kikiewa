"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/shop/ProductCard";
import { shopHref, shopPage, type Product } from "@/data/site";
import { categorySlug, productCategories } from "@/lib/shop";

/**
 * The /shop grid with its category filter. Filters are links
 * (?category=skincare), so a filtered view can be shared; the canonical
 * stays /shop. They are built from the products present, and show only
 * when there is more than one category.
 */
export function ShopBrowser({ items }: { items: Product[] }) {
  const active = useSearchParams().get("category");
  return <ShopView items={items} active={active} />;
}

/** The static render (and Suspense fallback) passes `active={null}`: everything. */
export function ShopView({ items, active }: { items: Product[]; active: string | null }) {
  const categories = productCategories(items);
  const current = categories.find((category) => category.slug === active) ?? null;
  const unknown = active !== null && !current;
  const shown = current ? items.filter((item) => categorySlug(item.category) === current.slug) : unknown ? [] : items;

  const filterLink = (href: string, label: string, isCurrent: boolean) => (
    <Link
      key={href}
      href={href}
      scroll={false}
      aria-current={isCurrent ? "page" : undefined}
      className={[
        "inline-flex min-h-12 items-center rounded-chip border px-5 text-body-sm font-semibold transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.97]",
        isCurrent
          ? "border-primary bg-primary text-on-primary"
          : "border-border-strong text-primary hover:border-primary hover:bg-surface",
      ].join(" ")}
    >
      {label}
    </Link>
  );

  return (
    <>
      {categories.length > 1 ? (
        <nav aria-label={shopPage.filtersLabel} className="mb-space-xl flex flex-wrap gap-2">
          {filterLink(shopHref, shopPage.all, !current && !unknown)}
          {categories.map((category) =>
            filterLink(`${shopHref}?category=${category.slug}`, category.label, current?.slug === category.slug),
          )}
        </nav>
      ) : null}

      {shown.length === 0 ? (
        <div className="flex flex-col items-start gap-space-md border-t border-border py-space-xl">
          <p className="text-body-lg text-muted">{shopPage.filterEmpty}</p>
          <Button href={shopHref} variant="secondary">
            {shopPage.seeAll}
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-x-gutter gap-y-space-2xl sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-gutter-desktop">
          {shown.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
