"use client";

import { ImageFrame, type ImageTone } from "@/components/ImageFrame";
import { Lightbox, useLightbox } from "@/components/gallery/Lightbox";
import { galleryPage, type OwnImageAsset, type WorkItem } from "@/data/site";

/**
 * A service page's "Our work": its three slots (facials-01..03) as a swipe
 * row on phones, three across from md. A tile with a shoot photo opens the
 * lightbox on tap; a tile still waiting shows the designed placeholder and
 * does nothing.
 */
export function WorkGallery({ items, tone = "warm" }: { items: WorkItem[]; tone?: ImageTone }) {
  const photos = items.flatMap((item) => (item.image ? [item.image] : []));
  const lightbox = useLightbox(photos.length);

  return (
    <>
      <ul className="scroll-row md:scroll-row-off md:grid-cols-3 md:gap-gutter lg:gap-gutter-desktop [&>li]:w-[min(68%,18rem)] md:[&>li]:w-auto">
        {items.map((item, index) => {
          const frame = (
            <ImageFrame
              image={item.image}
              alt={item.alt}
              placeholder={item.caption}
              ratio="aspect-[4/5]"
              orientation="portrait"
              tone={tone}
              sizes="(max-width: 768px) 68vw, 33vw"
              zoomOnHover={Boolean(item.image)}
            />
          );
          const photoIndex = item.image ? photos.indexOf(item.image as OwnImageAsset) : -1;
          return (
            <li key={item.alt + index}>
              {photoIndex >= 0 ? (
                <button
                  ref={lightbox.trigger(photoIndex)}
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => lightbox.show(photoIndex)}
                  className="group relative block w-full rounded-card text-left"
                >
                  <span className="sr-only">
                    {galleryPage.viewLarger}: {item.alt}
                  </span>
                  {frame}
                </button>
              ) : (
                frame
              )}
            </li>
          );
        })}
      </ul>
      {photos.length ? <Lightbox state={lightbox} photos={photos} /> : null}
    </>
  );
}
