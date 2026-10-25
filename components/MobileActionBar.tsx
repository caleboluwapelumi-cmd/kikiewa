"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CallSheet } from "@/components/CallSheet";
import { Icon, type IconName } from "@/components/Icon";
import { useMenuState } from "@/components/MenuState";
import { bookingHref, whatsappHref } from "@/data/site";

/**
 * Floating Book · WhatsApp · Call bar for phones (below md). It floats 12px
 * in from the screen edges with rounded ends, clear of the home indicator
 * (env(safe-area-inset-bottom)). Each target is 48px tall with 8px between
 * them. It hides while the mobile menu is open.
 *
 * Not on /book: the booking form has its own sticky Next button there, and
 * the bar would only repeat "Book".
 *
 * While the bar is on the page, a spacer after the footer reserves its
 * height, its inset and a gap above it, plus the safe-area inset, so the bar
 * never covers the end of the content or the footer. (A spacer rather than
 * body:has(), which made every style recalculation on the page slower.)
 *
 * WhatsApp opens the business number (the contact page if it is TBC). Call opens
 * a sheet with the main line and both locations (components/CallSheet.tsx).
 */

const links: { label: string; href: string; icon: IconName; primary?: boolean }[] = [
  { label: "Book", href: bookingHref, icon: "calendar", primary: true },
  { label: "WhatsApp", href: whatsappHref, icon: "whatsapp" },
];

const itemClass =
  "flex h-12 w-full items-center justify-center gap-2 rounded-chip text-body-sm font-semibold transition-[background-color,color,transform] duration-200 active:scale-[0.97]";

export function MobileActionBar() {
  const { open } = useMenuState();
  const pathname = usePathname();
  if (pathname === bookingHref) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="h-[calc(var(--spacing-action-bar)+var(--spacing-action-bar-inset)*2+env(safe-area-inset-bottom))] shrink-0 md:hidden"
      />
      <nav
        aria-label="Quick actions"
        data-action-bar
        inert={open}
        className={[
          "fixed inset-x-action-bar-inset bottom-[calc(var(--spacing-action-bar-inset)+env(safe-area-inset-bottom))] z-40 rounded-bar border border-border bg-background/95 p-2 shadow-float backdrop-blur-md transition-[transform,opacity,visibility] duration-300 ease-out-soft md:hidden",
          open ? "invisible translate-y-[150%] opacity-0" : "visible translate-y-0 opacity-100",
        ].join(" ")}
      >
        <ul className="grid grid-cols-3 gap-2">
          {links.map((action) => (
            <li key={action.label}>
              <Link
                href={action.href}
                className={[
                  itemClass,
                  action.primary
                    ? "bg-primary text-on-primary hover:bg-primary-hover"
                    : "text-primary hover:bg-surface",
                ].join(" ")}
              >
                <Icon name={action.icon} className="size-5 shrink-0" />
                {action.label}
              </Link>
            </li>
          ))}
          <li>
            <CallSheet className={itemClass + " text-primary hover:bg-surface"} />
          </li>
        </ul>
      </nav>
    </>
  );
}
