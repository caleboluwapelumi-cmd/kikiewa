import { HeaderNav } from "@/components/HeaderNav";
import { Logo } from "@/components/brand/Logo";

/**
 * Site header. A server component, so the inlined logo artwork renders as
 * HTML and stays out of the client bundle; the interactive navigation is
 * the HeaderNav client component.
 */
export function Header() {
  return (
    <HeaderNav logo={<Logo className="h-12 w-auto lg:h-14" />} />
  );
}
