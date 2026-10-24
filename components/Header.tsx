import { HeaderNav } from "@/components/HeaderNav";
import { UtilityBar } from "@/components/UtilityBar";
import { Logo } from "@/components/brand/Logo";

/**
 * Fixed site header: the desktop-only utility bar, then the main bar.
 * A server component, so the inlined logo artwork renders as HTML and stays
 * out of the client bundle; the interactive navigation is HeaderNav.
 */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <UtilityBar />
      <HeaderNav logo={<Logo className="h-12 w-auto lg:h-14" />} />
    </header>
  );
}
