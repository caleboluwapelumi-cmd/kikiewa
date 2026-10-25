"use client";

import { Children, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/Icon";

/**
 * One accessible slider for the hero, the academy slideshow and the
 * testimonials (site plan, section 3.1). No library: stacked slides that
 * crossfade, plus a small amount of state.
 *
 * - Autoplay every 6s. It holds while the pointer is over the slides or
 *   keyboard focus is inside them, so a focused link never fades away.
 * - Visible pause/play, previous/next and, from md, one dot per slide
 *   (phones show "2 / 4" instead, so every control keeps a 48px target).
 *   All are native buttons with labels, so they work from the keyboard.
 * - The shown slide carries data-slide-active="true" once motion is
 *   allowed, and --slide-duration, for the hero's Ken Burns zoom.
 * - prefers-reduced-motion: no autoplay and no fade. Slide 1 shows, static;
 *   the controls still step through slides, and Play is there if wanted.
 * - Swipe left/right on touch screens. Vertical scrolling is untouched.
 * - Slides are server-rendered children, so captions are real text. Only
 *   the active slide is exposed: the rest are inert and aria-hidden.
 * - The server render (and a page without JS) shows slide 1 with nothing
 *   moving. Autoplay only starts once the client knows motion is allowed.
 * - Slides not yet shown stay out of the layout (display: none) until the
 *   page has finished loading, so their lazy images don't compete with
 *   slide 1's (the hero's largest paint). They then load in the background,
 *   well before the first crossfade.
 *
 * Pattern: WAI-ARIA APG carousel. The controls come first in the DOM, so
 * pause is the first stop inside the slider; `controlsClassName` places
 * them visually.
 */

type SliderProps = {
  /** Accessible name: "Welcome to Kikiewa", "Inside our classes". */
  label: string;
  /** One child per slide. */
  children: React.ReactNode;
  /** Optional slide names for the dots. Default: "Slide 2 of 4". */
  slideLabels?: string[];
  autoplay?: boolean;
  /** Milliseconds per slide. */
  interval?: number;
  /** "dark" for controls on photography, "light" on cream surfaces. */
  tone?: "light" | "dark";
  className?: string;
  /** Sizing for the slide area, e.g. a fixed hero height. */
  viewportClassName?: string;
  /** Placement for the controls row. */
  controlsClassName?: string;
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Swipes shorter than this (px) are taps. */
const SWIPE_MIN = 40;

export function Slider({
  label,
  children,
  slideLabels,
  autoplay = true,
  interval = 6000,
  tone = "light",
  className = "",
  viewportClassName = "",
  controlsClassName = "",
}: SliderProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const id = useId();

  const [active, setActive] = useState(0);
  /** null until the visitor presses pause or play. */
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  /** True once the page has loaded: the other slides may load their images. */
  const [armed, setArmed] = useState(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const arm = () => setArmed(true);
    if (document.readyState === "complete") {
      const timer = window.setTimeout(arm, 0);
      return () => window.clearTimeout(timer);
    }
    window.addEventListener("load", arm, { once: true });
    return () => window.removeEventListener("load", arm);
  }, []);

  // On the server and during hydration this reads as "reduced", so nothing
  // moves until the client has checked the real preference.
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  );

  const canPlay = autoplay && count > 1;
  const playing = canPlay && (userPaused === null ? !reducedMotion : !userPaused);
  const running = playing && !hovered && !focused;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % count), interval);
    return () => window.clearTimeout(timer);
  }, [running, active, count, interval]);

  if (count === 0) return null;

  const go = (index: number) => setActive((index + count) % count);
  const dark = tone === "dark";

  const buttonClass = [
    "flex size-12 shrink-0 items-center justify-center rounded-full border transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.94]",
    dark
      ? "border-on-primary/40 text-on-primary hover:border-on-primary hover:bg-on-primary/10"
      : "border-border-strong text-primary hover:border-primary hover:bg-surface",
  ].join(" ");

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      data-tone={dark ? "dark" : undefined}
      className={["relative flex flex-col", className].join(" ")}
    >
      {count > 1 ? (
        <div
          className={["z-20 flex items-center gap-space-sm", controlsClassName].join(" ")}
        >
          {canPlay ? (
            <button
              type="button"
              onClick={() => setUserPaused(playing)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className={buttonClass}
            >
              <Icon name={playing ? "pause" : "play"} className="size-4" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Previous slide"
            aria-controls={id}
            className={buttonClass}
          >
            <Icon name="chevronLeft" className="size-4" />
          </button>
          <p
            aria-hidden="true"
            className={[
              "min-w-12 text-center text-body-sm tabular-nums md:hidden",
              dark ? "text-on-primary" : "text-muted",
            ].join(" ")}
          >
            {active + 1} / {count}
          </p>
          <ul className="hidden items-center gap-2 md:flex">
            {slides.map((_, index) => {
              const current = index === active;
              const name = slideLabels?.[index];
              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => go(index)}
                    aria-label={`Slide ${index + 1} of ${count}${name ? ": " + name : ""}`}
                    aria-current={current ? "true" : undefined}
                    aria-controls={id}
                    className="group flex size-12 items-center justify-center"
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        "block h-1 rounded-full transition-[width,background-color] duration-300 ease-out-soft",
                        current ? "w-7" : "w-3",
                        dark
                          ? current
                            ? "bg-on-primary"
                            : "bg-on-primary/50 group-hover:bg-on-primary/80"
                          : current
                            ? "bg-primary"
                            : "bg-border-strong group-hover:bg-primary/60",
                      ].join(" ")}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Next slide"
            aria-controls={id}
            className={buttonClass}
          >
            <Icon name="chevronRight" className="size-4" />
          </button>
        </div>
      ) : null}

      <div
        id={id}
        // Announce slide changes only when the visitor causes them
        aria-live={running ? "off" : "polite"}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") swipe.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = swipe.current;
          swipe.current = null;
          if (!start) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) go(active + (dx < 0 ? 1 : -1));
        }}
        onPointerCancel={() => {
          swipe.current = null;
        }}
        style={{ "--slide-duration": interval + 700 + "ms" } as React.CSSProperties}
        className={["grid touch-pan-y", viewportClassName].join(" ")}
      >
        {slides.map((slide, index) => {
          const current = index === active;
          return (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
              aria-hidden={!current}
              inert={!current}
              data-slide-active={current && !reducedMotion ? "true" : undefined}
              className={[
                "[grid-area:1/1] transition-opacity duration-700 ease-out-soft",
                current ? "z-10 opacity-100" : "pointer-events-none opacity-0",
                !current && !armed ? "hidden" : "",
              ].join(" ")}
            >
              {slide}
            </div>
          );
        })}
      </div>
    </section>
  );
}
