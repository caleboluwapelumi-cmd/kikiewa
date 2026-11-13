"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { Lightbox, useLightbox } from "@/components/gallery/Lightbox";
import { galleryPage, type GalleryCategory, type GalleryItem } from "@/data/site";

/**
 * /gallery (site plan, section 7).
 *
 * - Every shoot photo, grouped in filter order (lib/photos.ts). Filters
 *   (services, Academy, Branches) are links (?service=nails), so a filtered
 *   view can be shared; the page's canonical stays /gallery. Only filters
 *   with photographs show; uncategorised photos show under All.
 * - Asymmetric grid: a repeating rhythm of tall, wide and square tiles.
 *   The first row loads eagerly, the rest lazily.
 * - Each tile opens the shared lightbox (components/gallery/Lightbox.tsx).
 */

type Filter = { slug: GalleryCategory; label: string };

type GalleryProps = { items: GalleryItem[]; filters: Filter[] };

/** Reads ?service= (client only: the static page renders "All"). */
export function GalleryBrowser(props: GalleryProps) {
  const active = useSearchParams().get("service");
  return <GalleryView {...props} active={active} />;
}

/** Tile shape by position: tall, square, square, wide, square, square… */
function tileShape(index: number): string {
  switch (index % 6) {
    case 0:
      return "row-span-2";
    case 3:
      return "col-span-2";
    default:
      return "";
  }
}

/** Row-one tiles on a three-column grid load eagerly. */
const EAGER_COUNT = 3;

export function GalleryView({ items, filters, active }: GalleryProps & { active: string | null }) {
  const available = filters.filter((filter) => items.some((item) => item.category === filter.slug));
  const current = available.find((filter) => filter.slug === active) ?? null;
  const unknownFilter = active !== null && !current;
  const shown = current ? items.filter((item) => item.category === current.slug) : unknownFilter ? [] : items;

  const lightbox = useLightbox(shown.length);

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
      <nav aria-label={galleryPage.filtersLabel} className="mb-space-xl flex flex-wrap gap-2">
        {filterLink("/gallery", galleryPage.all, !current && !unknownFilter)}
        {available.map((filter) => filterLink("/gallery?service=" + filter.slug, filter.label, current?.slug === filter.slug))}
      </nav>

      {shown.length === 0 ? (
        <div className="flex flex-col items-start gap-space-md border-t border-border py-space-xl">
          <p className="text-body-lg text-muted">{galleryPage.filterEmpty}</p>
          <Button href="/gallery" variant="secondary">
            {galleryPage.seeAll}
          </Button>
        </div>
      ) : (
        // No data-reveal-stagger: Suspense swaps this list in after the
        // reveal script has run, so it would never be revealed. The section
        // around it fades in instead (components/RevealOnScroll.tsx).
        <ul className="grid grid-flow-dense auto-rows-[44vw] grid-cols-2 gap-space-sm md:auto-rows-[30vw] md:gap-gutter lg:auto-rows-[20rem] lg:grid-cols-3">
          {shown.map((item, index) => (
            <li key={item.src} className={tileShape(index)}>
              <button
                ref={lightbox.trigger(index)}
                type="button"
                aria-haspopup="dialog"
                onClick={() => lightbox.show(index)}
                className="group relative block size-full rounded-card text-left"
              >
                <span className="sr-only">
                  {galleryPage.viewLarger}: {item.alt}
                </span>
                <ImageFrame
                  image={item}
                  alt={item.alt}
                  ratio="h-full"
                  priority={index < EAGER_COUNT}
                  zoomOnHover
                  sizes={tileShape(index) === "col-span-2" ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 50vw, 33vw"}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox state={lightbox} photos={shown} />
    </>
  );
}
