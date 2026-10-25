"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useMenuState } from "@/components/MenuState";
import { bookingHref, cta, whatsappHref, type NavItem } from "@/data/site";
import { primaryNavItems } from "@/lib/shop";
import { WHATSAPP_FALLBACK_HREF } from "@/lib/whatsapp";

type HeaderNavProps = {
  /** The logo, rendered on the server and passed in. */
  logo: React.ReactNode;
};

const whatsappLabel =
  whatsappHref === WHATSAPP_FALLBACK_HREF
    ? "WhatsApp: number to be confirmed, opens the contact page"
    : "Chat on WhatsApp";

/**
 * Main header bar: logo, primary navigation, WhatsApp and Book.
 *
 * Desktop (lg+): Services opens a disclosure menu. Each is a button with aria-expanded; click or
 * Enter/Space toggles it, Escape closes it and returns focus to the button,
 * and it closes when focus or a click moves elsewhere. Nothing opens on
 * hover alone.
 *
 * Below lg: the menu button opens MobileMenu, a drawer from the right.
 *
 * In the compact (scrolled) header the bar's contents are nudged down by
 * half the distance the header slides up, so they stay centred.
 */
export function HeaderNav({ logo }: HeaderNavProps) {
  const { open, setOpen } = useMenuState();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
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

  const closeAll = () => {
    setOpen(false);
    setOpenGroup(null);
  };

  return (
    <div className="relative border-b border-border bg-background/90 backdrop-blur-md">
      <div className="shell flex h-20 items-center justify-between gap-space-lg transition-transform duration-300 ease-out-soft group-data-compact/header:translate-y-1 lg:group-data-compact/header:translate-y-1.5">
        <Link href="/" className="-ml-1 flex shrink-0 items-center p-1" onClick={closeAll}>
          {logo}
        </Link>

        <nav ref={navRef} aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-5 xl:gap-8">
            {primaryNavItems.map((item) => {
              const current = isCurrentGroup(item);
              const linkClass = [
                // The after: layer stretches the hit area to 48px tall without moving the text
                "link-rule relative flex items-center gap-1 py-1 text-body-sm font-medium transition-colors duration-200 after:absolute after:inset-x-0 after:-inset-y-[9px]",
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
                    className="absolute top-full left-1/2 z-10 mt-5 w-64 -translate-x-1/2 overflow-hidden rounded-card border border-border bg-background py-space-sm shadow-float"
                  >
                    <ul>
                      <li>
                        <Link
                          href={item.href}
                          aria-current={pathname === item.href ? "page" : undefined}
                          onClick={closeAll}
                          className="group flex items-center justify-between gap-space-sm px-space-lg py-3 font-display text-title-lg text-primary transition-colors duration-200 hover:bg-surface aria-[current=page]:text-secondary"
                        >
                          All {item.label.toLowerCase()}
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
            className="hidden size-12 items-center justify-center rounded-full text-primary transition-[color,background-color,transform] duration-200 hover:bg-surface hover:text-secondary active:scale-[0.94] md:flex"
          >
            <Icon name="whatsapp" className="size-5" />
          </a>

          <Button href={bookingHref} className="hidden sm:inline-flex">
            {cta.bookShort}
          </Button>

          <button
            id="menu-toggle"
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            className="flex size-12 items-center justify-center rounded-full border border-border-strong text-primary transition-[border-color,background-color,transform] duration-200 hover:border-primary hover:bg-surface active:scale-[0.94] lg:hidden"
          >
            <Icon name="menu" className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
