import { Confirmable } from "@/components/Confirmable";
import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { hasConfirmed, medicalSpa } from "@/data/site";

/**
 * Licence and credentials, set as a two-column record (label | value), like
 * a register entry. Renders nothing until at least one value is verified;
 * after that, the rest show "To be confirmed".
 */
export function CredentialsBlock() {
  const { credentials, credentialsIntro } = medicalSpa;
  if (!hasConfirmed(credentials.map((credential) => credential.value))) return null;

  return (
    <section className="section-y w-full border-y border-border bg-surface">
      <div className="shell">
        <div className="grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <SectionHeading
            eyebrow={credentialsIntro.eyebrow}
            heading={credentialsIntro.heading}
            body={credentialsIntro.body}
            className="lg:col-span-5"
          />

          <dl className="border-y border-border-strong lg:col-span-7">
            {credentials.map((credential) => (
              <div
                key={credential.label}
                className="grid grid-cols-1 gap-space-xs border-b border-border py-space-lg last:border-b-0 md:grid-cols-[minmax(0,14rem)_1fr] md:gap-space-lg"
              >
                <dt className="flex items-center gap-space-sm text-label-sm uppercase text-muted">
                  <Icon
                    name={credential.icon}
                    className="size-4 shrink-0 text-secondary"
                  />
                  {credential.label}
                </dt>
                <dd className="text-body-md text-primary">
                  <Confirmable value={credential.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
