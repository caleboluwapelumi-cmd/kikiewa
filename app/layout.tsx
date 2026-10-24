import type { Metadata } from "next";
import { Bodoni_Moda, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { MenuStateProvider } from "@/components/MenuState";
import { MobileActionBar } from "@/components/MobileActionBar";
import { seo, site } from "@/data/site";
import { isProductionSite } from "@/lib/env";
import { organizationJsonLd } from "@/lib/jsonld";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  // Optical-size axis. Values are set per type tier in app/globals.css.
  axes: ["opsz"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Site-wide defaults. Each page sets its own title, description, canonical
 * and Open Graph through lib/seo.ts; no canonical here, so pages without one
 * (such as the 404) never point at the home page.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: seo.home.title,
  description: seo.home.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.ogLocale,
    title: seo.home.title,
    description: seo.home.description,
  },
  robots: isProductionSite
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.lang}
      className={`${bodoniModa.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      {/* Below md the body reserves the mobile action bar's height (plus the
          safe-area inset), so the bar never covers the end of the main
          content or the footer beneath it. */}
      <body className="flex min-h-full flex-col pb-[calc(var(--spacing-action-bar)+env(safe-area-inset-bottom))] md:pb-0">
        <a
          href="#main"
          className="fixed top-space-md left-space-md z-[60] -translate-y-[200%] bg-primary px-space-md py-space-sm text-label-md uppercase text-on-primary transition-transform duration-200 focus:translate-y-0"
        >
          Skip to content
        </a>
        <JsonLd data={organizationJsonLd()} />
        <MenuStateProvider>
          <Header />
          {/* Offset the fixed header (taller from lg, with the utility bar) */}
          <main
            id="main"
            tabIndex={-1}
            className="w-full flex-1 pt-header focus:outline-none lg:pt-header-desktop"
          >
            {children}
          </main>
          <Footer />
          <MobileActionBar />
        </MenuStateProvider>
      </body>
    </html>
  );
}
