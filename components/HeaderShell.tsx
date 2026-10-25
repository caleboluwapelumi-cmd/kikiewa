"use client";

import { useEffect, useState } from "react";
import { useMenuState } from "@/components/MenuState";

/** Scroll distance (px) after which the header turns compact. */
const COMPACT_AFTER = 24;

/**
 * The fixed <header>. After 24px of scrolling it turns compact: a soft
 * shadow fades in and the header slides up a little (on desktop, far
 * enough to tuck the utility bar away), with the bar's contents nudged
 * back down and the logo scaled to 90%. Transform and opacity only, so
 * nothing reflows. Never compact while the phone menu is open.
 *
 * Children read the state through Tailwind's named group:
 * group-data-compact/header.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const { open } = useMenuState();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > COMPACT_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const compact = scrolled && !open;

  return (
    <header
      data-compact={compact ? "" : undefined}
      className="group/header fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out-soft data-compact:-translate-y-2 lg:data-compact:-translate-y-11"
    >
      {children}
      {/* Soft shadow under the bar, faded in when compact */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-6 translate-y-full bg-linear-to-b from-primary/8 to-transparent opacity-0 transition-opacity duration-300 ease-out-soft group-data-compact/header:opacity-100"
      />
    </header>
  );
}
