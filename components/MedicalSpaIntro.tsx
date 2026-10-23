import { Icon } from "@/components/Icon";
import { medicalSpa } from "@/data/site";

/**
 * Intro statement beside the licensing placeholder. The statement is set as
 * an editorial lead in the display face; the licence panel is a plain record
 * card with a plum top rule, so the unverified claim reads as a standing
 * note rather than a credential.
 */
export function MedicalSpaIntro() {
  const { intro } = medicalSpa;

  return (
    <section className="w-full border-t border-border bg-background pt-space-2xl pb-space-2xl md:py-space-3xl lg:pb-32">
      <div className="shell">
        <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <p className="max-w-[34em] text-pretty font-display text-lead-mobile text-foreground lg:col-span-7 lg:text-lead">
            {intro.body}
          </p>

          <aside className="self-start border border-t-2 border-border border-t-primary bg-card p-space-lg md:p-8 lg:col-span-4 lg:col-start-9">
            <p className="flex items-center gap-space-sm text-label-sm uppercase text-secondary">
              <Icon name="verified" className="size-4 shrink-0" />
              {intro.licenceLabel}
            </p>
            <p className="mt-space-md text-title-lg text-primary">
              {intro.licenceValue}
            </p>
            <p className="mt-space-md border-t border-border pt-space-md text-body-sm text-muted">
              {intro.note}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
