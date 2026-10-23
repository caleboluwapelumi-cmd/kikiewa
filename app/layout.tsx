import type { Metadata } from "next";
import { Bodoni_Moda, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";
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
          className="fixed top-space-md left-space-md z-[60] -translate-y-[200%] bg-primary px-space-md py-space-sm text-label-md uppercase text-on-primary transition-transform duration-200 focus:translate-y-0"
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
