import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { salonSpa } from "@/data/site";

/**
 * The six salon & spa categories. Built like the medical spa treatment cards,
 * warmed with an accent-tinted icon chip — the service list under each title
 * is a placeholder until the client confirms it.
 */
export function ServiceCategories() {
  const { categories, categoriesIntro } = salonSpa;

  return (
    <section className="w-full bg-background py-space-xl lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow={categoriesIntro.eyebrow}
          heading={categoriesIntro.heading}
          body={categoriesIntro.body}
          className="mb-space-xl"
        />

        <ul className="grid grid-cols-1 gap-gutter-desktop md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li
              key={category.title}
              className="flex flex-col border border-border bg-card p-8 lg:p-10"
            >
              <span className="flex size-12 items-center justify-center rounded-xs bg-accent/15 text-secondary">
                <Icon name={category.icon} className="size-6" />
              </span>
              <h3 className="mt-space-lg text-headline-sm text-primary">
                {category.title}
              </h3>
              <p className="mt-space-md text-body-sm text-muted">
                {category.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
