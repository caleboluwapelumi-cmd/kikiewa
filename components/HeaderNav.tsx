"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useMenuState } from "@/components/MenuState";
import {
  bookingHref,
  contact,
  primaryNav,
  whatsappGreeting,
  type NavItem,
} from "@/data/site";
import { WHATSAPP_FALLBACK_HREF, whatsappLink } from "@/lib/whatsapp";

type HeaderNavProps = {
  /** The logo, rendered on the server and passed in. */
  logo: React.ReactNode;
};

const whatsappHref = whatsappLink(contact.whatsapp, whatsappGreeting);
const whatsappLabel =
  whatsappHref === WHATSAPP_FALLBACK_HREF
    ? "WhatsApp: number to be confirmed, opens the contact page"
    : "Chat on WhatsApp";

/**
 * Main header bar: logo, primary navigation, WhatsApp and Book.
 *
 * Desktop (lg+): Salon & Spa, Medical Spa and Beauty Institute open
 * disclosure menus. Each is a button with aria-expanded; click or
 * Enter/Space toggles it, Escape closes it and returns focus to the button,
 * and it closes when focus or a click moves elsewhere. Nothing opens on
 * hover alone.
 *
 * Below lg: a full-height menu sheet with every link listed.
 */
export function HeaderNav({ logo }: HeaderNavProps) {
  const { open, setOpen } = useMenuState();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const groupButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const pathname = usePathname();

  const isCurrent = (href: string) => {
    const path = href.split("#")[0];
    return pathname === path || pathname.startsWith(path + "/");
  };
  const isCurrentGroup = (item: NavItem) =>
    isCurrent(item.href) || Boolean(item.children?.some((child) => isCurrent(child.href)));

  // Desktop menus: Escape closes and returns focus; a click outside closes.
  useEffect(() => {
    if (!openGroup) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      groupButtons.current[openGroup]?.focus();
      setOpenGroup(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenGroup(null);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openGroup]);

  // While the mobile menu is open: lock page scroll, close on Escape (sending
  // focus back to the toggle, as the menu turns inert), and close if the
  // viewport widens past the breakpoint where the menu is hidden.
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
  }, [open, setOpen]);

  const closeAll = () => {
    setOpen(false);
    setOpenGroup(null);
  };

  return (
    <div className="relative border-b border-border bg-background/90 backdrop-blur-md">
      <div className="shell flex h-20 items-center justify-between gap-space-lg">
        <Link href="/" className="-ml-1 flex shrink-0 items-center p-1" onClick={closeAll}>
          {logo}
        </Link>

        <nav ref={navRef} aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-9">
            {primaryNav.map((item) => {
              const current = isCurrentGroup(item);
              const linkClass = [
                "link-rule flex items-center gap-1 py-1 text-body-sm font-medium transition-colors duration-200",
                current ? "text-primary" : "text-muted hover:text-primary",
              ].join(" ");

              if (!item.children) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={linkClass}
                      onClick={closeAll}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              const expanded = openGroup === item.label;
              const panelId = "nav-" + item.href.slice(1);
              return (
                <li
                  key={item.href}
                  className="relative"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setOpenGroup((group) => (group === item.label ? null : group));
                    }
                  }}
                >
                  <button
                    ref={(node) => {
                      groupButtons.current[item.label] = node;
                    }}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpenGroup(expanded ? null : item.label)}
                    className={[
                      linkClass,
                      current ? "bg-[length:100%_1px]" : "",
                    ].join(" ")}
                  >
                    {item.label}
                    <Icon
                      name="chevronDown"
                      className={[
                        "size-3.5 transition-transform duration-200",
                        expanded ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>

                  <div
                    id={panelId}
                    hidden={!expanded}
                    className="absolute top-full left-1/2 z-10 mt-5 w-64 -translate-x-1/2 border border-border bg-background py-space-sm shadow-float"
                  >
                    <ul>
                      <li>
                        <Link
                          href={item.href}
                          aria-current={pathname === item.href ? "page" : undefined}
                          onClick={closeAll}
                          className="group flex items-center justify-between gap-space-sm px-space-lg py-3 font-display text-title-lg text-primary transition-colors duration-200 hover:bg-surface aria-[current=page]:text-secondary"
                        >
                          {item.label}
                          <Icon
                            name="arrowRight"
                            className="size-4 shrink-0 text-secondary transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
                          />
                        </Link>
                      </li>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={isCurrent(child.href) && !child.href.includes("#") ? "page" : undefined}
                            onClick={closeAll}
                            className="block px-space-lg py-2.5 text-body-sm text-foreground transition-colors duration-200 hover:bg-surface hover:text-primary aria-[current=page]:text-secondary"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-space-sm">
          <a
            href={whatsappHref}
            aria-label={whatsappLabel}
            title={whatsappLabel}
            className="hidden size-11 items-center justify-center text-primary transition-colors duration-200 hover:text-secondary md:flex"
          >
            <Icon name="whatsapp" className="size-5" />
          </a>

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
          "absolute inset-x-0 top-full h-[calc(100dvh-var(--spacing-header))] overflow-y-auto border-t border-border bg-background transition-[opacity,transform,visibility] duration-300 ease-out-soft lg:hidden",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        ].join(" ")}
      >
        <nav aria-label="Primary mobile" className="shell flex min-h-full flex-col py-space-lg">
          <ul className="border-t border-border">
            {primaryNav.map((item) => {
              const current = isCurrent(item.href);
              return (
                <li key={item.href} className="border-b border-border">
                  <Link
                    href={item.href}
                    onClick={closeAll}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={[
                      "group flex items-center justify-between py-4 font-display text-headline-md transition-colors duration-200",
                      current ? "text-secondary" : "text-primary hover:text-secondary",
                    ].join(" ")}
                  >
                    {item.label}
                    <Icon
                      name="arrowRight"
                      className="size-5 shrink-0 text-secondary transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
                    />
                  </Link>
                  {item.children ? (
                    <ul className="-mt-1 flex flex-wrap gap-x-space-lg pb-space-md">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={closeAll}
                            aria-current={pathname === child.href ? "page" : undefined}
                            className="flex min-h-11 items-center text-body-md text-muted transition-colors duration-200 hover:text-primary aria-[current=page]:text-secondary"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>

          {/* Click bubbles up from the link, closing the menu on navigation */}
          <div onClick={closeAll} className="mt-auto flex flex-col gap-space-sm pt-space-xl">
            <Button href={bookingHref} size="lg" icon="arrowRight" className="w-full">
              Book an appointment
            </Button>
            <Button href="/contact" size="lg" variant="subtle" className="w-full">
              Contact &amp; opening hours
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
