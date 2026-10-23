import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { medicalSpa } from "@/data/site";

/**
 * Licence and credentials. Every value is a placeholder by design — the page
 * states what will be published here rather than implying it already is.
 */
export function CredentialsBlock() {
  const { credentials, credentialsIntro } = medicalSpa;

  return (
    <section className="w-full border-y border-border bg-card py-space-xl lg:py-28">
      <div className="shell">
        <div className="grid grid-cols-1 gap-gutter-desktop lg:grid-cols-12 lg:gap-16">
          <SectionHeading
            eyebrow={credentialsIntro.eyebrow}
            heading={credentialsIntro.heading}
            body={credentialsIntro.body}
            className="lg:col-span-5"
          />

          <dl className="divide-y divide-border border-y border-border lg:col-span-7">
            {credentials.map((credential) => (
              <div
                key={credential.label}
                className="flex items-start gap-space-md py-space-lg"
              >
                <Icon
                  name={credential.icon}
                  className="mt-1 size-5 shrink-0 text-secondary"
                />
                <div>
                  <dt className="text-label-sm uppercase text-muted">
                    {credential.label}
                  </dt>
                  <dd className="mt-space-xs text-body-md text-primary">
                    {credential.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
