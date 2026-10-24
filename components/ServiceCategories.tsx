import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { categoriesFor, isTBC, salonSpa } from "@/data/site";

/**
 * The six hair & beauty categories. Each card's id is its slug, the anchor
 * the nav and the Home tiles link to (/salon-spa#hair and so on). Hairline cards like the rest of the site,
 * warmed with a square accent-washed icon tile — the service list under each
 * title stays "To be confirmed" until the client confirms it.
 */
export function ServiceCategories() {
  const { categoriesIntro } = salonSpa;
  const categories = categoriesFor("salon-spa");

  return (
    <section className="section-y w-full bg-background">
      <div className="shell">
        <SectionHeading
          eyebrow={categoriesIntro.eyebrow}
          heading={categoriesIntro.heading}
          body={categoriesIntro.body}
          className="mb-space-2xl"
        />

        <ul className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3 lg:gap-gutter-desktop">
          {categories.map((category) => (
            <li
              key={category.slug}
              id={category.slug}
              className="flex flex-col border border-border bg-card p-space-lg transition-colors duration-300 target:border-accent md:p-8 lg:p-10"
            >
              <span className="flex size-12 items-center justify-center bg-surface-warm text-secondary">
                <Icon name={category.icon} className="size-5" />
              </span>
              <h3 className="mt-space-lg text-headline-sm text-primary">
                {category.name}
              </h3>
              {isTBC(category.summary) ? null : (
                <p className="mt-space-sm text-body-sm text-muted">{category.summary}</p>
              )}
            </li>
          ))}
        </ul>

        <Link
          href="/salon-spa/services"
          className="link-rule mt-space-xl inline-flex items-center gap-space-sm py-1 text-label-md uppercase text-primary hover:text-secondary"
        >
          View the service menu
          <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
