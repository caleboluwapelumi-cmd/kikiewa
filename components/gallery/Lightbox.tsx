"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { galleryPage } from "@/data/site";

/**
 * A native <dialog> photo viewer, shared by /gallery and every service
 * page's "Our work". Escape closes it, the arrow keys (and buttons) move
 * between photos, a backdrop click closes it, the caption is the photo's
 * alt text, and focus returns to the tile of the photo last shown.
 */

export type LightboxPhoto = { src: string; alt: string; caption?: string };

export function useLightbox(count: number) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<(HTMLElement | null)[]>([]);
  const [open, setOpen] = useState<number | null>(null);

  return {
    dialogRef,
    open,
    /** Ref callback for the tile that opens photo `index`. */
    trigger: (index: number) => (node: HTMLElement | null) => {
      triggerRefs.current[index] = node;
    },
    show(index: number) {
      setOpen(index);
      dialogRef.current?.showModal();
    },
    move(step: number) {
      setOpen((index) => (index === null || count === 0 ? index : (index + step + count) % count));
    },
    handleClose() {
      const index = open;
      setOpen(null);
      if (index !== null) triggerRefs.current[index]?.focus();
    },
  };
}

type LightboxState = ReturnType<typeof useLightbox>;

const roundButton =
  "inline-flex size-12 items-center justify-center rounded-full transition-[border-color,background-color,transform] duration-200 hover:bg-on-primary/10 active:scale-[0.94]";

export function Lightbox({ state, photos }: { state: LightboxState; photos: LightboxPhoto[] }) {
  const { dialogRef, open, move, handleClose } = state;
  const photo = open !== null ? photos[open] : undefined;

  return (
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
      className="m-auto h-[calc(100dvh-1.5rem)] w-[calc(100vw-1.5rem)] max-h-none max-w-none overflow-hidden rounded-card bg-foreground/95 p-0 text-on-primary backdrop:bg-foreground/80"
    >
      {photo ? (
        <div className="pointer-events-none flex size-full flex-col p-space-md md:p-space-lg">
          <div className="pointer-events-auto flex items-center justify-between gap-space-md">
            <p className="text-label-sm uppercase tabular-nums text-on-primary/75" aria-live="polite">
              {open! + 1} {galleryPage.lightbox.of} {photos.length}
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              className={[roundButton, "text-on-primary"].join(" ")}
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
          {photos.length > 1 ? (
            <div className="pointer-events-auto flex items-center justify-center gap-space-md">
              <button
                type="button"
                onClick={() => move(-1)}
                className={[roundButton, "border border-on-primary/40 hover:border-on-primary"].join(" ")}
              >
                <Icon name="chevronLeft" className="size-5" />
                <span className="sr-only">{galleryPage.lightbox.previous}</span>
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                className={[roundButton, "border border-on-primary/40 hover:border-on-primary"].join(" ")}
              >
                <Icon name="chevronRight" className="size-5" />
                <span className="sr-only">{galleryPage.lightbox.next}</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
