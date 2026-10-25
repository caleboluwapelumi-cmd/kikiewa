import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { ShopBrowser, ShopView } from "@/components/shop/ShopBrowser";
import { seo, shopPage } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { shopEnabled, shopProducts } from "@/lib/shop";

// Canonical is /shop for every ?category= view (pageMetadata).
export const metadata: Metadata = pageMetadata(seo.shop);

/**
 * Shop. Products are ordered on WhatsApp for now.
 * TODO(phase 2): Paystack checkout (see data/site.ts, Shop).
 *
 * In production with no products the shop is off and this is a 404.
 * Previews show three labelled sample products until real ones arrive.
 * The static page renders every product; in the browser ?category= filters.
 */
export default function ShopPage() {
  if (!shopEnabled) notFound();

  return (
    <>
      <PageIntro copy={shopPage.intro} />
      <section className="w-full border-t border-border bg-background py-space-2xl lg:py-space-3xl">
        <div className="shell">
          <Suspense fallback={<ShopView items={shopProducts} active={null} />}>
            <ShopBrowser items={shopProducts} />
          </Suspense>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
