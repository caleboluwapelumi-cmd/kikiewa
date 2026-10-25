import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { MenuStateProvider } from "@/components/MenuState";
import { MobileActionBar } from "@/components/MobileActionBar";
import { MobileMenu } from "@/components/MobileMenu";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { seo, site } from "@/data/site";
import { isProductionSite } from "@/lib/env";
import { organizationJsonLd } from "@/lib/jsonld";
import "./globals.css";

// Headings: the variable font with its optical size axis, set per type
// tier in app/globals.css. Latin only; the site uses weights 400 to 600.
// next/font loads extra axes only with weight "variable", and Google serves
// the same file for a 400 to 600 range anyway (65KB). SOFT is left out: it
// nearly doubled the file (117KB).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  display: "swap",
});

// Body and UI: 400, 500 and 600.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}
    >
      {/* The floating mobile action bar reserves its own room at the end of
          the page (a spacer in components/MobileActionBar.tsx), so it never
          covers the end of the content or the footer. */}
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="fixed top-space-md left-space-md z-[60] -translate-y-[200%] inline-flex min-h-12 items-center rounded-chip bg-primary px-space-lg text-button text-on-primary transition-transform duration-200 focus:translate-y-0"
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
          <MobileMenu />
        </MenuStateProvider>
        <RevealOnScroll />
      </body>
    </html>
  );
}
