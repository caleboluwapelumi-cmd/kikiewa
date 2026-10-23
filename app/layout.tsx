import type { Metadata } from "next";
import { Bodoni_Moda, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  // Optical sizing: hairline contrast at display sizes, sturdier strokes at
  // the small sizes used for card titles.
  axes: ["opsz"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.name + " — Aesthetics, Lagos",
    template: "%s · " + site.name,
  },
  description:
    "Elevated beauty, clinical precision, and transformative aesthetic wellness in Lagos. Salon & spa, medical spa & makeover, and the Kikiewa Beauty Institute.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-[60] bg-primary px-space-md py-space-sm text-label-md uppercase text-on-primary focus:not-sr-only focus:fixed focus:top-space-md focus:left-space-md"
        >
          Skip to content
        </a>
        <Header />
        {/* Offset the fixed 80px header */}
        <main id="main" tabIndex={-1} className="w-full flex-1 pt-20 focus:outline-none">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
