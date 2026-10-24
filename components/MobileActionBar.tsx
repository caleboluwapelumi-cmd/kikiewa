"use client";

import Link from "next/link";
import { CallSheet } from "@/components/CallSheet";
import { Icon, type IconName } from "@/components/Icon";
import { useMenuState } from "@/components/MenuState";
import { bookingHref, whatsappHref } from "@/data/site";

/**
 * Sticky Book · WhatsApp · Call bar for phones (below md). Each target is
 * 64px tall, the bar pads itself clear of the home indicator with
 * env(safe-area-inset-bottom), and it hides while the mobile menu is open.
 * The body reserves the same height (app/layout.tsx) so it never covers
 * content.
 *
 * WhatsApp opens the contact page until the number is confirmed. Call opens
 * a "Which location?" sheet (components/CallSheet.tsx).
 */

const links: { label: string; href: string; icon: IconName; primary?: boolean }[] = [
  { label: "Book", href: bookingHref, icon: "calendar", primary: true },
  { label: "WhatsApp", href: whatsappHref, icon: "whatsapp" },
];

const itemClass =
  "flex h-full min-h-11 w-full flex-col items-center justify-center gap-1 text-label-sm uppercase transition-colors duration-200";

export function MobileActionBar() {
  const { open } = useMenuState();

  return (
    <nav
      aria-label="Quick actions"
      inert={open}
      className={[
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] transition-[transform,visibility] duration-300 ease-out-soft md:hidden",
        open ? "invisible translate-y-full" : "visible translate-y-0",
      ].join(" ")}
    >
      <ul className="grid h-action-bar grid-cols-3 divide-x divide-border">
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
              <Icon name={action.icon} className="size-5" />
              {action.label}
            </Link>
          </li>
        ))}
        <li>
          <CallSheet className={itemClass + " text-primary hover:bg-surface"} />
        </li>
      </ul>
    </nav>
  );
}
