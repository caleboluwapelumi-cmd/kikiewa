"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { bookingHref, primaryNav } from "@/data/site";

type HeaderNavProps = {
  /** The logo, rendered on the server and passed in. */
  logo: React.ReactNode;
};

export function HeaderNav({ logo }: HeaderNavProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // While the menu is open: lock page scroll, close on Escape (sending focus
  // back to the toggle, as the menu turns inert), and close if the viewport
  // widens past the breakpoint where the menu is hidden.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };

    const desktop = window.matchMedia("(width >= 64rem)");
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="shell flex h-20 items-center justify-between gap-space-lg">
        <Link
          href="/"
          className="-ml-1 flex shrink-0 items-center p-1"
          onClick={() => setOpen(false)}
        >
          {logo}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {primaryNav.map((link) => {
            const current = isCurrent(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={[
                  "link-rule py-1 text-body-sm font-medium",
                  current ? "text-primary" : "text-muted hover:text-primary",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-space-sm">
          <Button href={bookingHref} size="sm" className="hidden sm:inline-flex">
            Book
          </Button>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-11 items-center justify-center rounded-xs border border-border text-primary transition-colors duration-200 hover:border-primary active:translate-y-px lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu — full-height sheet under the bar. Stays mounted so it can
          fade in; `inert` removes it from focus and the accessibility tree
          while closed. */}
      <div
        id="mobile-menu"
        inert={!open}
        className={[
          "absolute inset-x-0 top-full h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border bg-background transition-[opacity,transform,visibility] duration-300 ease-out-soft lg:hidden",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0",
        ].join(" ")}
      >
        <nav
          aria-label="Primary mobile"
          className="shell flex min-h-full flex-col py-space-lg"
        >
          <ul className="border-t border-border">
            {primaryNav.map((link) => {
              const current = isCurrent(link.href);
              return (
                <li key={link.href} className="border-b border-border">
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={current ? "page" : undefined}
                    className={[
                      "group flex items-center justify-between py-5 font-display text-headline-md transition-colors duration-200",
                      current ? "text-secondary" : "text-primary hover:text-secondary",
                    ].join(" ")}
                  >
                    {link.label}
                    <Icon
                      name="arrowRight"
                      className="size-5 shrink-0 text-secondary transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Click bubbles up from the link, closing the menu on navigation */}
          <div onClick={() => setOpen(false)} className="mt-auto pt-space-xl">
            <Button href={bookingHref} size="lg" icon="arrowRight" className="w-full">
              Book an appointment
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
