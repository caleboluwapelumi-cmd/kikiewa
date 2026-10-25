import type { Metadata } from "next";
import { Confirmable } from "@/components/Confirmable";
import { ContactForm } from "@/components/ContactForm";
import { LocationCard } from "@/components/LocationCard";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { contact, contactPage, locations, seo, whatsappHref } from "@/data/site";
import { telHref } from "@/lib/phone";
import { isUsableWhatsAppNumber } from "@/lib/whatsapp";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.contact);

/**
 * Contact (site plan, section 7): two location cards and a message form
 * that opens WhatsApp. Also the fallback for every WhatsApp and Call action
 * while those numbers are TBC, so it always shows what is (and isn't)
 * confirmed.
 */
export default function ContactPage() {
  const tel = telHref(contact.phone);
  const rows = [
    {
      label: contactPage.phoneLabel,
      value: tel ? (
        <a href={tel} className="link-rule hover:text-secondary">
          {contact.phone}
        </a>
      ) : (
        <Confirmable value={contact.phone} />
      ),
    },
    {
      label: contactPage.whatsappLabel,
      value: (
        <Confirmable
          value={contact.whatsapp}
          format={(number) =>
            isUsableWhatsAppNumber(number) ? (
              <a href={whatsappHref} className="link-rule hover:text-secondary">
                {number}
              </a>
            ) : (
              number
            )
          }
        />
      ),
    },
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

      <section aria-labelledby="contact-locations" className="w-full border-t border-border bg-surface py-space-2xl lg:py-space-3xl">
        <div className="shell">
          <h2 id="contact-locations" className="sr-only">
            {contactPage.locationsHeading}
          </h2>
          <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2 lg:gap-gutter-desktop">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} titleAs="h3" />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y w-full border-t border-border bg-background">
        <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <SectionHeading
            eyebrow={contactPage.form.eyebrow}
            heading={contactPage.form.heading}
            body={contactPage.form.body}
            className="lg:col-span-5"
          />
          <div className="border border-border bg-card p-space-lg md:p-10 lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
