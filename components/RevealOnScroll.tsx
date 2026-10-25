"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll reveal: page sections fade up 16px over 500ms as they come into
 * view, and card grids marked data-reveal-stagger bring their cards in one
 * after another. The CSS is in app/globals.css (inside
 * prefers-reduced-motion: no-preference, so under reduced motion nothing is
 * ever hidden).
 *
 * Targets: every top-level page section except the first (the hero), plus
 * anything marked data-reveal or data-reveal-stagger.
 *
 * Above-the-fold content never animates: whatever is already on screen when
 * the hook runs is revealed before the page is marked ready, so it never
 * hides, and the largest paint is never delayed. Without JavaScript nothing
 * is marked ready, so everything shows.
 */
export function useRevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const sections = document.querySelectorAll<HTMLElement>(
      "#main > section:not(:first-of-type), #main > div > section:not(:first-of-type)",
    );
    sections.forEach((section) => {
      if (!section.querySelector("[data-reveal-stagger]")) section.setAttribute("data-reveal", "");
    });

    document.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((grid) => {
      Array.from(grid.children).forEach((child, index) => {
        (child as HTMLElement).style.setProperty("--reveal-index", String(Math.min(index, 6)));
      });
    });

    const targets = document.querySelectorAll<HTMLElement>(
      "[data-reveal]:not([data-revealed]), [data-reveal-stagger]:not([data-revealed])",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    const fold = window.innerHeight;
    targets.forEach((target) => {
      const box = target.getBoundingClientRect();
      if (box.top < fold && box.bottom > 0) target.setAttribute("data-revealed", "");
      else observer.observe(target);
    });
    document.documentElement.classList.add("reveal-ready");

    return () => observer.disconnect();
  }, [pathname]);
}

export function RevealOnScroll() {
  useRevealOnScroll();
  return null;
}
