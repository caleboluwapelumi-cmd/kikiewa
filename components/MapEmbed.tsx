"use client";

import { useState } from "react";
import { Confirmable } from "@/components/Confirmable";
import { Icon } from "@/components/Icon";
import { mapEmbed, type Location } from "@/data/site";
import { mapEmbedUrl } from "@/lib/maps";

/**
 * A branch map behind a click-to-load facade. Nothing from Google loads on
 * page load: the frame first shows a styled card with the address and a
 * "Show map" button, and only a tap swaps in the Google Maps iframe (no
 * API key). The frame keeps its size either way (4:3 on phones, 16:10 from
 * sm), so nothing shifts when the map arrives. Focus moves to the map.
 */
export function MapEmbed({ location, className = "" }: { location: Location; className?: string }) {
  const [shown, setShown] = useState(false);
  const title = `${mapEmbed.titlePrefix} ${location.title}`;

  return (
    <div
      className={[
        "relative isolate aspect-[4/3] w-full overflow-hidden rounded-card border border-border bg-surface-2 sm:aspect-[16/10]",
        className,
      ].join(" ")}
    >
      {shown ? (
        <iframe
          src={mapEmbedUrl(location)}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          // Focus the map once it is swapped in, so keyboard users land on it.
          ref={(node) => node?.focus()}
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-br from-cream from-10% via-surface-warm to-primary/20 p-space-md sm:p-space-lg">
          {/* A quiet street-grid drawing, so the card reads as a map */}
          <svg
            aria-hidden="true"
            viewBox="0 0 400 250"
            preserveAspectRatio="xMidYMid slice"
            className="pointer-events-none absolute inset-0 -z-10 size-full fill-none stroke-primary opacity-[0.12]"
            strokeWidth={1}
          >
            <path d="M-10 60 C 90 40, 160 110, 410 80" vectorEffect="non-scaling-stroke" />
            <path d="M-10 170 C 120 150, 230 210, 410 180" vectorEffect="non-scaling-stroke" />
            <path d="M120 -10 C 140 80, 100 170, 130 260" vectorEffect="non-scaling-stroke" />
            <path d="M290 -10 C 270 90, 310 160, 280 260" vectorEffect="non-scaling-stroke" />
            <path d="M-10 115 L 410 125" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
          </svg>

          <div className="flex items-start gap-space-md">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
              <Icon name="pin" className="size-5" />
            </span>
            <p className="max-w-[40ch] text-body-sm text-foreground sm:pt-1 sm:text-body-md">
              <span className="block text-title-md text-primary">{location.title}</span>
              <Confirmable value={location.address} />
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-space-md gap-y-space-xs">
            <button
              type="button"
              onClick={() => setShown(true)}
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-chip border border-transparent bg-primary px-7 py-3 text-button text-on-primary transition-[background-color,transform] duration-200 ease-out-soft hover:bg-primary-hover active:scale-[0.97]"
            >
              <Icon name="compass" className="size-5 shrink-0" />
              {mapEmbed.show}
              <span className="sr-only">: {location.title}</span>
            </button>
            <span className="hidden text-body-sm text-foreground sm:inline">{mapEmbed.note}</span>
          </div>
        </div>
      )}
    </div>
  );
}
