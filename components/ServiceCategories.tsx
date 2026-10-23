import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { salonSpa } from "@/data/site";

/**
 * The six salon & spa categories. Hairline cards like the rest of the site,
 * warmed with a square accent-washed icon tile — the service list under each
 * title is a placeholder until the client confirms it.
 */
export function ServiceCategories() {
  const { categories, categoriesIntro } = salonSpa;

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
              key={category.title}
              className="flex flex-col border border-border bg-card p-space-lg md:p-8 lg:p-10"
            >
              <span className="flex size-12 items-center justify-center bg-surface-warm text-secondary">
                <Icon name={category.icon} className="size-5" />
              </span>
              <h3 className="mt-space-lg text-headline-sm text-primary">
                {category.title}
              </h3>
              <p className="mt-space-sm text-body-sm text-muted">
                {category.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
