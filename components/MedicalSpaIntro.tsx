import { Icon } from "@/components/Icon";
import { medicalSpa } from "@/data/site";

/**
 * Intro statement beside the licensing placeholder. The licence panel is the
 * one soft-accent surface on the page, so the unverified claim reads as a
 * standing note rather than a credential.
 */
export function MedicalSpaIntro() {
  const { intro } = medicalSpa;

  return (
    <section className="w-full bg-background py-space-xl lg:py-28">
      <div className="shell">
        <div className="grid grid-cols-1 gap-gutter-desktop lg:grid-cols-12 lg:gap-16">
          <p className="text-body-lg text-foreground lg:col-span-7">
            {intro.body}
          </p>

          <aside className="border border-accent bg-accent/5 p-8 lg:col-span-5">
            <div className="flex items-center gap-space-sm text-secondary">
              <Icon name="verified" className="size-4 shrink-0" />
              <span className="text-label-sm uppercase">
                {intro.licenceLabel}
              </span>
            </div>
            <p className="mt-space-md text-title-lg text-primary">
              {intro.licenceValue}
            </p>
            <p className="mt-space-md text-body-sm text-muted">{intro.note}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
