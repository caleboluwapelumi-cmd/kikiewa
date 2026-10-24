import type { Metadata } from "next";
import { Confirmable } from "@/components/Confirmable";
import { LocationCard } from "@/components/LocationCard";
import { PageIntro } from "@/components/PageIntro";
import { contact, contactPage, locations, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.contact);

/**
 * Contact (site plan, section 7). Also the fallback for every WhatsApp and
 * Call action while those numbers are TBC, so it always shows what is (and
 * isn't) confirmed. The message form comes with the next step.
 */
export default function ContactPage() {
  const rows = [
    { label: contactPage.whatsappLabel, value: <Confirmable value={contact.whatsapp} /> },
    {
      label: contactPage.emailLabel,
      value: (
        <Confirmable
          value={contact.email}
          format={(email) => (
            <a href={"mailto:" + email} className="link-rule hover:text-secondary">
              {email}
            </a>
          )}
        />
      ),
    },
  ];

  return (
    <>
      <PageIntro copy={contactPage.intro}>
        <dl className="max-w-xl divide-y divide-border border-y border-border-strong">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[minmax(0,8rem)_1fr] items-baseline gap-space-md py-space-md"
            >
              <dt className="text-label-sm uppercase text-muted">{row.label}</dt>
              <dd className="text-body-md text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      </PageIntro>
      <section className="w-full border-t border-border bg-surface py-space-2xl lg:py-space-3xl">
        <div className="shell grid grid-cols-1 gap-gutter lg:grid-cols-2 lg:gap-gutter-desktop">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} titleAs="h2" />
          ))}
        </div>
      </section>
    </>
  );
}
