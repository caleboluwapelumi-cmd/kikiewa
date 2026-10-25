import { HeaderNav } from "@/components/HeaderNav";
import { HeaderShell } from "@/components/HeaderShell";
import { UtilityBar } from "@/components/UtilityBar";
import { Logo } from "@/components/brand/Logo";

/**
 * Fixed site header: the desktop-only utility bar, then the main bar.
 * A server component, so the inlined logo artwork renders as HTML and stays
 * out of the client bundle. HeaderShell handles the scrolled state; the
 * interactive navigation is HeaderNav, and the phone menu is MobileMenu
 * (rendered from app/layout.tsx, outside the header, so the header's
 * transform and blur never trap it).
 */
export function Header() {
  return (
    <HeaderShell>
      <UtilityBar />
      <HeaderNav logo={<Logo className="h-12 w-auto origin-left transition-transform duration-300 ease-out-soft group-data-compact/header:scale-90 lg:h-14" />} />
    </HeaderShell>
  );
}
