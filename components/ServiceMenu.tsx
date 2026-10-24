import { Button } from "@/components/Button";
import { Confirmable } from "@/components/Confirmable";
import { SectionHeading } from "@/components/SectionHeading";
import { Tag } from "@/components/Tag";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import {
  cta,
  serviceBookingHref,
  serviceMenus,
  servicePage,
  whatsappMessages,
  type ServiceSlug,
} from "@/data/site";
import { confirmedInProduction } from "@/lib/env";
import { formatDuration, formatPriceFrom } from "@/lib/format";

/**
 * One service's menu as a ruled list: name and line, then duration and
 * "from" price (or "To be confirmed"), then Book. Suggested names show on
 * previews with a tag and are left out in production. Consultation-led
 * items say so and book the consultation.
 */
export function ServiceMenu({ slug }: { slug: ServiceSlug }) {
  const items = confirmedInProduction(serviceMenus[slug]);

  return (
    <section className="section-y w-full border-t border-border bg-background">
      <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
        <SectionHeading heading={servicePage.menuHeading} className="lg:col-span-3" />

        {items.length === 0 ? (
          <div className="flex flex-col items-start gap-space-lg lg:col-span-9">
            <p className="max-w-[56ch] text-pretty text-body-lg text-muted">{servicePage.menuEmpty}</p>
            <WhatsAppAction label={cta.whatsapp} message={whatsappMessages.general} />
          </div>
        ) : (
          <ul className="border-t border-border-strong lg:col-span-9">
            {items.map((item) => (
              <li
                key={item.slug}
                className="grid grid-cols-1 gap-space-md border-b border-border py-space-lg md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-space-xl"
              >
                <div>
                  <h3 className="font-body text-title-lg text-foreground">{item.name}</h3>
                  <p className="mt-space-xs max-w-[56ch] text-pretty text-body-md text-muted">{item.summary}</p>
                  {item.requiresConsultation || !item.confirmed ? (
                    <p className="mt-space-sm flex flex-wrap gap-space-sm">
                      {item.requiresConsultation ? <Tag label={servicePage.consultationTag} /> : null}
                      {!item.confirmed ? <Tag label={servicePage.suggestedTag} /> : null}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col items-start gap-space-md md:items-end">
                  <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-space-md gap-y-space-xs text-body-sm md:text-right">
                    <dt className="text-label-sm uppercase text-muted">{servicePage.duration}</dt>
                    <dd className="text-foreground">
                      <Confirmable value={item.durationMins} format={formatDuration} />
                    </dd>
                    <dt className="text-label-sm uppercase text-muted">{servicePage.price}</dt>
                    <dd className="text-foreground">
                      <Confirmable value={item.priceFrom} format={formatPriceFrom} />
                    </dd>
                  </dl>
                  <Button href={serviceBookingHref(item)} variant="subtle" size="sm">
                    {item.requiresConsultation ? cta.consultation : cta.bookShort}
                    <span className="sr-only">: {item.name}</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
