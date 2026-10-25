import Link from "next/link";
import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { cta, shopPage, type Product } from "@/data/site";
import { formatNaira } from "@/lib/format";
import { orderHref, productHref, showingSamples } from "@/lib/shop";

/** "₦12,500", or "Price on request" until the client confirms a price. */
export function productPrice(product: Product): string {
  return typeof product.price === "number" ? formatNaira(product.price) : shopPage.priceOnRequest;
}

/**
 * One product in the shop grid: photograph (or placeholder), name, size,
 * price, and "Order on WhatsApp". The name is the link to the product page;
 * the photograph repeats it for pointers only. Preview sample cards carry
 * a "Sample product, to be supplied" label.
 */
export function ProductCard({ product, titleAs: Title = "h2" }: { product: Product; titleAs?: "h2" | "h3" }) {
  const href = productHref(product);
  return (
    <article className="group flex h-full flex-col">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <ImageFrame
          image={product.image}
          alt={product.image?.alt ?? product.name}
          placeholder={`${shopPage.photoCaption} · ${product.name}`}
          ratio="aspect-[4/5]"
          orientation="portrait"
          tone="warm"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          zoomOnHover
        />
      </Link>
      <div className="flex flex-1 flex-col pt-space-md">
        {showingSamples ? (
          <p className="mb-space-xs text-label-sm uppercase text-secondary">{shopPage.sampleLabel}</p>
        ) : null}
        <Title className="text-headline-sm text-primary">
          <Link href={href} className="link-touch transition-colors duration-200 hover:text-secondary">
            {product.name}
          </Link>
        </Title>
        <p className="mt-space-xs flex flex-wrap items-baseline gap-x-space-md text-body-md">
          <span className="font-semibold text-foreground">{productPrice(product)}</span>
          {product.size ? <span className="text-muted">{product.size}</span> : null}
          {product.inStock === false ? (
            <span className="text-label-sm uppercase text-muted">{shopPage.outOfStock}</span>
          ) : null}
        </p>
        <div className="mt-auto pt-space-md">
          <Button href={orderHref(product)} target="_blank" rel="noopener noreferrer" variant="whatsapp">
            {cta.order}
            <span className="sr-only">: {product.name}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
