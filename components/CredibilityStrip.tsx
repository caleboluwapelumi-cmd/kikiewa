import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { credibility, credibilityIntro } from "@/data/site";

export function CredibilityStrip() {
  return (
    <section className="w-full bg-surface-2 py-space-xl">
      <div className="shell">
        <SectionHeading
          eyebrow={credibilityIntro.eyebrow}
          heading={credibilityIntro.heading}
          as="h3"
          size="sm"
          className="mb-space-md"
        />

        <ul className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">
          {credibility.map((item) => (
            <li
              key={item.title}
              className="flex flex-col justify-between rounded-xs bg-background p-6 shadow-sm"
            >
              <div>
                <Icon name={item.icon} className="mb-4 size-7 text-secondary" />
                <h4 className="mb-2 text-title-md text-primary">{item.title}</h4>
                <p className="text-body-sm text-muted">{item.body}</p>
              </div>
              <span className="mt-6 block text-label-sm uppercase text-secondary">
                {item.standard}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
