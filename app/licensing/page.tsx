import type { Metadata } from "next";
import { Confirmable } from "@/components/Confirmable";
import { Icon } from "@/components/Icon";
import { PageIntro } from "@/components/PageIntro";
import { footer, hasConfirmed, medicalSpa, pages, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.licensing);

/** Records are listed only once at least one of them is confirmed. */
export default function LicensingPage() {
  const records = [
    { icon: "verified" as const, label: "Business licence", value: footer.licence.value },
    ...medicalSpa.credentials,
  ];
  const confirmed = hasConfirmed(records.map((record) => record.value));

  return (
    <PageIntro copy={pages.licensing} className="pb-space-3xl">
      {confirmed ? (
        <dl className="max-w-3xl border-y border-border-strong">
          {records.map((record) => (
            <div
              key={record.label}
              className="grid grid-cols-1 gap-space-xs border-b border-border py-space-lg last:border-b-0 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-space-lg"
            >
              <dt className="flex items-center gap-space-sm text-label-sm uppercase text-muted">
                <Icon name={record.icon} className="size-4 shrink-0 text-secondary" />
                {record.label}
              </dt>
              <dd className="text-body-md text-primary">
                <Confirmable value={record.value} />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </PageIntro>
  );
}
