import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { CtaBand } from "@/components/CtaBand";
import { ImageFrame } from "@/components/ImageFrame";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard, productPrice } from "@/components/shop/ProductCard";
import { breadcrumbRoots, cta, shopPage, type Product } from "@/data/site";
import { productJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { findProduct, orderHref, productHref, relatedProducts, shopProducts, showingSamples } from "@/lib/shop";

/**
 * One product: photograph, name, price, size, description, how to use and
 * NAFDAC number (each only when the client supplied it), Order on WhatsApp,
 * then related products. Product JSON-LD for real products only, with
 * offers only once the price is confirmed; no ratings or reviews.
 * TODO(phase 2): Paystack checkout next to "Order on WhatsApp".
 */

/**
 * Cache Components needs at least one param. In production with no
 * products the placeholder renders a 404 (and the shop is off anyway).
 */
export function generateStaticParams(): { product: string }[] {
  const params = shopProducts.map((product) => ({ product: product.slug }));
  return params.length ? params : [{ product: "__none__" }];
}

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

/** Trims to a word boundary so the description stays within the SEO limit. */
function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "") + "…";
}

function productMeta(product: Product) {
  const long = `${product.name} | Kikiewa Shop`;
  return {
    path: productHref(product),
    title: long.length <= TITLE_MAX ? long : clip(product.name, TITLE_MAX - 10) + " | Kikiewa",
    description: clip(`${product.description ?? product.summary} Order on WhatsApp from Kikiewa, Ikorodu.`, DESCRIPTION_MAX),
  };
}

export async function generateMetadata({ params }: PageProps<"/shop/[product]">): Promise<Metadata> {
  const product = findProduct((await params).product);
  return product ? pageMetadata(productMeta(product)) : {};
}

export default async function ProductPage({ params }: PageProps<"/shop/[product]">) {
  const product = findProduct((await params).product);
  if (!product) notFound();

  const href = productHref(product);
  const related = relatedProducts(product);
  const details = [
    ...(product.size ? [{ label: shopPage.size, value: product.size }] : []),
    ...(product.nafdacNumber ? [{ label: shopPage.nafdac, value: product.nafdacNumber }] : []),
  ];

  return (
    <>
      {showingSamples ? null : <JsonLd data={productJsonLd(product, href)} />}
      <section className="w-full bg-background pt-space-lg pb-space-2xl md:pt-space-xl lg:pb-space-3xl">
        <div className="shell">
          <Breadcrumbs
            trail={[breadcrumbRoots.home, breadcrumbRoots.shop, { label: product.name, href }]}
            className="mb-space-xl lg:mb-space-2xl"
          />
          <div className="grid grid-cols-1 items-start gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
            <div className="mx-auto w-full max-w-xl lg:col-span-6 lg:max-w-none">
              <ImageFrame
                image={product.image}
                alt={product.image?.alt ?? product.name}
                placeholder={`${shopPage.photoCaption} · ${product.name}`}
                ratio="aspect-[4/5]"
                orientation="portrait"
                tone="warm"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="flex flex-col gap-space-lg lg:col-span-5 lg:col-start-8 lg:pt-space-lg">
              {showingSamples ? (
                <p className="text-label-sm uppercase text-secondary">{shopPage.sampleLabel}</p>
              ) : null}
              <SectionHeading eyebrow={product.category} heading={product.name} as="h1" />
              <p className="text-headline-md text-foreground">
                {productPrice(product)}
                {product.inStock === false ? (
                  <span className="ml-space-md align-middle font-body text-label-sm uppercase text-muted">
                    {shopPage.outOfStock}
                  </span>
                ) : null}
              </p>

              {details.length ? (
                <dl className="divide-y divide-border border-y border-border-strong">
                  {details.map((row) => (
                    <div key={row.label} className="grid grid-cols-[minmax(0,9rem)_1fr] items-baseline gap-space-md py-space-md">
                      <dt className="text-label-sm uppercase text-muted">{row.label}</dt>
                      <dd className="text-body-md text-foreground">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              <div>
                <h2 className="mb-space-sm font-body text-label-sm uppercase text-secondary">{shopPage.description}</h2>
                <p className="max-w-[60ch] text-pretty text-body-lg text-muted">{product.description ?? product.summary}</p>
              </div>

              {product.howToUse ? (
                <div>
                  <h2 className="mb-space-sm font-body text-label-sm uppercase text-secondary">{shopPage.howToUse}</h2>
                  <p className="max-w-[60ch] text-pretty text-body-md text-muted">{product.howToUse}</p>
                </div>
              ) : null}

              <div className="flex flex-col items-start gap-space-sm">
                <Button href={orderHref(product)} target="_blank" rel="noopener noreferrer" variant="whatsapp">
                  {cta.order}
                </Button>
                <p className="text-body-sm text-muted">{shopPage.orderNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="section-y w-full border-t border-border bg-surface">
          <div className="shell">
            <SectionHeading heading={shopPage.related} className="mb-space-2xl" />
            <ul className="grid grid-cols-1 gap-x-gutter gap-y-space-2xl sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-gutter-desktop">
              {related.map((item) => (
                <li key={item.slug}>
                  <ProductCard product={item} titleAs="h3" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <CtaBand />
    </>
  );
}
