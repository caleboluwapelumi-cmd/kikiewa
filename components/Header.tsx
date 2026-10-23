"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { bookingHref, navLinks, site } from "@/data/site";

export function Header() {
  const [open, setOpen] = useState(false);

  // Keep the page behind the open menu from scrolling, and allow Escape to close.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="shell flex h-20 items-center justify-between">
        <Link href="/" className="flex flex-col" onClick={() => setOpen(false)}>
          <span className="text-headline-sm uppercase tracking-widest text-primary">
            {site.name}
          </span>
          <span className="text-label-sm uppercase text-secondary">
            {site.tagline}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-space-lg lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-space-xs text-title-md text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-space-sm">
          <Button href={bookingHref} size="sm" className="hidden sm:inline-flex">
            Book
          </Button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-11 items-center justify-center rounded-xs border border-border text-primary transition-colors hover:bg-surface lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} className="size-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-border bg-background lg:hidden"
      >
        <nav
          aria-label="Primary mobile"
          className="shell flex flex-col gap-space-xs py-space-md"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-border py-space-md text-title-lg text-foreground transition-colors last:border-b-0 hover:text-secondary"
            >
              {link.label}
            </Link>
          ))}
          {/* Click bubbles up from the link, closing the menu on navigation */}
          <div onClick={() => setOpen(false)} className="mt-space-sm sm:hidden">
            <Button href={bookingHref} size="lg" icon="arrowRight" className="w-full">
              Book an appointment
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
