"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { ImageFrame } from "@/components/ImageFrame";
import { Icon } from "@/components/Icon";
import { galleryPage, type GalleryCategory, type GalleryItem } from "@/data/site";

/**
 * /gallery (site plan, section 7).
 *
 * - Filters are links (?service=nails), so a filtered view can be shared;
 *   the page's canonical stays /gallery. Only filters with photographs show.
 * - Asymmetric grid: a repeating rhythm of tall, wide and square tiles.
 *   The first row loads eagerly, the rest lazily.
 * - Each tile opens a native <dialog> lightbox: Escape closes it, the arrow
 *   keys move between photos, the caption is the photo's alt text, and
 *   focus returns to the tile of the photo last shown.
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

  const dialogRef = useRef<HTMLDialogElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState<number | null>(null);

  function show(index: number) {
    setOpen(index);
    dialogRef.current?.showModal();
  }

  function move(step: number) {
    setOpen((index) => (index === null ? index : (index + step + shown.length) % shown.length));
  }

  function handleClose() {
    const index = open;
    setOpen(null);
    if (index !== null) tileRefs.current[index]?.focus();
  }

  const photo = open !== null ? shown[open] : undefined;

  const filterLink = (href: string, label: string, isCurrent: boolean) => (
    <Link
      key={href}
      href={href}
      scroll={false}
      aria-current={isCurrent ? "page" : undefined}
      className={[
        "inline-flex h-11 items-center border px-space-md text-label-md uppercase transition-colors duration-200",
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
      <nav aria-label={galleryPage.filtersLabel} className="mb-space-xl flex flex-wrap gap-space-sm">
        {filterLink("/gallery", galleryPage.all, !current && !unknownFilter)}
        {available.map((filter) => filterLink("/gallery?service=" + filter.slug, filter.label, current?.slug === filter.slug))}
      </nav>

      {shown.length === 0 ? (
        <div className="flex flex-col items-start gap-space-md border-t border-border py-space-xl">
          <p className="text-body-lg text-muted">{galleryPage.filterEmpty}</p>
          <Link href="/gallery" scroll={false} className="link-rule text-label-md uppercase text-primary hover:text-secondary">
            {galleryPage.seeAll}
          </Link>
        </div>
      ) : (
        <ul className="grid grid-flow-dense auto-rows-[44vw] grid-cols-2 gap-space-sm md:auto-rows-[30vw] md:gap-gutter lg:auto-rows-[20rem] lg:grid-cols-3">
          {shown.map((item, index) => (
            <li key={item.src} className={tileShape(index)}>
              <button
                ref={(node) => {
                  tileRefs.current[index] = node;
                }}
                type="button"
                aria-haspopup="dialog"
                onClick={() => show(index)}
                className="group relative block size-full text-left"
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

      <dialog
        ref={dialogRef}
        data-tone="dark"
        aria-label={galleryPage.lightbox.label}
        onClose={handleClose}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
        onClick={(event) => {
          // A click on the backdrop (the dialog itself, not its content) closes it.
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="m-0 size-full max-h-none max-w-none bg-foreground/95 p-0 text-on-primary backdrop:bg-foreground/80"
      >
        {photo ? (
          <div className="pointer-events-none flex size-full flex-col p-space-md md:p-space-lg">
            <div className="pointer-events-auto flex items-center justify-between gap-space-md">
              <p className="text-label-sm uppercase tabular-nums text-on-primary/75" aria-live="polite">
                {open! + 1} {galleryPage.lightbox.of} {shown.length}
              </p>
              <button
                type="button"
                autoFocus
                onClick={() => dialogRef.current?.close()}
                className="inline-flex size-11 items-center justify-center text-on-primary hover:bg-on-primary/10"
              >
                <Icon name="close" className="size-6" />
                <span className="sr-only">{galleryPage.lightbox.close}</span>
              </button>
            </div>
            <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-space-md py-space-md">
              <div className="pointer-events-auto relative min-h-0 w-full flex-1">
                <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-contain" />
              </div>
              {/* The alt text, shown as the caption. Hidden from screen readers,
                  which already hear it as the image alt. */}
              <figcaption className="pointer-events-auto flex max-w-[60ch] flex-col gap-space-xs text-center text-body-md text-on-primary/90">
                <span aria-hidden="true">{photo.alt}</span>
                {photo.caption ? <span className="text-body-sm text-on-primary/75">{photo.caption}</span> : null}
              </figcaption>
            </figure>
            {shown.length > 1 ? (
              <div className="pointer-events-auto flex items-center justify-center gap-space-md">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  className="inline-flex size-12 items-center justify-center border border-on-primary/40 hover:border-on-primary hover:bg-on-primary/10"
                >
                  <Icon name="chevronLeft" className="size-5" />
                  <span className="sr-only">{galleryPage.lightbox.previous}</span>
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  className="inline-flex size-12 items-center justify-center border border-on-primary/40 hover:border-on-primary hover:bg-on-primary/10"
                >
                  <Icon name="chevronRight" className="size-5" />
                  <span className="sr-only">{galleryPage.lightbox.next}</span>
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
