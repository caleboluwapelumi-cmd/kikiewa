"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useMenuState } from "@/components/MenuState";
import { bookingHref, cta, whatsappHref } from "@/data/site";
import { primaryNavItems } from "@/lib/shop";

/**
 * The phone and tablet menu (below lg): a drawer that slides in from the
 * right over a fading backdrop. Opened by the header's menu button.
 *
 * - While open, the page behind (header, main, footer) is inert and does
 *   not scroll, so focus stays in the drawer. Focus moves to the close
 *   button on open and back to the menu button on close.
 * - Closes on Escape, on the close button, on a tap on the backdrop, on any
 *   link, and if the viewport widens to lg.
 * - Stays mounted so it can animate; `inert` keeps it out of the focus order
 *   and the accessibility tree while closed. Transform and opacity only;
 *   instant under reduced motion.
 */
export function MobileMenu() {
  const { open, setOpen } = useMenuState();
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const desktop = window.matchMedia("(width >= 64rem)");
    const onBreakpoint = () => {
      if (desktop.matches) close();
    };

    const behind = Array.from(document.querySelectorAll<HTMLElement>("body > header, #main, body > footer"));
    behind.forEach((element) => {
      element.inert = true;
    });
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    closeRef.current?.focus();

    return () => {
      behind.forEach((element) => {
        element.inert = false;
      });
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
      document.getElementById("menu-toggle")?.focus({ preventScroll: true });
    };
  }, [open, setOpen]);

  const close = () => setOpen(false);

  return (
    <div className={["fixed inset-0 z-[55] lg:hidden", open ? "" : "pointer-events-none"].join(" ")}>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={close}
        className={[
          "absolute inset-0 bg-foreground/45 transition-opacity duration-300 ease-out-soft",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={[
          "absolute inset-y-0 right-0 flex w-[min(88vw,26rem)] flex-col overflow-y-auto rounded-l-card bg-background shadow-float transition-[transform,visibility] duration-300 ease-out-soft",
          open ? "visible translate-x-0" : "invisible translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-20 shrink-0 items-center justify-between gap-space-md border-b border-border pr-space-md pl-space-lg">
          <p className="text-label-sm uppercase text-muted">Menu</p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex size-12 items-center justify-center rounded-full border border-border-strong text-primary transition-[border-color,background-color,transform] duration-200 hover:border-primary hover:bg-surface active:scale-[0.94]"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>

        <nav aria-label="Primary mobile" className="flex flex-1 flex-col px-space-lg pt-space-sm pb-[calc(var(--spacing-space-lg)+env(safe-area-inset-bottom))]">
          <ul>
            {primaryNavItems.map((item) => (
              <li key={item.href} className="border-b border-border">
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={[
                    "flex min-h-14 items-center py-space-sm font-display text-headline-md transition-colors duration-200",
                    isCurrent(item.href) ? "text-secondary" : "text-primary hover:text-secondary",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="-mt-1 flex flex-wrap gap-x-space-lg gap-y-space-xs pb-space-sm">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={close}
                          aria-current={pathname === child.href ? "page" : undefined}
                          className="flex min-h-12 items-center text-body-md text-muted transition-colors duration-200 hover:text-primary aria-[current=page]:text-secondary"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-3 pt-space-xl">
            <Button href={bookingHref} onClick={close} className="w-full">
              {cta.book}
            </Button>
            <Button href={whatsappHref} onClick={close} variant="whatsapp" className="w-full">
              {cta.whatsapp}
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
