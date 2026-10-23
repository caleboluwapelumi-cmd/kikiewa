import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { enrolment } from "@/data/site";

export function EnrolmentBanner() {
  return (
    <section className="w-full bg-surface-3 py-space-xl lg:py-24">
      <div className="shell">
        <div className="relative overflow-hidden rounded-xs bg-card p-8 shadow-md md:p-14 lg:p-16">
          {/* Soft accent wash, decorative only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-16 size-96 rounded-full bg-accent/20 blur-3xl"
          />

          <div className="relative z-10 grid grid-cols-1 items-center gap-gutter-desktop lg:grid-cols-12">
            <div className="flex flex-col lg:col-span-8">
              <p className="mb-space-md inline-flex w-fit items-center gap-2 rounded-xs bg-accent/30 px-3.5 py-1.5">
                <span className="size-2 rounded-full bg-secondary" />
                <span className="text-label-sm uppercase text-primary">
                  {enrolment.flag}
                </span>
              </p>

              <h2 className="mb-space-sm text-headline-lg-mobile text-primary lg:text-headline-lg">
                {enrolment.heading}
              </h2>
              <p className="mb-space-lg max-w-2xl text-body-lg text-muted">
                {enrolment.body}
              </p>

              <div className="flex flex-wrap items-center gap-space-md">
                <Button href={enrolment.primaryCta.href} size="lg">
                  {enrolment.primaryCta.label}
                </Button>
                <Button
                  href={enrolment.secondaryCta.href}
                  size="lg"
                  variant="subtle"
                  icon="download"
                  iconPosition="leading"
                >
                  {enrolment.secondaryCta.label}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xs bg-surface p-6 lg:col-span-4">
              <h3 className="text-label-sm uppercase text-secondary">
                {enrolment.programmesTitle}
              </h3>
              <ul className="flex flex-col gap-4">
                {enrolment.programmes.map((programme) => (
                  <li key={programme.name} className="flex items-start gap-3">
                    <Icon
                      name={programme.icon}
                      className="mt-0.5 size-5 shrink-0 text-primary"
                    />
                    <span className="flex flex-col">
                      <span className="text-body-sm font-semibold text-foreground">
                        {programme.name}
                      </span>
                      <span className="text-body-sm text-muted">
                        {programme.meta}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
